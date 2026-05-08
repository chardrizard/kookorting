
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
