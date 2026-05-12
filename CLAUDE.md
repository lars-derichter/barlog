# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Barlog is a small personal app for Lars to log visits to bars and restaurants: where he went, what he ordered, how he liked it, and any notes. Single-user, hobby scope, mobile-friendly web app, all data stays on the device.

## Stack

- **SvelteKit** with Svelte 5 (runes mode) + `@sveltejs/adapter-static`, configured with `fallback: 'index.html'` so the build is a pure SPA.
- **`ssr = false`** and **`prerender = false`** in the root `+layout.ts`: the app is client-only because all data lives in IndexedDB.
- **Dexie** over IndexedDB for persistence ([src/lib/db.ts](src/lib/db.ts)).
- **Tailwind CSS v4** (CSS-first config in [src/routes/layout.css](src/routes/layout.css)) with the `@tailwindcss/forms` plugin.
- **TypeScript**, ESLint, Prettier, Vitest.

PWA manifest and service worker are not in yet; add when offline install becomes worth it.

## Commands

```sh
npm install
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # static build to build/
npm run preview      # serve the built site
npm run check        # svelte-check (type + Svelte diagnostics)
npm run lint         # prettier --check + eslint
npm run format       # prettier --write
npm run test:unit    # Vitest
```

## Architecture

The app is a single-user SPA. The Dexie store is the source of truth; everything else (UI state, draft) is derived.

- **Persistence** — [src/lib/db.ts](src/lib/db.ts) defines a single Dexie database `barlog` with one store `visits` (`id, visitedAt, venue`). All reads and writes go through the helpers exported from this file (`listVisits`, `getVisit`, `createVisit`, `updateVisit`, `deleteVisit`, `venueSuggestions`). Don't import `db` directly from pages; add a helper if a new query is needed. Schema changes need a new `version(N).stores({ ... })` block and, if data is reshaped, an `.upgrade()` migration.
- **Types** — [src/lib/types.ts](src/lib/types.ts) defines `Visit` (the stored shape) and `VisitDraft` (the wizard's in-flight shape, missing `id`/`createdAt`/`updatedAt`).
- **Wizard draft** — [src/lib/draft.svelte.ts](src/lib/draft.svelte.ts) exports a single `$state` object `draft` shared across all wizard steps, plus `resetDraft()` and `loadDraft()`. The draft is in-memory only; reloading mid-wizard discards it (intentional).
- **Routes**
  - `/` ([src/routes/+page.svelte](src/routes/+page.svelte)) — history list, newest first, with a search input that filters venue + orders + notes client-side.
  - `/visit/new/*` — the wizard. `/visit/new` redirects to `/visit/new/venue`. The shared chrome (progress bar, cancel) is in [src/routes/visit/new/+layout.svelte](src/routes/visit/new/+layout.svelte); each step is its own `+page.svelte`. Step order: `venue` → `when` → `orders` → `rating` → `notes` → `review`. The review step calls `createVisit`, resets the draft, and goes back to `/`.
  - `/visit/[id]` ([src/routes/visit/%5Bid%5D/+page.svelte](src/routes/visit/%5Bid%5D/+page.svelte)) — detail/edit form with delete. Reuses no wizard state; loads via `getVisit` and writes via `updateVisit` / `deleteVisit`.
- **Components** — [src/lib/components/Stars.svelte](src/lib/components/Stars.svelte) is the 1–5 star rating; tappable stars in entry/edit mode, plain text in `readonly` mode. Tapping the currently-selected star clears it (so "no rating" is reachable).
- **Date formatting** — [src/lib/format.ts](src/lib/format.ts) wraps `Intl.DateTimeFormat` with `nl-BE` locale, plus helpers to convert between ISO strings and `<input type="datetime-local">` values.

## Data model

```ts
type Visit = {
  id: string;            // uuid
  visitedAt: string;     // ISO datetime
  venue: string;
  venueType?: 'bar' | 'restaurant' | 'other';
  orders: string[];      // ≥1 entry required at save time
  rating?: number;       // integer 1–5, or undefined for "no rating"
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

Required at save: `venue` (non-empty) and at least one non-empty `orders` entry. Everything else is optional.

## Conventions

- UI copy in Flemish Dutch. Tech terms stay English (selector, deploy, framework) and take Dutch articles and plurals.
- Sentence case for headings and UI labels. Never title case.
- No AI-tell openers, no decorative tricolons, no scattered bold in prose.
- Svelte 5 runes only — `$state`, `$derived`, `$effect`, `$props`. No `let`/`$:` legacy reactivity.
- Reactive state lives in `.svelte.ts` files when it needs to be shared between components (Vite refuses runes in plain `.ts`).
