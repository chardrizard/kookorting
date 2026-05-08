
import { toast } from 'sonner';
import { generateRecipes } from '@/services/openai';
import { Protein, Cuisine, ServingInfo } from '@/lib/types';
import { sanitizeIngredients, validateServingInfo, validateSelectionState } from '@/services/openai/validation';

interface RecipeGenerationParams {
  protein: Protein | null;
  cuisine: Cuisine | null;
  selectedPantryIngredients: string[];
  additionalIngredients: string[];
  servingInfo: ServingInfo;
}

// Limit API calls with a debounce mechanism
let lastRequestTime = 0;
const RATE_LIMIT_MS = 3000; // 3 seconds between requests

export const generateRecipesWithValidation = async ({
  protein,
  cuisine,
  selectedPantryIngredients,
  additionalIngredients,
  servingInfo
}: RecipeGenerationParams) => {
  // Input validation
  if (!protein) {
    toast.error('Selecteer een eiwit om door te gaan');
    return null;
  }
  
  if (!cuisine) {
    toast.error('Selecteer een keuken om door te gaan');
    return null;
  }

  // Sanitize inputs and validate serving info
  const sanitizedPantryIngredients = sanitizeIngredients(selectedPantryIngredients);
  const sanitizedAdditionalIngredients = sanitizeIngredients(additionalIngredients);
  const validatedServingInfo = validateServingInfo(servingInfo.adults, servingInfo.kids);
  
  // Rate limiting
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_MS) {
    toast.error('Te veel verzoeken, probeer het over enkele seconden opnieuw');
    return null;
  }
  lastRequestTime = now;
  
  try {
    const recipes = await generateRecipes({
      protein,
      cuisine,
      selectedPantryIngredients: sanitizedPantryIngredients,
      additionalIngredients: sanitizedAdditionalIngredients,
      servingInfo: validatedServingInfo
    });
    return recipes;
  } catch (error) {
    toast.error('Kon geen recepten genereren. Probeer het opnieuw.');
    return null;
  }
};

