
import { type SelectionState } from '@/lib/types';

export function sanitizeInput(input: string, maxLength = 100): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .slice(0, maxLength);
}

export function validateUserInput(input: string): string {  
  return sanitizeInput(input, 1000);
}

export function sanitizeIngredients(ingredients: string[]): string[] {
  return ingredients
    .filter(ingredient => ingredient && typeof ingredient === 'string')
    .map(ingredient => sanitizeInput(ingredient));
}

export function validateServingInfo(adults: number, kids: number) {
  return {
    adults: Math.min(Math.max(1, adults), 10),
    kids: Math.min(Math.max(0, kids), 10)
  };
}

export function generateUserMessage(
  protein: string,
  cuisine: string,
  pantryIngredients: string[],
  adults: number,
  kids: number,
  extraIngredients: string[]
): string {
  const sanitizedProtein = validateUserInput(protein);
  const sanitizedCuisine = validateUserInput(cuisine);
  const sanitizedPantryIngredients = sanitizeIngredients(pantryIngredients);
  const sanitizedExtraIngredients = sanitizeIngredients(extraIngredients);
  const validServings = validateServingInfo(adults, kids);
  
  return `I want to cook something with the following:
1. Protein: ${sanitizedProtein}
2. Cuisine: ${sanitizedCuisine} with these pantry ingredients: ${sanitizedPantryIngredients.join(', ')}
3. Portions: ${validServings.adults} adults and ${validServings.kids} children
4. Additional ingredients I want to use: ${sanitizedExtraIngredients.length > 0 ? sanitizedExtraIngredients.join(', ') : 'None'}`;
}

export function validateSelectionState(selectionState: SelectionState): void {
  if (!selectionState.protein || !selectionState.cuisine) {
    throw new Error('Protein and cuisine selection are required');
  }
}

