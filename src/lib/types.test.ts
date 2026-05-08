import { describe, it, expect } from 'vitest';
import { RecipesResponseSchema } from './types';

const validRecipe = {
  id: 'recipe-1',
  title: 'Kipfilet met kruiden',
  description: 'Een smaakvol recept',
  userIngredients: ['500g kipfilet', '2 el olijfolie'],
  extraIngredients: ['verse basilicum'],
  instructions: ['Verwarm de pan', 'Bak de kip'],
  prepTime: 10,
  cookTime: 20,
  totalTime: 30,
  servings: 2,
  similarRecipes: [{ title: 'Herb Chicken', url: 'https://google.com/search?q=Herb+Chicken' }],
  extraInfo: null,
};

const makeResponse = (overrides = {}) => ({
  recipes: [
    { ...validRecipe, id: 'recipe-1', ...overrides },
    { ...validRecipe, id: 'recipe-2' },
    { ...validRecipe, id: 'recipe-3' },
  ],
});

describe('RecipesResponseSchema', () => {
  it('accepts a valid response with 3 recipes', () => {
    expect(RecipesResponseSchema.safeParse(makeResponse()).success).toBe(true);
  });

  it('rejects when fewer than 3 recipes', () => {
    const result = RecipesResponseSchema.safeParse({ recipes: [validRecipe] });
    expect(result.success).toBe(false);
  });

  it('rejects when recipes field is missing', () => {
    expect(RecipesResponseSchema.safeParse({}).success).toBe(false);
  });

  it('rejects when title is missing', () => {
    const result = RecipesResponseSchema.safeParse(makeResponse({ title: undefined }));
    expect(result.success).toBe(false);
  });

  it('rejects when instructions is not an array', () => {
    const result = RecipesResponseSchema.safeParse(makeResponse({ instructions: 'stap 1' }));
    expect(result.success).toBe(false);
  });

  it('rejects when prepTime is not a number', () => {
    const result = RecipesResponseSchema.safeParse(makeResponse({ prepTime: '10' }));
    expect(result.success).toBe(false);
  });

  it('accepts null extraInfo', () => {
    const result = RecipesResponseSchema.safeParse(makeResponse({ extraInfo: null }));
    expect(result.success).toBe(true);
  });

  it('accepts string extraInfo', () => {
    const result = RecipesResponseSchema.safeParse(makeResponse({ extraInfo: 'Lekker recept' }));
    expect(result.success).toBe(true);
  });
});
