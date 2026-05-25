# Transcription history

Running log of weekly screenshot → CSV → Supabase batches.

**Cadence:** Sat/Sun, when supermarkets refresh weekly promos.

**Status legend:** 🟡 transcribed (CSV ready) · ✅ imported to Supabase · ⏸️ paused

| Week | Promo dates | CSV | Supermarkets | Rows | Status | Imported on | Notes |
|---|---|---|---|---|---|---|---|
| W4MEI26 | 2026-05-18 → 2026-05-31 | [W4MEI26.csv](W4MEI26.csv) | AH (90), Aldi (9), Dirk (14), Jumbo (16), Lidl (7) | 137 | ✅ | 2026-05-25 | First multi-supermarket batch. Introduced promo codes 101–104. Migrated existing 76→102, 77→101 in DB. |

---

## Next session checklist

When starting a new Saturday/Sunday session:

1. Check this file — what's the most recent week? What was missing?
2. Look at `groceries_source/` — fresh screenshots should be there. If empty, ask Richard which supermarkets are in scope.
3. Note the new week code (e.g. `W1JUN26` for week 1 of June 2026).
4. Follow the workflow in [../AGENTS.md](../AGENTS.md) §Weekly transcription workflow.

## End-of-session checklist

After a batch is imported successfully:

1. Add a new row to the table above with row count, supermarkets, status ✅.
2. Move screenshots: `mv groceries_source/*.png groceries_source/archive/<week>/`.
3. Verify production: refresh the live site, scan a few cards to ensure the new entries render with correct prices/discounts.
