
import { toast } from 'sonner';
import { type Recipe, type SelectionState } from '@/lib/types';
import { SYSTEM_PROMPT } from './prompts';
import { validateSelectionState, generateUserMessage } from './validation';
import { mockRecipes } from './mockRecipes';
import { callOpenAI } from './client';

export async function generateRecipes(selectionState: SelectionState): Promise<Recipe[]> {
  try {
    validateSelectionState(selectionState);
    
    const { protein, cuisine, selectedPantryIngredients, additionalIngredients, servingInfo } = selectionState;
    const proteinName = protein.name;
    const cuisineName = cuisine.name;
    
    console.log('Processing additionalIngredients:', additionalIngredients);
    
    const userMessage = generateUserMessage(
      proteinName,
      cuisineName,
      selectedPantryIngredients,
      servingInfo.adults,
      servingInfo.kids,
      additionalIngredients
    );

    console.log('Generating recipes with prompt:', userMessage);
    
    try {
      const result = await callOpenAI(userMessage, SYSTEM_PROMPT);
      
      console.log('OpenAI API result:', result);
      
      // Check if result is already a parsed object with recipes
      if (result && typeof result === 'object' && result.recipes && Array.isArray(result.recipes)) {
        return result.recipes;
      } 
      // Check if it's a string (fallback in case parsing in client failed)
      else if (typeof result === 'string') {
        try {
          const parsedResult = JSON.parse(result);
          if (parsedResult.recipes && Array.isArray(parsedResult.recipes)) {
            return parsedResult.recipes;
          }
        } catch (e) {
          console.error('Error parsing string result as JSON:', e);
        }
      }
      
      // If we reached here, we couldn't get valid recipes data
      console.warn('Invalid recipe format in response, falling back to mock recipes');
      toast.error('Invalid recipe format in API response');
      return mockRecipes(proteinName, cuisineName, 'nl', servingInfo.adults, servingInfo.kids, additionalIngredients);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast.error('Failed to generate recipes. Using mock recipes instead.');
      return mockRecipes(proteinName, cuisineName, 'nl', servingInfo.adults, servingInfo.kids, additionalIngredients);
    }
  } catch (error) {
    console.error('Error generating recipes:', error);
    toast.error('An error occurred while generating recipes');
    throw error;
  }
}

export { mockRecipes };
