
import { useState } from 'react';
import useRecipeStore from '@/hooks/useRecipeStore';
import CuisineHeader from './cuisine/CuisineHeader';
import CuisineGrid from './cuisine/CuisineGrid';
import { CUISINES } from '@/constants/cuisineData';
import { type Cuisine } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';

// Reorder cuisines to show the requested top 5 first
const getReorderedCuisines = () => {
  // Define the preferred order for the first 5 cuisines
  const preferredTopCuisineIds = ['c13', 'c1', 'c4', 'c5', 'c11'];
  
  // Find cuisines matching the preferred IDs in order
  const topCuisines = preferredTopCuisineIds
    .map(id => CUISINES.find(c => c.id === id))
    .filter(c => c !== undefined) as Cuisine[];
  
  // Get the remaining cuisines excluding the ones already in topCuisines
  const remainingCuisines = CUISINES.filter(
    cuisine => !preferredTopCuisineIds.includes(cuisine.id)
  );
  
  // Return the combined array
  return [...topCuisines, ...remainingCuisines];
};

const CuisineSelection = () => {
  const { cuisine, setCuisine } = useRecipeStore();
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  
  // Get reordered cuisines
  const reorderedCuisines = getReorderedCuisines();
  
  // Show fewer cuisines on mobile by default
  const initialCuisineCount = isMobile ? 6 : 8;
  const visibleCuisines = showAll ? reorderedCuisines : reorderedCuisines.slice(0, initialCuisineCount);
  
  const handleCuisineSelect = (c: Cuisine) => {
    if (cuisine?.id === c.id) {
      return;
    }
    
    setCuisine(c);
  };
  
  const handleShowMore = () => {
    setShowAll(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <CuisineHeader />
      <CuisineGrid 
        cuisines={visibleCuisines} 
        selectedCuisine={cuisine} 
        onCuisineSelect={handleCuisineSelect} 
      />
      
      {!showAll && reorderedCuisines.length > initialCuisineCount && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleShowMore}
            className="text-nature-primary flex items-center hover:underline font-medium"
          >
            <ChevronDown size={18} className="mr-1" />
            Meer keukens tonen
          </button>
        </div>
      )}
    </div>
  );
};

export default CuisineSelection;
