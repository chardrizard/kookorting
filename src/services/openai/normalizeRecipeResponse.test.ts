import { describe, expect, it } from 'vitest';
import { RecipesResponseSchema } from '@/lib/types';
import { normalizeRecipeResponse } from './normalizeRecipeResponse';

const makeRecipe = (overrides = {}) => ({
  id: 'recipe-1',
  title: 'Kip met citroen',
  description: 'Een frisse kipbereiding met veel kruiden.',
  userIngredients: ['500 g kip', '1 citroen'],
  extraIngredients: ['2 el yoghurt'],
  instructions: ['Marineer de kip', 'Bak tot gaar'],
  prepTime: 10,
  cookTime: 20,
  totalTime: 30,
  servings: 2,
  similarRecipes: [{ title: 'Lemon Chicken', url: 'https://www.google.com/search?q=Lemon+Chicken+recipe' }],
  extraInfo: null,
  ...overrides,
});

const makeResponse = (firstRecipeOverrides = {}) => ({
  recipes: [
    makeRecipe({ id: 'recipe-1', ...firstRecipeOverrides }),
    makeRecipe({ id: 'recipe-2' }),
    makeRecipe({ id: 'recipe-3' }),
  ],
});

describe('normalizeRecipeResponse', () => {
  it('keeps a valid response compatible with the recipe schema', () => {
    const normalized = normalizeRecipeResponse(makeResponse());

    expect(RecipesResponseSchema.safeParse(normalized).success).toBe(true);
  });

  it('coerces numeric strings before schema validation', () => {
    const normalized = normalizeRecipeResponse(makeResponse({
      prepTime: '15 min',
      cookTime: '25',
      totalTime: '40',
      servings: '4',
    }));

    const parsed = RecipesResponseSchema.parse(normalized);

    expect(parsed.recipes[0].prepTime).toBe(15);
    expect(parsed.recipes[0].cookTime).toBe(25);
    expect(parsed.recipes[0].totalTime).toBe(40);
    expect(parsed.recipes[0].servings).toBe(4);
  });

  it('splits string instructions and ingredients into arrays', () => {
    const normalized = normalizeRecipeResponse(makeResponse({
      userIngredients: '500 g kip\n1 tl komijn',
      extraIngredients: 'paprika; ui',
      instructions: '1. Snijd de ui\n2. Bak de kip',
    }));

    const parsed = RecipesResponseSchema.parse(normalized);

    expect(parsed.recipes[0].userIngredients).toEqual(['500 g kip', '1 tl komijn']);
    expect(parsed.recipes[0].extraIngredients).toEqual(['paprika', 'ui']);
    expect(parsed.recipes[0].instructions).toEqual(['Snijd de ui', 'Bak de kip']);
  });

  it('fills missing similar recipe URLs with Google search URLs', () => {
    const normalized = normalizeRecipeResponse(makeResponse({
      similarRecipes: [{ title: 'Indonesian Chicken' }, 'Thai Basil Chicken'],
    }));

    const parsed = RecipesResponseSchema.parse(normalized);

    expect(parsed.recipes[0].similarRecipes).toEqual([
      {
        title: 'Indonesian Chicken',
        url: 'https://www.google.com/search?q=Indonesian%20Chicken%20recipe',
      },
      {
        title: 'Thai Basil Chicken',
        url: 'https://www.google.com/search?q=Thai%20Basil%20Chicken%20recipe',
      },
    ]);
  });

  it('normalizes missing extraInfo to null', () => {
    const recipe = makeRecipe({ id: 'recipe-1' });
    delete recipe.extraInfo;

    const normalized = normalizeRecipeResponse({
      recipes: [recipe, makeRecipe({ id: 'recipe-2' }), makeRecipe({ id: 'recipe-3' })],
    });

    const parsed = RecipesResponseSchema.parse(normalized);

    expect(parsed.recipes[0].extraInfo).toBeNull();
  });

  it('still rejects responses that cannot produce three usable recipes', () => {
    const normalized = normalizeRecipeResponse({
      recipes: [makeRecipe({ id: 'recipe-1' })],
    });

    expect(RecipesResponseSchema.safeParse(normalized).success).toBe(false);
  });
});
