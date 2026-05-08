
import { useState, useEffect } from 'react';
import { CookingPot, Check } from 'lucide-react';

const LoadingScreen = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  
  // Reduced to 5 key milestones for recipe generation (removed 2 steps)
  const generationMilestones = [
    { name: "Verwerken van ingrediënten", percent: 15 },
    { name: "Zoeken naar recepten", percent: 35 },
    { name: "Selecteren van de beste recepten", percent: 60 },
    { name: "Berekenen van porties", percent: 80 },
    { name: "Recepten klaarmaken", percent: 95 }
  ];

  // Funny quotes from your original code with some additions
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
  
  // Progress calculation based on elapsed time
  const progress = Math.min(Math.floor((elapsedSeconds / 120) * 100), 95);
  
  // Determine current milestone based on progress
  const currentMilestoneIndex = generationMilestones.findIndex(
    (milestone, index, array) => 
      progress < milestone.percent || 
      index === array.length - 1
  );
  
  const currentMilestone = generationMilestones[Math.max(0, currentMilestoneIndex)];
  
  // Get completed milestones
  const completedMilestones = generationMilestones.filter(milestone => progress >= milestone.percent);
  
  // Set up timer when component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Change quote every 5 seconds
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
    }, 5000);
    
    return () => clearInterval(quoteInterval);
  }, []);
  
  // Change stage every 8 seconds
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex(prevIndex => (prevIndex + 1) % generationMilestones.length);
    }, 8000);
    
    return () => clearInterval(stageInterval);
  }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-nature-background z-50 p-4">
      <div className="w-full max-w-md px-4 py-8">
        <div className="relative mb-6">
          <div className="h-24 w-24 mx-auto">
            <CookingPot className="w-20 h-20 text-nature-primary animate-pulse" />
          </div>
        </div>
        
        {/* Current milestone */}
        <h2 className="text-2xl font-medium mb-1 text-nature-text text-center">
          {currentMilestone?.name}...
        </h2>
        
        <p className="text-sm text-nature-text text-opacity-80 mb-6 text-center">
          {completedMilestones.length} van {generationMilestones.length} stappen voltooid
        </p>
        
        {/* Progress percentage */}
        <div className="text-3xl font-bold text-nature-primary mb-4 text-center">
          {progress}%
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="mb-8">
          {/* Progress track with milestone markers */}
          <div className="relative w-full h-4 bg-nature-secondary bg-opacity-30 rounded-full mb-2 overflow-hidden">
            {/* Actual progress bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-nature-primary transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
            
            {/* Milestone markers */}
            {generationMilestones.map((milestone, index) => (
              <div 
                key={index}
                className="absolute top-0 w-4 h-4 rounded-full flex items-center justify-center transform -translate-x-1/2"
                style={{ left: `${milestone.percent}%` }}
              >
                <div className={`w-3 h-3 rounded-full ${
                  progress >= milestone.percent 
                    ? 'bg-white' 
                    : 'bg-nature-border'
                } flex items-center justify-center text-xs`}>
                  {progress >= milestone.percent && (
                    <Check className="w-2 h-2 text-nature-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quote area */}
        <div className="min-h-[5rem] mb-4 flex items-center justify-center">
          <p className="text-lg text-nature-text text-opacity-80 italic text-center">
            "{funnyQuotes[quoteIndex]}"
          </p>
        </div>
        
        {/* Patient waiting message */}
        {elapsedSeconds > 30 && (
          <p className="text-sm text-nature-text text-opacity-60 mt-4 text-center">
            Bedankt voor je geduld! Recepten genereren kan even duren...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
