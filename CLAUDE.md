# CLAUDE.md

TesuTemo — Japanese testimonial video interview service website.

## Tech Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS v3
- framer-motion for scroll animations
- lucide-react for icons
- Node v20 installed at `~/.local/node/bin` (add to PATH)

## Commands

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev      # Dev server
npm run build    # Production build
```

## Structure

- `src/app/` — Pages (/, /recruitment, /municipality, /university, /case-study)
- `src/components/` — Header, Footer, FadeIn, ContactForm, RssFeed, SubpageLayout, PricingSection, etc.
- Brand colors: primary orange #e95228, accent blue/purple #7e91cf
- Clean, modern, professional Japanese business site
- Contact form via Web3Forms API
- RSS feed from note.com/chris_moore
