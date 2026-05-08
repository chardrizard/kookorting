
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { type SelectionState } from '@/lib/types';

export const useSelectionValidation = () => {
  const [showProteinAlert, setShowProteinAlert] = useState(false);
  const [showCuisineAlert, setShowCuisineAlert] = useState(false);
  const proteinRef = useRef<HTMLDivElement>(null);
  const cuisineRef = useRef<HTMLDivElement>(null);

  const validateSelection = (selectionState: SelectionState) => {
    setShowProteinAlert(false);
    setShowCuisineAlert(false);

    if (!selectionState.protein) {
      setShowProteinAlert(true);
      toast.error('Selecteer een eiwit om door te gaan');
      if (proteinRef.current) {
        proteinRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return false;
    }

    if (!selectionState.cuisine) {
      setShowCuisineAlert(true);
      toast.error('Selecteer een keuken om door te gaan');
      if (cuisineRef.current) {
        cuisineRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return false;
    }

    return true;
  };

  return {
    showProteinAlert,
    showCuisineAlert,
    setShowProteinAlert,
    setShowCuisineAlert,
    proteinRef,
    cuisineRef,
    validateSelection
  };
};
