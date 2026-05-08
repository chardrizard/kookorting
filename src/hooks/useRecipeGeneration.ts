
import { useState } from 'react';
import { toast } from 'sonner';
import { generateRecipesWithValidation } from '@/services/recipeGenerator';
import { trackGenerateRecipe } from '@/services/analytics';
import { type SelectionState } from '@/lib/types';
import useRecipeStore from './useRecipeStore';

const MAX_GENERATION_ATTEMPTS = 5;
const GENERATION_COOLDOWN_MS = 30000; // 30 seconds

export const useRecipeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const [lastGenerationTime, setLastGenerationTime] = useState(0);
  const { setRecipes } = useRecipeStore();

  const generateRecipes = async (selectionState: SelectionState) => {
    try {
      const now = Date.now();
      if (generationAttempts >= MAX_GENERATION_ATTEMPTS && 
          now - lastGenerationTime < GENERATION_COOLDOWN_MS) {
        toast.error('Te veel generatie-pogingen. Probeer het over enkele minuten opnieuw.');
        return false;
      }

      setIsLoading(true);
      setGenerationAttempts(prev => prev + 1);
      setLastGenerationTime(now);

      const { protein, cuisine, selectedPantryIngredients, additionalIngredients, servingInfo } = selectionState;

      if (protein && cuisine) {
        trackGenerateRecipe({
          protein: protein.name,
          cuisine: cuisine.name,
          adults: servingInfo.adults,
          children: servingInfo.kids,
          ingredients: additionalIngredients
        });
      }

      const recipes = await generateRecipesWithValidation(selectionState);

      if (recipes) {
        setRecipes(recipes);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateRecipes
  };
};
