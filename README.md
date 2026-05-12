# Barlog

A small personal web app to log visits to bars and restaurants: where, what was ordered, how it was, and any notes. Single-user, mobile-friendly, all data stays in the browser (IndexedDB).

## Check it out

https://lars-derichter.github.io/barlog/

## Quick start

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — static build to `build/`
- `npm run preview` — serve the production build locally
- `npm run check` — `svelte-check` (TypeScript + Svelte diagnostics)
- `npm run lint` — Prettier + ESLint
- `npm run format` — Prettier write
- `npm run test:unit` — Vitest

See [CLAUDE.md](CLAUDE.md) for architecture, data model, and conventions.
