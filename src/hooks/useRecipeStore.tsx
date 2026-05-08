import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Recipe, type Cuisine, type Protein, type RecipeStore } from '@/lib/types';

const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      protein: null,
      cuisine: null,
      selectedPantryIngredients: [],
      additionalIngredients: [],
      recipes: [],
      favoriteRecipes: [],
      selectedProteins: [], // Keep for backward compatibility
      servingInfo: {
        adults: 1,
        kids: 0
      },

      setProtein: (protein) => set(() => ({ 
        protein, 
        // Clear selectedProteins except the newly selected one
        selectedProteins: protein ? [protein] : []
      })),

      toggleProteinSelection: (protein) => set(() => {
        // For backward compatibility, maintain this function but make it single-select
        const newSelectedProteins = [protein];
        return {
          selectedProteins: newSelectedProteins,
          protein // Also update the main protein
        };
      }),

      setCuisine: (cuisine) => set(() => ({
        cuisine,
        // We'll keep the array but not use it anymore in the UI
        selectedPantryIngredients: []
      })),

      setSelectedPantryIngredients: (ingredients) => set(() => ({
        selectedPantryIngredients: ingredients
      })),

      addAdditionalIngredient: (ingredient) => set((state) => {
        if (state.additionalIngredients.length >= 5) {
          return state;
        }
        
        const normalizedIngredient = ingredient.trim().toLowerCase();
        
        if (normalizedIngredient === '' || 
            state.additionalIngredients.some(i => i.toLowerCase() === normalizedIngredient)) {
          return state;
        }
        
        return {
          additionalIngredients: [...state.additionalIngredients, ingredient.trim()]
        };
      }),

      removeAdditionalIngredient: (ingredient) => set((state) => ({
        additionalIngredients: state.additionalIngredients.filter(i => i !== ingredient)
      })),

      clearAdditionalIngredients: () => set(() => ({
        additionalIngredients: []
      })),

      setRecipes: (recipes) => set(() => ({ recipes })),

      toggleFavoriteRecipe: (recipeId) => set((state) => {
        if (state.favoriteRecipes.includes(recipeId)) {
          return {
            favoriteRecipes: state.favoriteRecipes.filter(id => id !== recipeId)
          };
        } else {
          return {
            favoriteRecipes: [...state.favoriteRecipes, recipeId]
          };
        }
      }),

      updateServingInfo: (adults, kids) => set(() => ({
        servingInfo: { adults, kids }
      })),

      resetStore: () => set(() => ({
        protein: null,
        cuisine: null,
        selectedPantryIngredients: [],
        additionalIngredients: [],
        recipes: [],
        selectedProteins: [],
        servingInfo: {
          adults: 1,
          kids: 0
        }
      }))
    }),
    {
      name: 'recipe-store',
      partialize: (state) => ({
        favoriteRecipes: state.favoriteRecipes,
        servingInfo: state.servingInfo
      })
    }
  )
);

export default useRecipeStore;
