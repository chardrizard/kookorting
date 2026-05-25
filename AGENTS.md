# AGENTS.md — Kookorting

Operating manual for AI agents working in this repo. Read this before doing anything substantial.

## What this is

**Kookorting** = Dutch supermarket protein deals → AI recipe suggestions. User picks discounted proteins on offer this week, picks a cuisine, gets a generated recipe. Built originally with Lovable, now edited locally.

## Stack

- **Frontend:** Vite + React + TypeScript, Tailwind, shadcn-ui (Radix primitives). Not vanilla — this project predates the "no frameworks" default in the global CLAUDE.md.
- **Backend:** Supabase (Postgres + Edge Functions). Project id `bddqqitjdfbtsqkitfim`.
- **Edge function:** `supabase/functions/generate-recipes` (calls an LLM, returns recipe JSON).
- **Build:** `npm run dev` / `npm run build` / `npm test` (vitest).

## Live + repo

- **Repo:** [github.com/chardrizard/kookorting](https://github.com/chardrizard/kookorting) (`origin/main`)
- **Lovable project:** [lovable.dev/projects/0470b2b1-2373-42df-9690-b7f2af5d99d7](https://lovable.dev/projects/0470b2b1-2373-42df-9690-b7f2af5d99d7) — pushes to `main` auto-deploy via Lovable. Changes made in Lovable also auto-commit back to this repo.
- **Hosting:** Lovable-managed (no `vercel.json` / `netlify.toml` / GH Actions in repo).

## Repo map

```
src/
  pages/         Index, Selection, Aanbiedingen, Results, Atelier, About, LoadingScreen, NotFound
  components/protein/   ProteinCard, etc.
  hooks/         useProteinData, useRecipeGeneration, useRecipeStore
  lib/
    promo-codes.ts      *** source of truth for the 4 promo sentinels ***
    price-utils.ts      calculateOriginalPrice (skips strike-through for promo codes)
    protein-data.ts     types + supermarket list
supabase/
  config.toml
  functions/generate-recipes/
  migrations/
groceries_data/                Weekly CSV imports live here (e.g. W4MEI26.csv)
  groceries_source/            Screenshots, named "<Supermarket> <timestamp>.png"
  Korting recept directory.xlsx   Legacy workbook (one sheet per week)
```

`src/pages/Atelier.tsx` is an in-progress redesign of the selection page — coexists with `Selection.tsx`. Don't unify them without asking.

## Weekly transcription workflow

The recurring task: take screenshots of supermarket promo pages, transcribe into a CSV, import to Supabase. **Saturday or Sunday, when supermarkets refresh weekly promos.** Multiple supermarkets per batch is fine.

### Start of session

1. **Read [groceries_data/HISTORY.md](groceries_data/HISTORY.md)** — what's the most recent batch? What's the next expected week code?
2. **Check `groceries_data/groceries_source/`** (the live folder, not `archive/`). Fresh screenshots should be there. If empty, ask Richard.
3. Note the new week code (`W1JUN26`, etc.).

### End of session

After Supabase import succeeds:

1. **Append a row to [groceries_data/HISTORY.md](groceries_data/HISTORY.md)** with status ✅, row count, supermarket breakdown.
2. **Archive the screenshots:** `mv groceries_data/groceries_source/*.png groceries_data/groceries_source/archive/<week>/`. This empties the live folder, so next session knows to wait for fresh drops.
3. **Verify production** — refresh the live site, spot-check a few of the new entries' prices and discount badges.

### 1. Drop screenshots in `groceries_data/groceries_source/`
Rename to start with the supermarket name (e.g. `Albert Heijn 2026-05-25 at 18.54.53.png`). Mixed supermarkets in one batch is fine — read the branding per shot.

### 2. Create the CSV `groceries_data/W<week><MONTH><YY>.csv`
Naming follows the existing xlsx sheet convention (`W4MEI26` = week 4, May, 2026).

Header (exact order matters for Supabase):
```
name,brand,supermarket,weight,weight_unit,price_before,price_after,discount_percentage,promotion_start_date,promotion_end_date,protein_per_100g,carbs_per_100g,fiber_per_100g,fat_per_100g,calories_per_100g,rating,points,active,vegan
```

**Per-field rules:**
- `name` — strip the brand prefix if present (e.g. "AH Rundergehakt" → name=`Rundergehakt`, brand=`AH`).
- `brand` / `supermarket` — supermarket is the store ("Albert Heijn"), brand is the product line ("AH", "Wahid", "AH Terra", etc.).
- `weight` / `weight_unit` — drop "ca." prefixes, store the number. Unit usually `g`.
- `price_before` / `price_after` — for promo codes (see below), prices are unchanged; for real % discounts, use both.
- `discount_percentage` — real % (e.g. `25`) OR a promo sentinel (`101`–`104`, see below).
- Dates — `YYYY-MM-DD`. Read from "Geldig X t/m Y" banner.
- Macros — read from nutrition label if visible; otherwise estimate from product category (chicken breast ~23g protein, ground beef ~19g, salmon ~20g, tofu ~8g, etc.).
- `rating` / `points` — **must be precomputed** (NOT NULL in DB). Formula below.
- `active` — `TRUE` if today is between start and end; otherwise `FALSE`.
- `vegan` — boolean.

### 3. Compute `rating` and `points`

The points formula favors protein value first, then promo strength, protein density, and calorie efficiency. Promo codes are remapped to effective discounts before scoring:

```python
EFFECTIVE = {101: 50, 102: 50, 103: 33, 104: 25}  # see promo-codes.ts

def clamp_score(value):
    return max(0, min(100, value))

raw = float(row['discount_percentage'])
disc = EFFECTIVE.get(int(raw), raw)
weight_g = float(row['weight']) * (1000 if row['weight_unit'] == 'kg' else 1)
protein = float(row['protein_per_100g'])
calories = float(row['calories_per_100g'])
price = float(row['price_after'])
effective_price = price * (1 - disc / 100) if int(raw) in EFFECTIVE else price

total_protein = weight_g * protein / 100
protein_per_euro = total_protein / effective_price if effective_price > 0 else 0
protein_per_100_kcal = protein / (calories / 100) if calories > 0 else 0

points = (
    0.40 * clamp_score((protein_per_euro / 35) * 100)
    + 0.25 * clamp_score((disc / 50) * 100)
    + 0.20 * clamp_score((protein / 25) * 100)
    + 0.15 * clamp_score((protein_per_100_kcal / 15) * 100)
)
rating = round(points / 20, 1)
```

Weights: 40% protein per euro, 25% discount/promo strength, 20% protein per 100g, 15% protein per calorie. Capped at 100.

### 4. Import to Supabase
Table Editor → `protein-list` → Insert → Import data from CSV. Don't include `id` column — it auto-generates (sequence set up via the migration in §Database below).

## Promo code convention

`discount_percentage` doubles as a "promo type" flag. Real % discounts: `1`–`99`. Sentinels (>100, can't collide):

| Code | Promo | Display label | Effective % (for points) |
|---|---|---|---|
| `101` | OP=OP (clearance) | "OP=OP" | 50 |
| `102` | 1+1 gratis | "1+1" | 50 |
| `103` | 2+1 gratis | "2+1" | 33 |
| `104` | 2e halve prijs | "2e ½" | 25 |

For promo codes, `price_before == price_after` (price doesn't actually drop — the code is just a signal). The UI suppresses the strike-through original price for these codes.

**Source of truth:** [src/lib/promo-codes.ts](src/lib/promo-codes.ts). Adding a new promo type? Add it there and the display surfaces ([ProteinCard.tsx](src/components/protein/ProteinCard.tsx), [Atelier.tsx](src/pages/Atelier.tsx)) pick it up via the lookup table.

### Discount display rules

Cards use a 3-tier resolution (in [ProteinCard.tsx](src/components/protein/ProteinCard.tsx) and [Atelier.tsx](src/pages/Atelier.tsx)):

1. **Promo code (>100):** show the label ("2+1", "1+1", etc.), suppress the strike-through.
2. **`price_before > price_after`:** compute `% = round((before-after)/before·100)` from the real prices. Show `price_before` as strike-through. The stored `discount_percentage` is **ignored** in this branch — derive from prices.
3. **Else:** show "Actie" or no badge.

This makes the UI robust against stale or wrong `discount_percentage` values in the DB. The hook ([useProteinData.tsx](src/hooks/useProteinData.tsx)) wires `price_before` into the `ProteinWithDetails` type as `priceBefore?`.

## Database

- **Table:** `"protein-list"` (kebab-case — must be quoted in SQL).
- **`id`:** auto-generated via sequence `"protein-list_id_seq"`. Don't include in CSVs.
- **`points` / `rating`:** NOT NULL. Precompute before import.
- **Migrations** in `supabase/migrations/`.

If a new instance of the DB is set up, run this once to enable id auto-generation:

```sql
CREATE SEQUENCE IF NOT EXISTS "protein-list_id_seq" OWNED BY "protein-list".id;
SELECT setval('"protein-list_id_seq"', COALESCE((SELECT MAX(id) FROM "protein-list"), 0) + 1, false);
ALTER TABLE "protein-list" ALTER COLUMN id SET DEFAULT nextval('"protein-list_id_seq"');
```

## Extraction prompt (current)

Use this for screenshot-to-CSV runs:

> Extract product info from the supermarket screenshots and output a CSV with header:
> `name,brand,supermarket,weight,weight_unit,price_before,price_after,discount_percentage,promotion_start_date,promotion_end_date,protein_per_100g,carbs_per_100g,fiber_per_100g,fat_per_100g,calories_per_100g,rating,points,active,vegan`
>
> Rules:
> - If brand prefix appears in product name, strip it.
> - Dates in `YYYY-MM-DD`. Read from "Geldig X t/m Y".
> - Estimate macros from product category when not shown on label.
> - For promo codes (prices unchanged, code signals type):
>   - `101` = OP=OP, `102` = 1+1, `103` = 2+1 gratis, `104` = 2e halve prijs
> - For real % discounts, compute from price_before / price_after.
> - Compute `points` using the formula in AGENTS.md §3 (use the EFFECTIVE map for promo codes). `rating = round(points/20, 1)`.
> - `active` = TRUE if today is in [start, end].
> - Ignore products from other supermarkets when a target supermarket is given.

## What not to do

- Don't reintroduce the old `76` / `77` codes. Migrated to `102` / `101`.
- Don't refactor `Selection.tsx` and `Atelier.tsx` together — Atelier is a parallel WIP.
- Don't commit `groceries_source/*.png` if they balloon — currently ignored? Check `.gitignore` before bulk additions.
- Don't bypass `promo-codes.ts` — every promo behavior (label, color, effective discount) flows from that file.
