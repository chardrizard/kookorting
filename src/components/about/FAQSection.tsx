
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  return (
    <div className="mb-16 text-left">
      <h2 className="text-2xl font-medium mb-8">Veelgestelde vragen</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b border-nature-border">
          <AccordionTrigger className="hover:no-underline font-medium py-4">Hoe werkt Kookorting?</AccordionTrigger>
          <AccordionContent className="text-left text-nature-text text-opacity-80 leading-relaxed">
            Kookorting verzamelt dagelijks de aanbiedingen van populaire Nederlandse supermarkten. Je selecteert eiwitten in de aanbieding, kiest je favoriete keuken, en wij genereren passende recepten die gebruik maken van deze aanbiedingen.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border-b border-nature-border">
          <AccordionTrigger className="hover:no-underline font-medium py-4">Zijn alle aanbiedingen actueel?</AccordionTrigger>
          <AccordionContent className="text-left text-nature-text text-opacity-80 leading-relaxed">
            We doen ons best om alle aanbiedingen up-to-date te houden, maar controleer altijd de actuele folder van je supermarkt voor de meest recente prijzen.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border-b border-nature-border">
          <AccordionTrigger className="hover:no-underline font-medium py-4">Hoeveel kan ik besparen met Kookorting?</AccordionTrigger>
          <AccordionContent className="text-left text-nature-text text-opacity-80 leading-relaxed">
            Gebruikers rapporteren gemiddelde besparingen van €20 tot €30 per week op hun boodschappen door slim gebruik te maken van aanbiedingen. Dit kan oplopen tot meer dan €1000 per jaar voor een doorsnee huishouden.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="border-b border-nature-border">
          <AccordionTrigger className="hover:no-underline font-medium py-4">Is Kookorting gratis te gebruiken?</AccordionTrigger>
          <AccordionContent className="text-left text-nature-text text-opacity-80 leading-relaxed">
            Ja, Kookorting is volledig gratis te gebruiken. We geloven dat iedereen toegang moet hebben tot tools die helpen besparen op de boodschappen.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5" className="border-b border-nature-border">
          <AccordionTrigger className="hover:no-underline font-medium py-4">Van welke supermarkten tonen jullie aanbiedingen?</AccordionTrigger>
          <AccordionContent className="text-left text-nature-text text-opacity-80 leading-relaxed">
            We volgen momenteel de aanbiedingen van Albert Heijn, Jumbo, Lidl, Aldi en Plus. We werken continu aan het uitbreiden van ons aanbod..
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQSection;
