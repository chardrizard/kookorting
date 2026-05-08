
import { createContext, useContext, ReactNode } from 'react';

// Simplified translations with only Dutch content
const translations = {
  // Page titles and headers
  'app.title': 'Kookorting',
  'home.getStarted': 'Eet beter voor minder',
  'home.subtitle': 'Ontdek eiwitaanbiedingen en kook voordelig!',
  
  // Selection page
  'selection.protein.title': 'Kies geselecteerde eiwitten in de aanbieding',
  'selection.protein.subtitle': 'Kies een eiwit als basis voor je maaltijd',
  'selection.cuisine.title': 'Selecteer keuken',
  'selection.cuisine.subtitle': 'Kies een keuken voor het smaakprofiel',
  'selection.serving.title': 'Portiegrootte',
  'selection.serving.subtitle': 'Hoeveel mensen gaan er eten?',
  'selection.serving.adults': 'Volwassenen',
  'selection.serving.kids': 'Kinderen',
  'selection.pantry.title': 'Standaard voorraad ingrediënten',
  'selection.pantry.subtitle': 'Vink aan welke ingrediënten je beschikbaar hebt',
  'selection.ingredients.title': 'Extra Ingrediënten',
  'selection.ingredients.subtitle': 'Voeg tot 5 ingrediënten toe die je wilt gebruiken (optioneel)',
  'selection.ingredients.placeholder': 'Voer een ingrediënt in',
  'selection.ingredients.maxReached': 'Maximum aantal ingrediënten bereikt',
  'selection.ingredients.count': 'ingrediënten',
  'selection.filter.store': 'Filteren op supermarkt',
  'selection.showMore': 'Meer tonen',
  'selection.showLess': 'Minder tonen',
  'selection.showMoreProteins': 'Meer eiwitten tonen',
  'selection.showMoreStores': 'Meer supermarkten',
  
  // Common UI elements
  'ui.discount': 'korting',
  'ui.was': 'Was',
  'ui.save': 'Bespaar',
  'ui.nutritionInfo': 'Voedingsinfo',
  'ui.nutritionPer100g': 'Voedingswaarden per 100gr',
  'ui.macronutrients': 'Voedingswaarden per 100gr',
  'ui.generateRecipes': 'Ontdek recepten',
  'ui.generatingRecipes': 'Recepten genereren...',
  'ui.creatingRecipes': 'Je recepten maken...',
  'ui.protein': 'Eiwitten',
  'ui.fiber': 'Vezels',
  'ui.fat': 'Vet',
  'ui.kcal': 'Kcal',
  
  // Results page
  'results.title': 'Jouw Recept Opties',
  'results.createdWith': 'We hebben deze recepten gemaakt met',
  'results.from': 'van',
  'results.and': 'en',
  'results.cuisineStyle': 'keuken stijl',
  'results.createAnother': 'Maak nog een Recept',
  
  // Recipe Card
  'recipe.ingredients': 'Ingrediënten',
  'recipe.instructions': 'Instructies',
  'recipe.similarRecipes': 'Vergelijkbare Recepten',
  'recipe.prep': 'Voorbereiding',
  'recipe.cook': 'Kooktijd',
  'recipe.total': 'Totaal',
  'recipe.serves': 'Porties',
  'recipe.min': 'min',
  'recipe.adults': 'Volwassenen',
  'recipe.kids': 'Kinderen',
  'recipe.userIngredients': 'Recept Ingrediënten',
  'recipe.mainIngredients': 'Hoofdingrediënten',
  'recipe.extraIngredients': 'Extra Ingrediënten',
  'recipe.additionalItems': 'Extra Ingrediënten',
  
  // Error messages
  'error.selectProtein': 'Selecteer een eiwit',
  'error.selectCuisine': 'Selecteer een keuken',
  'error.generateFailed': 'Kon geen recepten genereren. Probeer het opnieuw.',
  
  // Proteins
  'protein.Kipfilet': 'Kipfilet',
  'protein.Rundergehakt': 'Rundergehakt',
  'protein.Zalmfilet': 'Zalmfilet',
  'protein.Varkenskarbonade': 'Varkenskarbonade',
  'protein.Tofu': 'Tofu',
  'protein.Kalkoenfilet': 'Kalkoenfilet',
  'protein.Garnalen': 'Garnalen',
  'protein.Lamsbout': 'Lamsbout',
  'protein.Runderbiefstuk': 'Runderbiefstuk',
  'protein.Pangasiusfilet': 'Pangasiusfilet',
  'protein.Tempeh': 'Tempeh',
  'protein.Runderstoofvlees': 'Runderstoofvlees',
  
  // Cuisines
  'cuisine.Italiaans': 'Italiaans',
  'cuisine.Mexicaans': 'Mexicaans',
  'cuisine.Aziatisch': 'Aziatisch',
  'cuisine.Mediterraans': 'Mediterraans',
  'cuisine.Indiaas': 'Indiaas',
  'cuisine.Amerikaans': 'Amerikaans',
};

// Create a simplified context without language switching
interface TranslationContextType {
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Provider component
interface TranslationProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: TranslationProviderProps) => {
  // Simplified translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key];
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use the translations
export const useLanguage = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
