
import React from 'react';
import { type Cuisine } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { trackCuisineSelection } from '@/services/analytics';

interface CuisineButtonProps {
  cuisine: Cuisine;
  isSelected: boolean;
  onSelect: (cuisine: Cuisine) => void;
}

const CuisineButton = ({ cuisine, isSelected, onSelect }: CuisineButtonProps) => {
  const handleCuisineSelect = () => {
    if (!isSelected) {
      onSelect(cuisine);
      trackCuisineSelection(cuisine.name);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[120px]">
        <AspectRatio ratio={1} className="w-full">
          <button
            onClick={handleCuisineSelect}
            className={`w-full h-full rounded-full flex items-center justify-center text-3xl transition-all duration-200 ${
              isSelected 
                ? 'bg-nature-primary-15 border-2 border-nature-primary' 
                : 'bg-white border border-nature-border hover:bg-gray-50'
            }`}
            aria-label={`Selecteer ${cuisine.name} keuken`}
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              minWidth: '65px',
              minHeight: '65px'
            }}
          >
            {cuisine.emoji}
          </button>
        </AspectRatio>
      </div>
      <span 
        className={`mt-2 text-sm font-medium ${isSelected ? 'text-nature-primary' : 'text-nature-text'}`}
        style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}
      >
        {cuisine.name}
      </span>
    </div>
  );
};

export default CuisineButton;
