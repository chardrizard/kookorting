
import { useState } from 'react';
import useRecipeStore from '@/hooks/useRecipeStore';
import { useProteinData } from '@/hooks/useProteinData';
import ProteinFilters from './protein/ProteinFilters';
import ProteinGrid from './protein/ProteinGrid';
import ProteinLoadingState from './protein/ProteinLoadingState';

const ProteinSelection = () => {
  const { protein, setProtein } = useRecipeStore();
  const [proteinLimit, setProteinLimit] = useState<number>(6);
  
  const {
    filteredProteins,
    loading,
    error,
    selectedStores,
    activeSortOption,
    toggleStore,
    handleSortChange
  } = useProteinData();

  if (loading) return <ProteinLoadingState />;
  
  if (error) return (
    <div className="space-y-5">
      <div className="space-y-2 text-left">
        <h2 className="text-xl font-medium text-nature-text">Selecteer eiwitten in de aanbieding</h2>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2 text-left">
        <h2 className="text-xl font-medium text-nature-text">Selecteer eiwitten in de aanbieding</h2>
        <p className="text-nature-text text-opacity-70">Kies een afgeprijsd eiwit als basis voor je maaltijd</p>
      </div>
      
      <ProteinFilters
        selectedStores={selectedStores}
        toggleStore={toggleStore}
        activeSortOption={activeSortOption}
        onSortChange={handleSortChange}
      />
      
      <ProteinGrid
        filteredProteins={filteredProteins}
        proteinLimit={proteinLimit}
        setProteinLimit={setProteinLimit}
        selectedProtein={protein}
        onSelectProtein={setProtein}
      />
    </div>
  );
};

export default ProteinSelection;
