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

## SubpageLayout props (EN/JP subpages)

Key props: `heroTitle`, `heroSubtitle`, `problemHeading`, `problemSubheading`, `problems[]`, `problemConclusion`, `solutionTitle`, `solutionSubtitle`, `solutionPoints[]`, `videoSectionTitle`, `videoSectionSubtitle`, `videoHorizontalDesc`, `videoVerticalDesc`, `onlineFeatures[]`, `horizontalVideos[]`, `verticalVideos[]`, `locale`, `companyLabel`, `companyPlaceholder`

Problem → solution section: unified visual flow (problems list → ↓ arrow → red consequence card → "TesuTemo solves this" label → orange solution card). Locale-aware label: EN "TesuTemo solves this" / JP "テステモが解決します"

## EN subpage content notes

All 3 EN pages (university, recruitment, municipality) use natural English copy (not literal JP translation). Key style: contractions, em-dashes, "do any of these sound familiar?", "The result?" opener. Hero pattern: "Attract more of the [X] you want with real [Y] voices."

## PricingSection

- Both SNS Plan (¥120k) and SNS+上映 Plan (¥180k) show "per interviewee" / "1人につき" below the price
- No "1 Interview" bullet point (removed — redundant with per-person pricing label)
- Options (¥30k each): Interview Article + Full Interview Video
- Min 3 interviewees; 15% discount per person for 4+
- `whitespace-pre-line` removed from benefit card descriptions — text wraps naturally

## Deploy

```bash
cd /Users/a25_11/Documents/claude/tesutemo && PATH="/usr/local/bin:$PATH" npx vercel --prod
```
