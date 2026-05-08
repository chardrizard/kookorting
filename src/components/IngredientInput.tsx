import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import useRecipeStore from '@/hooks/useRecipeStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackAddIngredient } from '@/services/analytics';

const IngredientInput = ({ onInputChange }: { onInputChange?: (value: string) => void }) => {
  const { additionalIngredients, addAdditionalIngredient, removeAdditionalIngredient } = useRecipeStore();
  const [newIngredient, setNewIngredient] = useState('');
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      addAdditionalIngredient(newIngredient);
      
      // Track ingredient addition
      trackAddIngredient(newIngredient.trim());
      
      setNewIngredient('');
      if (onInputChange) {
        onInputChange('');
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewIngredient(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-left">{t('selection.ingredients.title')}</h2>
        <p className="text-apple-gray-500 text-left">{t('selection.ingredients.subtitle')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          type="text"
          value={newIngredient}
          onChange={handleInputChange}
          disabled={additionalIngredients.length >= 5}
          placeholder={additionalIngredients.length >= 5 
            ? t('selection.ingredients.maxReached') 
            : t('selection.ingredients.placeholder')}
          className="flex-1 p-3 bg-white border border-nature-border rounded-l-lg
                     focus:outline-none focus:ring-2 focus:ring-nature-primary focus:border-transparent"
        />
        <button 
          type="submit"
          disabled={additionalIngredients.length >= 5 || !newIngredient.trim()}
          className="px-4 py-3 bg-nature-primary text-white rounded-r-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-opacity-90 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>
      
      {additionalIngredients.length > 0 && (
        <div className="pt-2 w-full">
          <div className="flex flex-wrap gap-2">
            {additionalIngredients.map((ingredient, index) => (
              <div key={index} className="ingredient-tag group">
                <span>{ingredient}</span>
                <button 
                  onClick={() => removeAdditionalIngredient(ingredient)}
                  className="tag-remove-button"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="text-right text-sm text-apple-gray-500 mt-2">
            {additionalIngredients.length}/5 {t('selection.ingredients.count')}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
