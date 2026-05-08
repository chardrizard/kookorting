
// Calculate the original price based on current price and discount percentage
export const calculateOriginalPrice = (currentPrice: number, discount: number): number => {
  return currentPrice / (1 - discount / 100);
};
