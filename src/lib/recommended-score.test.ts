import { describe, expect, it } from 'vitest';

import { calculateRecommendedScore } from './recommended-score';

describe('calculateRecommendedScore', () => {
  it('rewards protein value over discount-only deals', () => {
    const strongProteinValue = calculateRecommendedScore({
      priceAfter: 3.99,
      weight: 500,
      weightUnit: 'g',
      discount: 25,
      proteinPer100g: 23,
      caloriesPer100g: 120,
    });

    const weakProteinValue = calculateRecommendedScore({
      priceAfter: 5.99,
      weight: 200,
      weightUnit: 'g',
      discount: 50,
      proteinPer100g: 12,
      caloriesPer100g: 260,
    });

    expect(strongProteinValue.points).toBeGreaterThan(weakProteinValue.points);
  });

  it('uses promo codes as effective unit-price discounts', () => {
    const straightDiscount = calculateRecommendedScore({
      priceAfter: 4,
      weight: 400,
      weightUnit: 'g',
      discount: 50,
      proteinPer100g: 20,
      caloriesPer100g: 150,
    });

    const onePlusOne = calculateRecommendedScore({
      priceAfter: 4,
      weight: 400,
      weightUnit: 'g',
      discount: 102,
      proteinPer100g: 20,
      caloriesPer100g: 150,
    });

    expect(onePlusOne.points).toBeGreaterThan(straightDiscount.points);
  });
});
