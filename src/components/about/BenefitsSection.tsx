
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, UtensilsCrossed, Recycle } from "lucide-react";

const BenefitsSection = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-20">
      <Card className="bg-white bg-opacity-80 backdrop-blur border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-nature-primary bg-opacity-10 rounded-full"></div>
        <CardHeader className="pb-2 text-left relative">
          <div className="mb-3 bg-nature-primary bg-opacity-15 rounded-full w-10 h-10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-nature-primary" />
          </div>
          <CardTitle className="text-xl font-medium">Bespaar Geld</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-nature-text text-opacity-80 leading-relaxed text-left">Vind de beste aanbiedingen bij jouw favoriete supermarkten en bespaar op je wekelijkse boodschappen.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white bg-opacity-80 backdrop-blur border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-nature-secondary bg-opacity-10 rounded-full"></div>
        <CardHeader className="pb-2 text-left relative">
          <div className="mb-3 bg-nature-secondary bg-opacity-15 rounded-full w-10 h-10 flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-nature-secondary" />
          </div>
          <CardTitle className="text-xl font-medium">Creëer Recepten</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-nature-text text-opacity-80 leading-relaxed text-left">Genereer eenvoudig heerlijke recepten met de ingrediënten die nu in de aanbieding zijn.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white bg-opacity-80 backdrop-blur border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-nature-accent bg-opacity-10 rounded-full"></div>
        <CardHeader className="pb-2 text-left relative">
          <div className="mb-3 bg-nature-accent bg-opacity-15 rounded-full w-10 h-10 flex items-center justify-center">
            <Recycle className="h-5 w-5 text-nature-accent" />
          </div>
          <CardTitle className="text-xl font-medium">Voorkom Verspilling</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-nature-text text-opacity-80 leading-relaxed text-left">Maak effectief gebruik van wat in de aanbieding is en help mee voedselverspilling te verminderen.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenefitsSection;
