
import { useNavigate } from 'react-router-dom';
import { CookingPot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';

const uvpItems = [
  {
    title: "Bespaar op Eiwitten",
    description: "Vind de beste aanbiedingen op vlees, vis, vegetarische opties en andere eiwitten bij supermarkten bij jou in de buurt"
  },
  {
    title: "Kook zonder Verspilling",
    description: "Gebruik ingrediënten die je al in huis hebt en ontdek passende recepten om voedselverspilling te voorkomen"
  },
  {
    title: "Gezond & Voordelig",
    description: "Geniet van smaakvolle maaltijden zonder teveel uit te geven aan dure ingrediënte"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % uvpItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white to-nature-background p-4 w-full">
      <div className="max-w-xl w-full text-center animate-fade-in flex-grow flex flex-col justify-center items-center">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-nature-primary rounded-full flex items-center justify-center mb-6">
            <CookingPot className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h1 className="font-serif tracking-tight mb-4">
          <span className="text-3xl md:text-4xl font-bold text-[#3e9b75]">Kook</span>
          <span className="text-3xl md:text-4xl font-bold text-[#444444]">orting</span>
        </h1>
        
        <div className="my-8 w-full max-w-xl">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-xl"
            setApi={(api) => {
              if (api) {
                api.scrollTo(activeIndex);
              }
            }}
          >
            <CarouselContent>
              {uvpItems.map((item, index) => (
                <CarouselItem key={index} className="w-full">
                  <div className="p-2 w-full">
                    <div className="px-4 py-6">
                      <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                      <p className="text-nature-text text-opacity-70 min-h-24">{item.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              {uvpItems.map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 h-2 w-2 rounded-full transition-all ${
                    index === activeIndex ? "bg-nature-primary w-4" : "bg-nature-border"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
      
      <div className="w-full max-w-xl mt-8 sticky bottom-6 pb-2">
        <button 
          onClick={() => navigate('/selection')}
          className="w-full button-primary text-lg py-3"
        >
          Eet beter voor minder
        </button>
      </div>
    </div>
  );
};

export default Index;
