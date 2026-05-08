import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import useRecipeStore from '@/hooks/useRecipeStore';
import { trackPortionSize } from '@/services/analytics';
import { useEffect, useRef } from 'react';

const ServingSelector = () => {
  const { t } = useLanguage();
  const { servingInfo, updateServingInfo } = useRecipeStore();
  const { adults, kids } = servingInfo;
  const prevValues = useRef({ adults, kids });
  
  useEffect(() => {
    if (prevValues.current.adults !== adults || prevValues.current.kids !== kids) {
      trackPortionSize(adults, kids);
      prevValues.current = { adults, kids };
    }
  }, [adults, kids]);
  
  const incrementAdults = () => {
    updateServingInfo(adults + 1, kids);
  };
  
  const decrementAdults = () => {
    if (adults > 1) {
      updateServingInfo(adults - 1, kids);
    }
  };
  
  const incrementKids = () => {
    updateServingInfo(adults, kids + 1);
  };
  
  const decrementKids = () => {
    if (kids > 0) {
      updateServingInfo(adults, kids - 1);
    }
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-1 text-left">
        <h2 className="text-lg font-medium text-nature-text">{t('selection.serving.title')}</h2>
      </div>
      
      <div className="flex flex-row gap-4">
        <div className="flex-1 bg-white p-3 rounded-lg border border-nature-border">
          <div className="mb-1 text-sm font-medium text-left">{t('selection.serving.adults')}</div>
          <div className="flex items-center justify-between">
            <button
              onClick={decrementAdults}
              disabled={adults <= 1}
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                adults <= 1 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                : 'border-nature-primary text-nature-primary hover:bg-nature-primary-15'
              }`}
            >
              <Minus size={16} />
            </button>
            
            <span className="text-xl font-medium">{adults}</span>
            
            <button
              onClick={incrementAdults}
              className="w-8 h-8 rounded-full border border-nature-primary text-nature-primary hover:bg-nature-primary-15 flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-3 rounded-lg border border-nature-border">
          <div className="mb-1 text-sm font-medium text-left">{t('selection.serving.kids')}</div>
          <div className="flex items-center justify-between">
            <button
              onClick={decrementKids}
              disabled={kids <= 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                kids <= 0 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                : 'border-nature-primary text-nature-primary hover:bg-nature-primary-15'
              }`}
            >
              <Minus size={16} />
            </button>
            
            <span className="text-xl font-medium">{kids}</span>
            
            <button
              onClick={incrementKids}
              className="w-8 h-8 rounded-full border border-nature-primary text-nature-primary hover:bg-nature-primary-15 flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServingSelector;

