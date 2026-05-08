
import { Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

const GenerateButton = ({ isLoading, onClick }: GenerateButtonProps) => {
  return (
    <div className="sticky bottom-4 pt-4 w-full bg-gradient-to-t from-nature-background to-transparent pb-4">
      <div className="flex justify-center">
        <button
          onClick={onClick}
          disabled={isLoading}
          className="button-primary w-full max-w-md py-3 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Recepten ontdekken...
            </>
          ) : (
            "Ontdek Recepten"
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerateButton;
