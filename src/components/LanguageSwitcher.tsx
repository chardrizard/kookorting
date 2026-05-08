
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center gap-2 text-sm bg-white rounded-full border border-nature-border px-3 py-1.5 hover:bg-nature-background transition-all duration-200"
        aria-label="Language"
      >
        <Globe size={16} className="text-nature-text" />
        <div className="flex items-center">
          <img 
            src="/flag-nl.svg" 
            alt="Dutch flag" 
            className="w-4 h-4 mr-1.5 rounded-sm object-cover" 
          />
          <span className="hidden sm:inline">Nederlands</span>
        </div>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
