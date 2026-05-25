import { isPromoCode } from './promo-codes';

// Calculate the original price based on current price and discount percentage.
// Promo codes (OP=OP, 1+1, etc.) don't represent a real % off — the displayed
// price is the regular per-unit price, so return it unchanged.
export const calculateOriginalPrice = (currentPrice: number, discount: number): number => {
  if (isPromoCode(discount)) return currentPrice;
  return currentPrice / (1 - discount / 100);
};
