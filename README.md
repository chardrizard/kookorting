# Kookorting

Dutch supermarket protein deals → AI-generated recipes. Pick a discounted protein on offer this week, pick a cuisine, get three tailored recipes in Dutch.

## Stack

- **Frontend:** React + TypeScript + Vite, Tailwind CSS, shadcn-ui
- **Backend:** Supabase (Postgres + Edge Functions)
- **LLM:** Google Gemini `gemini-2.5-flash-lite` via Supabase Edge Function
- **Hosting:** GitHub Pages (`chardrizard.github.io/kookorting`)

## Local dev

```sh
npm install
npm run dev
```

Requires Node.js. No build step needed beyond `npm run dev`.

## Deploy

Push to `main` → GitHub Actions deploys to GitHub Pages automatically.

## Edge function

`supabase/functions/generate-recipes` — brokers calls to Gemini and enforces per-IP rate limits. Deploy via Supabase CLI.

## Weekly data workflow

See [AGENTS.md](AGENTS.md) for the full transcription and import process (screenshots → CSV → Supabase).

## Docs

- [AGENTS.md](AGENTS.md) — operating manual for AI agents, weekly workflow, scoring formula
- [DOCUMENTATION.md](DOCUMENTATION.md) — architecture, data flow, component map
