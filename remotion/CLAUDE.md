# Remotion Project — TesuTemo client video captions

## Project Overview
Caption/motion-graphics compositions for TesuTemo's client testimonial videos, rendered as alpha-channel overlays for compositing on top of picture in DaVinci Resolve. One `src/clients/<client>/` folder per client — this keeps client-specific styling isolated while sharing the caption engine.

## Structure
- `src/captions/CaptionsOverlay.tsx` — shared, client-agnostic TikTok-style word-highlight caption renderer. Takes `captions: Caption[]` (from `@remotion/captions`) and a `CaptionStyle` (font, colors, placement). Reuse this for every future client.
- `src/clients/<client>/style.ts` — that client's `CaptionStyle` (font, text color, highlight color, shadow, placement).
- `src/clients/<client>/captions/*.json` — per-video caption data, word-level `Caption[]` JSON, imported directly (not fetched — `resolveJsonModule` is on in tsconfig).
- `src/clients/<client>/<Client>Short.tsx` — the composition component(s) for that client: `Preview` (dark bg, for reviewing in Studio) + plain/`Alpha` (transparent bg, for the real export).
- `src/Root.tsx` — registers one `Preview` + one `Alpha` Composition per video.

## Current client: Comas (Ariel Thorpe testimonial)
- Source project: DaVinci Resolve `26_6_comas2`, 4 short cuts built from the revised `26_7_16_Ariel_A_story` / `26_7_16_Ariel_B_method` long-forms.
- Format: 1920x1080, 24fps (matches the DaVinci timeline).
- 4 shorts: `ComasHookAppsGarbage`, `ComasMethodLetsStruggle`, `ComasResultsRecommend`, `ComasCloserMtfuji` (durations 1424/2493/1763/507 frames).
- Caption text/timing pulled from the finalized subtitle tracks the user built in Resolve; word-level timing is *approximated* by splitting each subtitle chunk proportionally by character length (Resolve's subtitles aren't per-word) — re-check against picture and retime by hand if a highlight looks off.
- `closer_mtfuji.json` is an empty caption array — that short had no subtitle track content as of 2026-07-17. Regenerate once captions are added in Resolve.
- **Style is a placeholder** (`src/clients/comas/style.ts`): white text, amber `#FFD84D` highlight, Inter 800. No Comas brand colors/font/logo exist anywhere in the project — swap this file once real brand direction is provided. Do NOT reuse TesuTemo's own brand colors (`#e95228` orange / `#7e91cf` blue-purple) for Comas — TesuTemo is the production company, Comas is the client.
- Known content typo fixed in `hook_apps_garbage.json`: Resolve subtitle read "The ntroduction that Comas offers," — corrected to "The introduction..." here. Fix at the source in Resolve too if you haven't already.

## Render Settings
Alpha exports: `--codec=prores --prores-profile=4444 --image-format=png --pixel-format=yuva444p10le` (baked into `calculateMetadata` on the `*Alpha` compositions already).

## Dev Server
- Remotion Studio: `npm run dev` on port 3001 (kept off 3000 so it doesn't collide with the separate Carro Japan remotion project). Config: `.claude/launch.json`.

## Relationship to the rest of this repo
This is a separate Node project nested inside the `tesutemo` repo (its own `package.json`/`node_modules`), not part of the Next.js site. It exists here because TesuTemo (the site) is the production company commissioning this work — keeping it in-repo makes sense as more client video edits get added over time.
