
import { ChevronDown } from 'lucide-react';

interface ShowMoreButtonProps {
  onClick: () => void;
}

const ShowMoreButton = ({ onClick }: ShowMoreButtonProps) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={onClick}
      className="text-nature-primary flex items-center hover:underline font-medium"
    >
      <ChevronDown size={18} className="mr-1" />
      Meer eiwitten tonen
    </button>
  </div>
);

export default ShowMoreButton;
