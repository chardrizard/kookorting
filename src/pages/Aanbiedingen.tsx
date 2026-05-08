
import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const supermarkets = [
  {
    name: 'Albert Heijn',
    logo: '/supermarkets/Albert Heijn.png',
    folderUrl: 'https://www.ah.nl/bonus',
    description: 'Dat is het van Albert Heijn! Wekelijkse Bonusaanbiedingen met korting tot 50%. Nieuwe acties elke maandag voor al uw dagelijkse boodschappen.',
    offerDays: 'Maandag t/m zondag',
  },
  {
    name: 'Jumbo',
    logo: '/supermarkets/Jumbo.png',
    folderUrl: 'https://www.jumbo.com/aanbiedingen/nu',
    description: 'Elke dag de laagste prijs garantie! Scherpe weekaanbiedingen en speciale kortingen op verse producten. Nieuwe folder elke woensdag.',
    offerDays: 'Woensdag t/m dinsdag',
  },
  {
    name: 'Lidl',
    logo: '/supermarkets/Lidl.png',
    folderUrl: 'https://www.lidl.nl/store',
    description: 'Verrassend veel kwaliteit voor weinig geld. Wekelijkse aanbiedingen op vers, houdbaar en unieke non-food producten. Nieuwe acties elke maandag.',
    offerDays: 'Maandag t/m zondag',
  },
  {
    name: 'Aldi',
    logo: '/supermarkets/Aldi.png',
    folderUrl: 'https://www.aldi.nl/aanbiedingen.html',
    description: 'Hoge kwaliteit, lage prijs. Voordelige weekaanbiedingen en wisselende non-food acties. Ontdek onze verrassende nieuwe folder elke zondag.',
    offerDays: 'Maandag t/m zondag',
  },
  {
    name: 'Dirk',
    logo: '/supermarkets/Dirk.png',
    folderUrl: 'https://www.dirk.nl/aanbiedingen',
    description: 'Lage prijzen, prima kwaliteit! Geniet van scherpe weekacties en speciale 1+1 gratis aanbiedingen. Nieuwe aanbiedingen elke week.',
    offerDays: 'Zondag t/m zaterdag',
  },
  {
    name: 'Amazing Oriental',
    logo: '/supermarkets/Amazing Oriental.png',
    folderUrl: 'https://www.orientalwebshop.nl/nl/amazing-deals',
    description: 'Dé Aziatische supermarkt van Nederland. Speciale aanbiedingen op authentieke Aziatische producten en verse specialiteiten. Wisselende seizoenspromoties.',
    offerDays: 'Wisselend per winkel',
  }
];

const Aanbiedingen = () => {
  return (
    <div className="min-h-screen bg-nature-background">
      <Header />
      
      <main className="w-full pt-24 pb-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="mb-8 text-left">
            <Link to="/selection" className="inline-flex items-center text-nature-primary hover:text-nature-primary-dark transition-colors mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar selectie
            </Link>
            <div className="mb-6 text-left">
              <h1 className="text-3xl font-bold mb-4">Aanbiedingen</h1>
              <p className="text-lg text-nature-text text-opacity-80">
                Bekijk de actuele folders van je favoriete supermarkten voor de beste aanbiedingen.
              </p>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {supermarkets.map((supermarket) => (
              <Card key={supermarket.name} className="border border-nature-border transition-all hover:shadow-md flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={supermarket.logo} 
                      alt={`${supermarket.name} logo`} 
                      className="h-10 w-auto object-contain"
                    />
                    <CardTitle className="text-xl font-semibold">{supermarket.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 flex-grow">
                  <p className="text-nature-text mb-4 text-sm text-left">
                    {supermarket.description}
                  </p>
                  <div className="flex items-start text-sm">
                    <span className="text-nature-primary font-medium mr-2">Geldig:</span>
                    <span>{supermarket.offerDays}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-nature-border">
                  <a 
                    href={supermarket.folderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Bekijk ${supermarket.name} aanbiedingen in nieuw tabblad`}
                    className="inline-flex items-center text-nature-primary font-medium hover:text-nature-primary-dark transition-colors"
                  >
                    Bekijk aanbiedingen
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Aanbiedingen;
