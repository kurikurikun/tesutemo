-- Tesutemo「聞いてみる」Answer Engine — schema v1 (applied 2026-09-13 as migration ae_schema_v1)
-- Target: Supabase project zmbvcsowniyrtaleluoc (same project as Lite / survey).
--
-- BRAND RULE (real voices only): answer_text is what the person actually said.
-- Labels and synthetic questions are generated, and exist only to FIND and DESCRIBE
-- a clip. They are never shown as a verbatim quote.
--
-- Access model: RLS on, no anon/authenticated policies at all. The widget never
-- talks to Supabase directly — only the Next.js API route (service key) does.
-- Unlike the survey_* tables, nothing here is granted to anon.

create extension if not exists vector with schema extensions;

-- ── instances ──────────────────────────────────────────────────────────────
create table public.ae_instances (
  slug            text primary key,                 -- 'techcrew' | 'comas'
  name            text not null,
  header_ja       text not null,                    -- 先輩社員に聞いてみる
  header_en       text not null,
  subline_ja      text not null default 'AIが探しますが、答えるのは本物の人間です。',
  subline_en      text not null default 'AI finds it. A real person answers it.',
  miss_threshold  real not null default 0.75,       -- tuned by hand per embedding model
  cta_url         text not null default 'https://tesutemo.co/#contact',
  is_public       boolean not null default false,   -- stays false until Dore-san OKs it
  created_at      timestamptz not null default now()
);

-- ── speakers ───────────────────────────────────────────────────────────────
create table public.ae_speakers (
  id           uuid primary key default gen_random_uuid(),
  instance     text not null references public.ae_instances(slug) on delete cascade,
  key          text not null,                       -- 'noda', 'shimizu' — pipeline handle
  name_ja      text not null,
  name_en      text not null,
  role_ja      text not null,
  role_en      text not null,
  photo_url    text,
  sort_order   int not null default 0,
  unique (instance, key)
);

-- ── sources: one row per raw interview (the full-length master) ────────────
create table public.ae_sources (
  id              uuid primary key default gen_random_uuid(),
  instance        text not null references public.ae_instances(slug) on delete cascade,
  speaker_id      uuid not null references public.ae_speakers(id) on delete cascade,
  key             text not null,                    -- 'noda_edit_b', 'noda_master'
  -- Where the source video lives. Test corpus = edited deliverables on Vimeo
  -- (fully approved, safe to scrub). Full raw masters go to CF Stream and are
  -- never played publicly — only per-unit clips are.
  video_provider  text not null check (video_provider in ('vimeo','stream')),
  video_id        text,
  video_hash      text,                             -- Vimeo unlisted h= value
  duration_sec    real not null,
  lang            text not null check (lang in ('ja','en')),
  source_file     text,                             -- local path / sha for reproducibility
  transcript_source text not null,                  -- 'vimeo_autogen' | 'resolve_srt' | 'whisper'
  pipeline_meta   jsonb not null default '{}',
  created_at      timestamptz not null default now(),
  unique (instance, key)
);

-- ── units: one answer = one playable clip ──────────────────────────────────
create table public.ae_units (
  id                uuid primary key default gen_random_uuid(),
  instance          text not null references public.ae_instances(slug) on delete cascade,
  source_id         uuid not null references public.ae_sources(id) on delete cascade,
  speaker_id        uuid not null references public.ae_speakers(id) on delete cascade,
  seq               int not null,                   -- order within source
  start_sec         real not null,                  -- on the master clock
  end_sec           real not null,
  -- CF Stream clip of exactly [start,end]. Null = play the source video from
  -- start_sec and stop at end_sec (OK only when the whole source is approved).
  clip_video_id     text,
  -- Verbatim transcript. answer_text_asr is the untouched transcript output;
  -- answer_text may only be corrected to match the audio better (mis-heard terms),
  -- never reworded. Both are kept so every correction is auditable.
  answer_text_asr   text not null,
  answer_text       text not null,
  -- GENERATED caption describing the clip (「Q. 残業はどのくらい？」). Not a quote.
  display_label_ja  text not null,
  display_label_en  text not null,
  synthetic_questions jsonb not null default '[]',  -- [{lang, style, text}] — kept for QA/re-embed
  lang              text not null check (lang in ('ja','en')),
  tags              text[] not null default '{}',
  status            text not null default 'draft'
                    check (status in ('draft','approved','hidden')),
  chip_order        int,                            -- non-null = shown as a suggested chip
  qa_notes          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (end_sec > start_sec),
  unique (source_id, seq)
);
create index ae_units_instance_status on public.ae_units (instance, status);

-- ── embeddings: many rows per unit (each synthetic question + the answer) ──
-- 1024 dims works for Voyage and for OpenAI text-embedding-3-* (dimensions=1024).
-- No ANN index on purpose: ~60 units × ~7 rows per instance is a few hundred rows,
-- an exact scan is sub-millisecond, and HNSW + an instance filter can drop recall.
create table public.ae_embeddings (
  id          bigint generated always as identity primary key,
  unit_id     uuid not null references public.ae_units(id) on delete cascade,
  instance    text not null references public.ae_instances(slug) on delete cascade,
  kind        text not null check (kind in ('synthetic_question','answer_text','display_label')),
  lang        text not null check (lang in ('ja','en')),
  content     text not null,
  model       text not null,                        -- guards against mixing models
  embedding   extensions.vector(1024) not null
);
create index ae_embeddings_instance on public.ae_embeddings (instance, model);
create index ae_embeddings_unit on public.ae_embeddings (unit_id);

-- ── query log: every query, hit or miss (miss_log is a view over it) ───────
-- Logging hits too is what lets the threshold be tuned from real data.
create table public.ae_queries (
  id            bigint generated always as identity primary key,
  instance      text not null references public.ae_instances(slug) on delete cascade,
  query         text not null,
  ui_lang       text check (ui_lang in ('ja','en')),
  via           text not null check (via in ('chip','typed','deeplink')),
  best_score    real,
  best_unit_id  uuid references public.ae_units(id) on delete set null,
  is_miss       boolean not null,
  created_at    timestamptz not null default now()
);
create index ae_queries_instance_time on public.ae_queries (instance, created_at desc);

create view public.ae_miss_log with (security_invoker = true) as
  select id, instance, query, ui_lang, best_score, best_unit_id, created_at
  from public.ae_queries where is_miss;

-- ── plays ──────────────────────────────────────────────────────────────────
create table public.ae_plays (
  id          bigint generated always as identity primary key,
  unit_id     uuid not null references public.ae_units(id) on delete cascade,
  instance    text not null,
  via         text not null check (via in ('chip','typed','deeplink','related')),
  created_at  timestamptz not null default now()
);

-- ── search: best score per unit, approved units only ───────────────────────
create or replace function public.ae_match_units(
  p_instance text, p_model text, p_query extensions.vector(1024), p_limit int default 3,
  -- which kinds of text to search against; lets us A/B "answer transcript only"
  -- versus "transcript + synthetic questions" on identical data
  p_kinds text[] default array['synthetic_question','answer_text','display_label']
) returns table (unit_id uuid, score real, matched_kind text, matched_content text)
language sql stable
set search_path = ''
as $$
  select * from (
    select distinct on (e.unit_id)
           e.unit_id, (1 - (e.embedding operator(extensions.<=>) p_query))::real as score,
           e.kind, e.content
    from public.ae_embeddings e
    join public.ae_units u on u.id = e.unit_id and u.status = 'approved'
    where e.instance = p_instance and e.model = p_model and e.kind = any(p_kinds)
    order by e.unit_id, e.embedding operator(extensions.<=>) p_query
  ) best
  order by best.score desc
  limit p_limit
$$;

-- ── lock everything down ───────────────────────────────────────────────────
alter table public.ae_instances  enable row level security;
alter table public.ae_speakers   enable row level security;
alter table public.ae_sources    enable row level security;
alter table public.ae_units      enable row level security;
alter table public.ae_embeddings enable row level security;
alter table public.ae_queries    enable row level security;
alter table public.ae_plays      enable row level security;
-- RLS with no policies already blocks anon; revoke as well so nothing depends on
-- a policy never being added by mistake.
revoke all on public.ae_instances, public.ae_speakers, public.ae_sources, public.ae_units,
              public.ae_embeddings, public.ae_queries, public.ae_plays, public.ae_miss_log
  from anon, authenticated;
revoke execute on function public.ae_match_units from anon, authenticated, public;
-- The server uses an sb_secret_ key (service_role). Grant explicitly — the Lite
-- tables needed this for that key format.
grant all on public.ae_instances, public.ae_speakers, public.ae_sources, public.ae_units,
             public.ae_embeddings, public.ae_queries, public.ae_plays, public.ae_miss_log
  to service_role;
grant usage on all sequences in schema public to service_role;
grant execute on function public.ae_match_units to service_role;
