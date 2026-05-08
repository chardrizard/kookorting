import { useState } from 'react';
import { ExternalLink, Heart, Clock, Users, Check, Share2, ChevronDown, ChevronUp, Hourglass } from 'lucide-react';
import { Recipe } from '@/lib/types';
import useRecipeStore from '@/hooks/useRecipeStore';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RecipeCardProps {
  recipe: Recipe;
  isFirst?: boolean;
}

const RecipeCard = ({
  recipe,
  isFirst = false
}: RecipeCardProps) => {
  const {
    favoriteRecipes,
    toggleFavoriteRecipe
  } = useRecipeStore();
  const isFavorite = favoriteRecipes.includes(recipe.id);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  
  const [isOpen, setIsOpen] = useState(isFirst);
  
  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ingredient]: !prev[ingredient]
    }));
  };
  
  const createGoogleSearchUrl = (recipeName: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(recipeName + " recept")}`;
  };
  
  const handleShare = async () => {
    const recipeText = `
${recipe.title}

${recipe.description}

Voorbereiding: ${recipe.prepTime} min
Kooktijd: ${recipe.cookTime} min

Ingrediënten:
${[...recipe.userIngredients, ...recipe.extraIngredients].join('\n')}

Instructies:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipeText,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(recipeText);
        alert('Recept is gekopieerd naar klembord');
      } catch (error) {
        console.error('Failed to copy recipe', error);
      }
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden animate-slide-in-up transition-all duration-300 hover:shadow-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4 sm:p-8 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-left">{recipe.title}</h3>
          </div>
          
          <CollapsibleTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="px-4 sm:px-8 py-4 sm:py-5 text-left text-apple-gray-600">
            {recipe.description}
          </div>
          
          <div className="flex flex-wrap gap-4 sm:gap-8 text-sm sm:text-base text-apple-gray-700 px-4 sm:px-8 pb-4 sm:pb-6 pt-1 sm:pt-2">
            <div className="flex items-center">
              <Hourglass className="h-4 w-4 mr-1.5 text-apple-gray-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{recipe.prepTime} min</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-apple-gray-500 flex-shrink-0" />
              <span className="whitespace-nowrap">Kooktijd: {recipe.cookTime} min</span>
            </div>
            <button onClick={handleShare} className="flex items-center text-apple-gray-400 hover:text-apple-gray-600 transition-colors" aria-label="Deel recept">
              <Share2 className="h-4 w-4 mr-1.5" />
              <span className="whitespace-nowrap">Delen</span>
            </button>
          </div>
          
          <div className="border-b border-gray-200 px-4 sm:px-6">
            <div className="flex space-x-4 -mb-px">
              <button className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'ingredients' ? 'border-nature-primary text-nature-primary' : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'}`} onClick={() => setActiveTab('ingredients')}>
                Ingrediënten
              </button>
              <button className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'instructions' ? 'border-nature-primary text-nature-primary' : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'}`} onClick={() => setActiveTab('instructions')}>
                Instructies
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {activeTab === 'ingredients' && (
              <div className="space-y-6">
                <div>
                  <ul className="space-y-2 mt-2">
                    {[...recipe.userIngredients, ...recipe.extraIngredients].map((ingredient, index) => (
                      <li key={`ingredient-${index}`} className="flex items-start gap-2">
                        <div 
                          className={`flex-shrink-0 mt-0.5 h-5 w-5 border rounded cursor-pointer flex items-center justify-center transition-colors ${
                            checkedIngredients[ingredient] ? 'bg-nature-primary border-nature-primary text-white' : 'border-gray-300 bg-white'
                          }`} 
                          onClick={() => toggleIngredient(ingredient)}
                        >
                          {checkedIngredients[ingredient] && <Check size={14} />}
                        </div>
                        <span className={`text-left ${checkedIngredients[ingredient] ? 'line-through text-gray-400' : 'text-apple-gray-700'}`}>
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {recipe.extraInfo && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800 text-left">{recipe.extraInfo}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'instructions' && (
              <ol className="list-decimal pl-5 space-y-2 text-apple-gray-700 text-left">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="text-left">{step}</li>
                ))}
              </ol>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100">
            <h4 className="font-medium mb-3 text-sm text-left text-gray-500">Vergelijkbare Recepten uit Google</h4>
            <ul className="space-y-1">
              {recipe.similarRecipes.map((similar, index) => (
                <li key={index}>
                  <a href={createGoogleSearchUrl(similar.title)} target="_blank" rel="noopener noreferrer" className="flex items-center text-apple-blue hover:underline text-sm text-left">
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    <span>{similar.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RecipeCard;
