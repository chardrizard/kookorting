
import { Protein } from './types';

export interface ProteinWithDetails extends Protein {
  brand: string;
  store: string;
  packageSize: string;
  unit: string;
  discount: number;
  priceBefore?: number;
  rating?: number;
  recommendedScore?: number;
  vegan?: boolean;
  pricePerWeight?: number;
  macronutrients: {
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
}

export interface Supermarket {
  id: string;
  name: string;
  logo?: string;
}

export const SUPERMARKETS: Supermarket[] = [
  { id: 'ah', name: 'Albert Heijn' },
  { id: 'jumbo', name: 'Jumbo' },
  { id: 'lidl', name: 'Lidl' },
  { id: 'aldi', name: 'Aldi' },
  { id: 'amazingoriental', name: 'Amazing Oriental' },
  { id: 'dirk', name: 'Dirk' },
  { id: 'coop', name: 'Coop' },
  { id: 'plus', name: 'Plus' }
];
