import { getEffectiveDiscount, isPromoCode } from './promo-codes';

export interface RecommendedScoreInput {
  priceAfter: number;
  weight: number;
  weightUnit: string;
  discount: number;
  proteinPer100g: number;
  caloriesPer100g: number;
}

export interface RecommendedScore {
  points: number;
  rating: number;
}

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));

const toGrams = (weight: number, unit: string): number => {
  if (weight <= 0) return 0;
  if (unit === 'kg') return weight * 1000;
  if (unit === 'g') return weight;
  return 0;
};

export function calculateRecommendedScore({
  priceAfter,
  weight,
  weightUnit,
  discount,
  proteinPer100g,
  caloriesPer100g,
}: RecommendedScoreInput): RecommendedScore {
  const effectiveDiscount = getEffectiveDiscount(discount);
  const effectivePrice = isPromoCode(discount)
    ? priceAfter * (1 - effectiveDiscount / 100)
    : priceAfter;
  const weightInGrams = toGrams(weight, weightUnit);
  const totalProtein = (weightInGrams * proteinPer100g) / 100;
  const proteinPerEuro = effectivePrice > 0 ? totalProtein / effectivePrice : 0;
  const proteinPer100Kcal = caloriesPer100g > 0 ? proteinPer100g / (caloriesPer100g / 100) : 0;

  const proteinValueScore = clampScore((proteinPerEuro / 35) * 100);
  const discountScore = clampScore((effectiveDiscount / 50) * 100);
  const proteinDensityScore = clampScore((proteinPer100g / 25) * 100);
  const calorieEfficiencyScore = clampScore((proteinPer100Kcal / 15) * 100);

  const points = (
    0.4 * proteinValueScore
    + 0.25 * discountScore
    + 0.2 * proteinDensityScore
    + 0.15 * calorieEfficiencyScore
  );

  return {
    points: Math.round(points * 10) / 10,
    rating: Math.round((points / 20) * 10) / 10,
  };
}
