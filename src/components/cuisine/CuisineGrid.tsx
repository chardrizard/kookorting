
import React from 'react';
import { type Cuisine } from '@/lib/types';
import CuisineButton from './CuisineButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface CuisineGridProps {
  cuisines: Cuisine[];
  selectedCuisine: Cuisine | null;
  onCuisineSelect: (cuisine: Cuisine) => void;
}

const CuisineGrid = ({ cuisines, selectedCuisine, onCuisineSelect }: CuisineGridProps) => {
  const isMobile = useIsMobile();
  
  // Use a 3-column grid on mobile, 4-column on larger screens
  return (
    <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-4 sm:gap-4 md:gap-6 lg:gap-8'} w-full max-w-4xl mx-auto h-auto`}>
      {cuisines.map((cuisine) => (
        <CuisineButton
          key={cuisine.id}
          cuisine={cuisine}
          isSelected={selectedCuisine?.id === cuisine.id}
          onSelect={onCuisineSelect}
        />
      ))}
    </div>
  );
};

export default CuisineGrid;
