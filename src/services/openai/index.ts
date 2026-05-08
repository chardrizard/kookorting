
import { toast } from 'sonner';
import { type Recipe, type SelectionState, RecipesResponseSchema } from '@/lib/types';
import { SYSTEM_PROMPT } from './prompts';
import { validateSelectionState, generateUserMessage } from './validation';
import { mockRecipes } from './mockRecipes';
import { callRecipeModel } from './client';
import { normalizeRecipeResponse } from './normalizeRecipeResponse';

export async function generateRecipes(selectionState: SelectionState): Promise<Recipe[]> {
  try {
    validateSelectionState(selectionState);

    const { protein, cuisine, selectedPantryIngredients, additionalIngredients, servingInfo } = selectionState;
    const proteinName = protein.name;
    const cuisineName = cuisine.name;

    const userMessage = generateUserMessage(
      proteinName,
      cuisineName,
      selectedPantryIngredients,
      servingInfo.adults,
      servingInfo.kids,
      additionalIngredients
    );

    try {
      const result = await callRecipeModel(userMessage, SYSTEM_PROMPT);

      const parsed = typeof result === 'string' ? JSON.parse(result) : result;
      const normalized = normalizeRecipeResponse(parsed);
      const validated = RecipesResponseSchema.safeParse(normalized);

      if (validated.success) {
        return validated.data.recipes as Recipe[];
      }

      if (import.meta.env.DEV) {
        console.error('Invalid recipe format in API response', validated.error.flatten());
      }

      toast.error('Invalid recipe format in API response');
      return mockRecipes(proteinName, cuisineName, 'nl', servingInfo.adults, servingInfo.kids, additionalIngredients);
    } catch (error) {
      toast.error('Failed to generate recipes. Using mock recipes instead.');
      return mockRecipes(proteinName, cuisineName, 'nl', servingInfo.adults, servingInfo.kids, additionalIngredients);
    }
  } catch (error) {
    toast.error('An error occurred while generating recipes');
    throw error;
  }
}

export { mockRecipes };
