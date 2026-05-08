
import React from 'react';
import { AlertCircle, Plus, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UnsavedIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingIngredient: string;
  onAddIngredient: () => void;
  onDiscardIngredient: () => void;
}

const UnsavedIngredientModal = ({
  open,
  onOpenChange,
  pendingIngredient,
  onAddIngredient,
  onDiscardIngredient
}: UnsavedIngredientModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md mx-auto p-4 sm:p-6 text-center">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="flex items-center justify-center sm:justify-start gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-amber-500" /> 
            Onopgeslagen Ingrediënt
          </DialogTitle>
          <DialogDescription className="mt-2 text-center sm:text-left">
            Je hebt een ingrediënt ingevoerd maar nog niet toegevoegd:
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200 my-4 inline-block mx-auto overflow-hidden">
          <p className="font-medium text-amber-800 break-words">{pendingIngredient}</p>
        </div>
        
        <p className="text-sm text-muted-foreground text-center sm:text-left mb-4">
          Wil je dit ingrediënt toevoegen aan je recept of doorgaan zonder dit ingrediënt?
        </p>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="outline" 
            onClick={onDiscardIngredient}
            className="w-full flex items-center justify-center gap-2 py-5 sm:py-2"
          >
            Overslaan
          </Button>
          <Button 
            onClick={onAddIngredient}
            className="w-full flex items-center justify-center gap-2 py-5 sm:py-2 bg-nature-primary hover:bg-nature-primary/90"
          >
            <Plus className="h-4 w-4" />
            Ingrediënt toevoegen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnsavedIngredientModal;
