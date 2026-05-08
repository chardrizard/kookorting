import { Plus, Minus } from 'lucide-react';
import useRecipeStore from '@/hooks/useRecipeStore';
import { trackPortionSize } from '@/services/analytics';
import { useEffect, useRef } from 'react';

const ServingSelector = () => {
  const { servingInfo, updateServingInfo } = useRecipeStore();
  const { adults, kids } = servingInfo;
  const prevValues = useRef({ adults, kids });

  useEffect(() => {
    if (prevValues.current.adults !== adults || prevValues.current.kids !== kids) {
      trackPortionSize(adults, kids);
      prevValues.current = { adults, kids };
    }
  }, [adults, kids]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-1 text-left">
        <h2 className="text-lg font-medium text-nature-text">Portiegrootte</h2>
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex-1 bg-white p-3 rounded-lg border border-nature-border">
          <div className="mb-1 text-sm font-medium text-left">Volwassenen</div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => adults > 1 && updateServingInfo(adults - 1, kids)}
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
              onClick={() => updateServingInfo(adults + 1, kids)}
              className="w-8 h-8 rounded-full border border-nature-primary text-nature-primary hover:bg-nature-primary-15 flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white p-3 rounded-lg border border-nature-border">
          <div className="mb-1 text-sm font-medium text-left">Kinderen</div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => kids > 0 && updateServingInfo(adults, kids - 1)}
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
              onClick={() => updateServingInfo(adults, kids + 1)}
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
