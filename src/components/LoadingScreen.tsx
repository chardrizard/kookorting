
import { useState, useEffect } from 'react';
import { CookingPot } from 'lucide-react';
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave';
import { trackEvent } from '@/services/analytics';

const LoadingScreen = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const generationMilestones = [
    { name: "Verwerken van ingrediënten", percent: 15 },
    { name: "Zoeken naar recepten", percent: 35 },
    { name: "Selecteren van de beste recepten", percent: 60 },
    { name: "Berekenen van porties", percent: 80 },
    { name: "Recepten klaarmaken", percent: 95 }
  ];

  const funnyQuotes = [
    "Eieren bakken: de ultieme 'scramble' om op tijd klaar te zijn...",
    "We hebben een speciale relatie met kaas: het's gewoon te Gouda!",
    "Geduld is een schone zaak... tenzij je honger hebt.",
    "Recept zegt 'snufje zout'... *schudt fles leeg*",
    "Waarom een kookwekker gebruiken als paniek het ook doet?",
    "Feitje: 60% van je lichaam is water, 40% is koffie op maandag.",
    "Bitterballen maken is als kunst, maar dan kun je het opeten.",
    "Er zijn twee soorten mensen: zij die één stroopwafel eten, en leugenaars.",
    "De échte Nederlandse kookthermometer: 'Is het al bruin?'",
    "Koken is als programmeren, maar de bugs smaken lekkerder.",
    "Als niemand in de keuken kijkt, telt het niet als knoeien.",
    "Met genoeg kruiden kun je zelfs een mislukt gerecht 'experimenteel' noemen."
  ];
  
  const progress = Math.min(
    Math.floor(elapsedSeconds * 7),
    95
  );
  
  const currentMilestoneIndex = generationMilestones.findIndex(
    (milestone, index, array) => 
      progress < milestone.percent || 
      index === array.length - 1
  );
  
  const currentMilestone = generationMilestones[Math.max(0, currentMilestoneIndex)];
  
  // Add the missing completedMilestones definition
  const completedMilestones = generationMilestones.filter(milestone => progress >= milestone.percent);
  
  useEffect(() => {
    trackEvent('loading_screen_viewed');
    
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * funnyQuotes.length));
    
    const quoteInterval = setInterval(() => {
      setQuoteIndex(prevIndex => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * funnyQuotes.length);
        } while (newIndex === prevIndex);
        return newIndex;
      });
    }, 10000);
    
    return () => clearInterval(quoteInterval);
  }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-nature-background z-50 p-4">
      <div className="w-full max-w-md px-4 py-8">
        <div className="relative mb-6">
          <div className="h-24 w-24 mx-auto">
            <CookingPot className="w-20 h-20 text-nature-primary animate-pulse" />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <TextShimmerWave
            className="text-2xl font-medium mb-1 [--base-color:#5E8C61] [--base-gradient-color:#F2C94C]"
            duration={4}
            spread={4}
            zDistance={1}
            scaleDistance={1.02}
            rotateYDistance={5}
            transition={{
              ease: [0.4, 0.0, 0.2, 1],
            }}
          >
            {currentMilestone?.name + "..."}
          </TextShimmerWave>
        </div>
        
        <p className="text-sm text-nature-text text-opacity-80 mb-6 text-center">
          {completedMilestones.length} van {generationMilestones.length} stappen voltooid
        </p>
        
        <div className="text-3xl font-bold text-nature-primary mb-4 text-center">
          {progress}%
        </div>
        
        <div className="mb-8">
          <div className="w-full h-4 rounded-full overflow-hidden bg-nature-border bg-opacity-30">
            <div 
              className="h-full bg-nature-primary transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="min-h-[5rem] mb-4 flex items-center justify-center">
          <p className="text-lg text-nature-text text-opacity-80 italic text-center">
            {funnyQuotes[quoteIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
