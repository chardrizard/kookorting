
import { type FC } from 'react';
import UnsavedIngredientModal from '../modals/UnsavedIngredientModal';

interface PendingIngredientHandlerProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  pendingIngredient: string;
  onAddIngredient: () => void;
  onDiscardIngredient: () => void;
}

const PendingIngredientHandler: FC<PendingIngredientHandlerProps> = ({
  showModal,
  setShowModal,
  pendingIngredient,
  onAddIngredient,
  onDiscardIngredient
}) => {
  return (
    <UnsavedIngredientModal
      open={showModal}
      onOpenChange={setShowModal}
      pendingIngredient={pendingIngredient}
      onAddIngredient={onAddIngredient}
      onDiscardIngredient={onDiscardIngredient}
    />
  );
};

export default PendingIngredientHandler;
