type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
}

function toNullableString(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return null;
  return String(value);
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\n|;/)
      .map((item) => item.replace(/^\d+[.)]\s*/, '').trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSimilarRecipes(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (isRecord(item)) {
        const title = toStringValue(item.title).trim();
        const url = toStringValue(item.url).trim();

        if (!title) return null;

        return {
          title,
          url: url || `https://www.google.com/search?q=${encodeURIComponent(`${title} recipe`)}`,
        };
      }

      const title = toStringValue(item).trim();
      if (!title) return null;

      return {
        title,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${title} recipe`)}`,
      };
    })
    .filter(Boolean);
}

function normalizeRecipe(recipe: unknown, index: number) {
  if (!isRecord(recipe)) return null;

  const prepTime = toNumberValue(recipe.prepTime);
  const cookTime = toNumberValue(recipe.cookTime);
  const totalTime = toNumberValue(recipe.totalTime, prepTime + cookTime);

  return {
    id: toStringValue(recipe.id, `recipe-${index + 1}`),
    title: toStringValue(recipe.title),
    description: toStringValue(recipe.description),
    userIngredients: toStringArray(recipe.userIngredients),
    extraIngredients: toStringArray(recipe.extraIngredients),
    instructions: toStringArray(recipe.instructions),
    prepTime,
    cookTime,
    totalTime,
    servings: toNumberValue(recipe.servings, 1),
    similarRecipes: normalizeSimilarRecipes(recipe.similarRecipes),
    extraInfo: toNullableString(recipe.extraInfo),
  };
}

export function normalizeRecipeResponse(response: unknown): unknown {
  if (!isRecord(response) || !Array.isArray(response.recipes)) {
    return response;
  }

  return {
    ...response,
    recipes: response.recipes
      .slice(0, 3)
      .map((recipe, index) => normalizeRecipe(recipe, index))
      .filter(Boolean),
  };
}
