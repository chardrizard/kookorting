
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPERMARKETS } from '@/lib/protein-data';
import { trackSupermarketSelection, trackViewMoreSupermarkets } from '@/services/analytics';

interface StoreFilterProps {
  selectedStores: string[];
  toggleStore: (store: string) => void;
}

const StoreFilter = ({ selectedStores, toggleStore }: StoreFilterProps) => {
  const [showAllStores, setShowAllStores] = useState<boolean>(false);
  const { t } = useLanguage();
  
  // Filter out Coop and Plus supermarkets
  const filteredSupermarkets = SUPERMARKETS.filter(store => 
    store.name !== 'Coop' && store.name !== 'Plus'
  );
  
  // Display 5 stores by default, or all if expanded
  const visibleStores = showAllStores ? filteredSupermarkets : filteredSupermarkets.slice(0, 5);

  const handleStoreToggle = (storeName: string) => {
    toggleStore(storeName);
    
    // Track selection if store is being selected (not deselected)
    if (!selectedStores.includes(storeName)) {
      trackSupermarketSelection(storeName);
    }
  };

  const handleShowMoreStores = () => {
    setShowAllStores(!showAllStores);
    // Add tracking
    trackViewMoreSupermarkets();
  };

  return (
    <div className="pb-4 overflow-x-auto">
      <label className="block text-sm font-medium mb-2 text-nature-text text-left">
        {t('selection.filter.store')}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {visibleStores.map(store => (
          <button 
            key={store.id} 
            onClick={() => handleStoreToggle(store.name)} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
              ${selectedStores.includes(store.name) 
                ? 'border-nature-primary bg-nature-primary-15 text-nature-primary' 
                : 'border-nature-border bg-white text-nature-text hover:bg-gray-50'}`} 
            aria-pressed={selectedStores.includes(store.name)}
          >
            {selectedStores.includes(store.name) && <Check size={14} className="text-nature-primary" />}
            {store.name}
          </button>
        ))}
      </div>
      
      {filteredSupermarkets.length > 5 && (
        <button 
          onClick={handleShowMoreStores} 
          className="flex items-center text-sm text-nature-primary hover:underline mt-2"
        >
          {showAllStores ? (
            <>
              <ChevronUp size={16} className="mr-1" />
              {t('selection.showLess')}
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" />
              {t('selection.showMoreStores')}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default StoreFilter;
