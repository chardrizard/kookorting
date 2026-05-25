// Sentinel values stored in `discount_percentage` to signal special promotions
// where the per-unit price doesn't actually drop. Values are >100 so they can
// never collide with a real discount percentage.
export const PROMO_CODES = {
  OP_OP: 101,
  ONE_PLUS_ONE: 102,
  TWO_PLUS_ONE: 103,
  SECOND_HALF: 104,
} as const;

export const PROMO_LABELS: Record<number, string> = {
  [PROMO_CODES.OP_OP]: 'OP=OP',
  [PROMO_CODES.ONE_PLUS_ONE]: '1+1',
  [PROMO_CODES.TWO_PLUS_ONE]: '2+1',
  [PROMO_CODES.SECOND_HALF]: '2e ½',
};

// Effective per-unit discount % for each promo code. Used when scoring deals
// (e.g. the `points` formula) so that buy-X-get-Y promos are compared fairly
// against straight % discounts.
//   1+1 gratis      → 50% per unit (2 for the price of 1)
//   2+1 gratis      → 33% per unit (3 for the price of 2)
//   2e halve prijs  → 25% per unit (second item half off)
//   OP=OP           → 50% (clearance, prices typically already reduced)
export const PROMO_EFFECTIVE_DISCOUNT: Record<number, number> = {
  [PROMO_CODES.OP_OP]: 50,
  [PROMO_CODES.ONE_PLUS_ONE]: 50,
  [PROMO_CODES.TWO_PLUS_ONE]: 33,
  [PROMO_CODES.SECOND_HALF]: 25,
};

export const isPromoCode = (discount: number): boolean => discount > 100;

export const getPromoLabel = (discount: number): string | null =>
  PROMO_LABELS[discount] ?? null;

export const getEffectiveDiscount = (discount: number): number =>
  PROMO_EFFECTIVE_DISCOUNT[discount] ?? discount;
