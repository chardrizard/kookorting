
import React from 'react';
import StoreFilter from './StoreFilter';
import SortSelect, { SortOption } from './SortSelect';
import { Supermarket } from '@/lib/protein-data';

interface ProteinFiltersProps {
  availableStores: Supermarket[];
  selectedStores: string[];
  toggleStore: (store: string) => void;
  activeSortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const ProteinFilters: React.FC<ProteinFiltersProps> = ({
  availableStores,
  selectedStores,
  toggleStore,
  activeSortOption,
  onSortChange
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="w-full sm:w-auto">
        <StoreFilter
          availableStores={availableStores}
          selectedStores={selectedStores}
          toggleStore={toggleStore}
        />
      </div>
      
      <div className="w-full sm:w-auto">
        <SortSelect 
          activeSortOption={activeSortOption} 
          onSortChange={onSortChange} 
        />
      </div>
    </div>
  );
};

export default ProteinFilters;
