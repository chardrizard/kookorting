
import React from 'react';
import { Protein } from '@/lib/types';
import { ProteinWithDetails } from '@/lib/protein-data';
import ProteinCard from './ProteinCard';
import ShowMoreButton from './ShowMoreButton';

interface ProteinGridProps {
  filteredProteins: ProteinWithDetails[];
  proteinLimit: number;
  setProteinLimit: (limit: number) => void;
  selectedProtein: Protein | null;
  onSelectProtein: (protein: Protein) => void;
}

const ProteinGrid: React.FC<ProteinGridProps> = ({
  filteredProteins,
  proteinLimit,
  setProteinLimit,
  selectedProtein,
  onSelectProtein
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 w-full">
        {filteredProteins.length > 0 ? (
          filteredProteins.slice(0, proteinLimit).map(p => (
            <ProteinCard 
              key={p.id} 
              protein={p} 
              isSelected={selectedProtein?.id === p.id}
              onSelect={onSelectProtein}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-nature-text text-opacity-70">
            Geen eiwitten gevonden voor de geselecteerde filters.
          </div>
        )}
      </div>

      {filteredProteins.length > proteinLimit && (
        <ShowMoreButton onClick={() => setProteinLimit(proteinLimit + 6)} />
      )}
    </>
  );
};

export default ProteinGrid;
