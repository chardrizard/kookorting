
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Percent, Info } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogoClick = () => {
    navigate('/selection');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white bg-opacity-80 backdrop-blur-md z-40 border-b border-nature-border">
      <div className="container h-full max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <button 
            onClick={handleLogoClick}
            className="font-serif text-xl font-semibold focus:outline-none"
          >
            <span className="text-[#3e9b75]">Kook</span>
            <span className="text-[#444444]">orting</span>
          </button>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-4">
          <Link 
            to="/about" 
            className="text-apple-gray-700 hover:text-nature-primary transition-colors flex items-center gap-1"
          >
            <Info className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Over Ons</span>
          </Link>
          
          <Link 
            to="/aanbiedingen" 
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
              location.pathname === '/aanbiedingen' 
                ? 'bg-[#F2FCE2] text-nature-primary border border-nature-primary' 
                : 'text-apple-gray-700 hover:text-nature-primary border border-transparent'
            }`}
          >
            <Percent className="h-4 w-4" />
            <span className="hidden sm:inline">Aanbiedingen</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
