
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShowMoreButtonProps {
  onClick: () => void;
}

const ShowMoreButton = ({ onClick }: ShowMoreButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center mt-4">
      <button 
        onClick={onClick} 
        className="text-nature-primary flex items-center hover:underline font-medium"
      >
        <ChevronDown size={18} className="mr-1" />
        {t('selection.showMoreProteins')}
      </button>
    </div>
  );
};

export default ShowMoreButton;
