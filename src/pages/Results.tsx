
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import useRecipeStore from '@/hooks/useRecipeStore';
import { UserRound, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Results = () => {
  const navigate = useNavigate();
  const { recipes, protein, cuisine, servingInfo, resetStore } = useRecipeStore();
  
  useEffect(() => {
    if (!recipes?.length || !protein || !cuisine) {
      navigate('/selection');
      return;
    }
  }, [recipes, protein, cuisine, navigate]);
  
  const handleCreateAnother = () => {
    resetStore();
    navigate('/selection');
    // Scroll to top when redirecting
    window.scrollTo(0, 0);
  };
  
  const handleBackToSelection = () => {
    resetStore();
    navigate('/selection');
    // Scroll to top when redirecting
    window.scrollTo(0, 0);
  };
  
  const handleFeedbackClick = () => {
    navigate('/about');
    // Use setTimeout to ensure navigation happens before scrolling
    setTimeout(() => {
      const feedbackForm = document.getElementById('feedback-form');
      if (feedbackForm) {
        feedbackForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  // Early return if data is not available
  if (!recipes?.length || !protein || !cuisine) {
    return null;
  }
  
  // Get the cuisine name - simply use the name property
  const cuisineName = cuisine.name;
  
  return (
    <div className="min-h-screen bg-nature-background">
      <Header />
      
      <main className="w-full pt-24 pb-24">
        <div className="mx-auto px-4 sm:px-6 w-full md:w-[70%] max-w-[1200px] min-w-[min(800px,100%)] space-y-10 sm:space-y-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Jouw Recept Opties</h1>
            <p className="text-nature-text text-opacity-80">
              We hebben deze recepten gemaakt met {protein.name} van {protein.store} 
              {' '}en {cuisineName} keuken stijl
            </p>
          </div>
          
          {servingInfo && (
            <div className="bg-white rounded-lg p-4 mb-8 shadow-sm border border-nature-border flex justify-center gap-6">
              <div className="flex items-center">
                <UserRound className="h-5 w-5 mr-2 text-nature-primary" />
                <span className="font-medium">
                  {servingInfo.adults} Volwassenen
                </span>
              </div>
              {servingInfo.kids > 0 && (
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-nature-primary" />
                  <span className="font-medium">
                    {servingInfo.kids} Kinderen
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-8">
            {recipes.map((recipe, index) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isFirst={index === 0} // Set isFirst prop for the first recipe
              />
            ))}
          </div>
          
          <div className="mt-12">
            <div className="flex justify-center mb-8">
              <button
                onClick={handleBackToSelection}
                className="button-secondary flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar Selectie
              </button>
            </div>
            
            {/* Feedback Information Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm mt-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-800 font-medium">Hoe bevallen de recepten? We horen graag je feedback!</p>
                </div>
                <Button 
                  onClick={handleFeedbackClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Geef je feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
