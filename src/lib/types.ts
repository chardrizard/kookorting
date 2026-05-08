
import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  userIngredients: z.array(z.string()),
  extraIngredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
  totalTime: z.number(),
  servings: z.number(),
  similarRecipes: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })),
  extraInfo: z.string().nullable().optional(),
});

export const RecipesResponseSchema = z.object({
  recipes: z.array(RecipeSchema).length(3),
});

export type RecipeValidated = z.infer<typeof RecipeSchema>;

export interface Protein {
  id: string;
  name: string;
  price: number;
  discount: number;
  store: string;
  unit: string;
}

export interface Cuisine {
  id: string;
  name: string;
  pantryIngredients: string[];
  emoji: string; // Updated: emoji is now required, not optional
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  userIngredients: string[];
  extraIngredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  similarRecipes: {
    title: string;
    url: string;
  }[];
  extraInfo: string | null;
}

export interface ServingInfo {
  adults: number;
  kids: number;
}

export interface SelectionState {
  protein: Protein | null;
  cuisine: Cuisine | null;
  selectedPantryIngredients: string[];
  additionalIngredients: string[];
  servingInfo: ServingInfo;
}

export interface RecipeStore extends SelectionState {
  recipes: Recipe[];
  favoriteRecipes: string[];
  selectedProteins: Protein[]; // Keep for backward compatibility
  setProtein: (protein: Protein | null) => void;
  toggleProteinSelection: (protein: Protein) => void; // Keep for backward compatibility
  setCuisine: (cuisine: Cuisine | null) => void;
  setSelectedPantryIngredients: (ingredients: string[]) => void;
  addAdditionalIngredient: (ingredient: string) => void;
  removeAdditionalIngredient: (ingredient: string) => void;
  clearAdditionalIngredients: () => void;
  setRecipes: (recipes: Recipe[]) => void;
  toggleFavoriteRecipe: (recipeId: string) => void;
  updateServingInfo: (adults: number, kids: number) => void;
  resetStore: () => void;
}
