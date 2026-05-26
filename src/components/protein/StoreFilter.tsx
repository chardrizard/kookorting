
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Supermarket } from '@/lib/protein-data';
import { trackSupermarketSelection, trackViewMoreSupermarkets } from '@/services/analytics';

interface StoreFilterProps {
  availableStores: Supermarket[];
  selectedStores: string[];
  toggleStore: (store: string) => void;
}

const StoreFilter = ({ availableStores, selectedStores, toggleStore }: StoreFilterProps) => {
  const [showAllStores, setShowAllStores] = useState(false);

  const visibleStores = showAllStores ? availableStores : availableStores.slice(0, 5);

  const handleStoreToggle = (storeName: string) => {
    toggleStore(storeName);
    if (!selectedStores.includes(storeName)) {
      trackSupermarketSelection(storeName);
    }
  };

  const handleShowMoreStores = () => {
    setShowAllStores(!showAllStores);
    trackViewMoreSupermarkets();
  };

  return (
    <div className="pb-4 overflow-x-auto">
      <label className="block text-sm font-medium mb-2 text-nature-text text-left">
        Filteren op supermarkt
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {visibleStores.map((store) => (
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

      {availableStores.length > 5 && (
        <button
          onClick={handleShowMoreStores}
          className="flex items-center text-sm text-nature-primary hover:underline mt-2"
        >
          {showAllStores ? (
            <><ChevronUp size={16} className="mr-1" />Minder supermarkten</>
          ) : (
            <><ChevronDown size={16} className="mr-1" />Meer supermarkten</>
          )}
        </button>
      )}
    </div>
  );
};

export default StoreFilter;
