# OG image sources

`opengraph-image.ja.tsx` / `opengraph-image.en.tsx` are the *source* of the
social share cards. They are **not routes** — the leading `_` makes this a Next.js
private folder, so nothing here is served.

## Why the cards are static PNGs

These files used to sit at `src/app/opengraph-image.tsx` and
`src/app/(en)/en/opengraph-image.tsx`, where Next's file convention turned them
into on-demand edge functions. That gave `og:image` a URL like
`https://www.tesutemo.co/opengraph-image?<hash>` — no image extension, and a cold
start on every crawl. Link unfurlers (Google Chat, Slack, LINE) have short fetch
timeouts and some skip URLs that don't look like an image file; when the fetch
fails they fall back to scraping the page, which served up a random hero photo
(`/hero-1.png`) instead of the brand card.

The rendered output is now committed as `opengraph-image.png` next to each
layout, so `og:image` is a plain static PNG on the CDN — instant, no function
invocation, `.png` in the URL.

## Regenerating after a design change

1. Edit the `.tsx` here.
2. Copy it back into place as a route, temporarily:

   ```bash
   cp src/app/_og-source/opengraph-image.ja.tsx src/app/opengraph-image.tsx
   cp src/app/_og-source/opengraph-image.en.tsx "src/app/(en)/en/opengraph-image.tsx"
   ```

3. Build, serve, and pull the PNGs (the `.tsx` route wins over the `.png` while
   both exist, so this renders the new design):

   ```bash
   export PATH="$HOME/.local/node/bin:$PATH"
   npm run build && PORT=3111 npm run start &
   curl -s localhost:3111/opengraph-image -o src/app/opengraph-image.png
   # the EN route gets a hashed path — read it off the `npm run build` route table
   curl -s localhost:3111/en/opengraph-image-<hash> -o "src/app/(en)/en/opengraph-image.png"
   ```

4. Delete the two temporary `.tsx` routes, rebuild, and confirm the route table
   lists `/opengraph-image.png` as `○` (static), not `ƒ` (dynamic).
5. Commit the regenerated PNGs — a push to `origin` is what deploys them.

If you change the alt text, update `opengraph-image.alt.txt` alongside the PNG;
that file is what fills `og:image:alt`.
