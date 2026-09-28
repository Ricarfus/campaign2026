# Hudson & Rufus — Campaign Site

Single-page, bilingual (EN/FR) campaign site for the 2026 student council election at
École Secondaire Jules Verne. Built with Next.js (App Router) and plain CSS.

Design specification: `../campaign-website-design-sheet.md` (source of truth for palette,
typography, layout, motion and copy).

## Local development

Node 20.9+ is required. pnpm is pinned via `packageManager` in `package.json`, so no global
install is needed:

```bash
corepack pnpm install
corepack pnpm dev      # http://localhost:3000
corepack pnpm build    # production build
corepack pnpm start    # serve the production build
```

## Deploying (Vercel)

Deploy this repository yourself — do **not** use v0's "Publish" button. The "Built with v0"
badge is injected by v0's publishing pipeline, not present in this source, so a normal
deploy of this repo has no badge.

### Option A — GitHub + Vercel dashboard

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

Then import the repo at vercel.com/new. Vercel auto-detects Next.js and pnpm; no extra
configuration is needed.

### Option B — Vercel CLI (no GitHub required)

```bash
npm i -g vercel
vercel          # first run links/creates the project
vercel --prod   # production deploy
```

### Before you push

The local git identity was set to a placeholder. Update it so commits are attributed to you:

```bash
git config user.name "Your Name"
git config user.email "your-github-email@example.com"
```

## Structure

```
app/
  layout.tsx        document shell, metadata, fonts
  page.tsx          composes the sidebar, top bar, toggle and sections
  globals.css       the whole visual system (tokens, type scale, layout, motion fallbacks)
components/
  sidebar-nav.tsx        desktop rail (>=1024px)
  mobile-topbar.tsx      mobile/tablet top bar (<1024px)
  language-toggle.tsx    EN | FR switch
  hero-section.tsx       #home
  duo-section.tsx        #duo
  promises-section.tsx   #promises
  vote-section.tsx       #vote + footer
  typewriter-heading.tsx shared scroll-reveal headline
lib/
  i18n.tsx          all copy (EN/FR dictionary) and the language context
public/assets/      logo and favicon files
```

## Changing copy

All visible text lives in the `I18N` object in `lib/i18n.tsx`. Edit that dictionary only;
never hard-code strings into components.

## Open items

- Promises descriptions and the French copy are drafts (see Section 10 / 13 of the design sheet).
- Portraits are CSS placeholders until real 4:5 headshots are supplied.
- `INSTAGRAM_URL` in `components/vote-section.tsx` is empty, so the follow link is hidden.
