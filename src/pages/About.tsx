
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BenefitsSection from '@/components/about/BenefitsSection';
import FAQSection from '@/components/about/FAQSection';
import FeedbackForm from '@/components/about/FeedbackForm';

const About = () => {
  return (
    <div className="min-h-screen bg-nature-background">
      <Header />
      
      <main className="w-full pt-24 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="text-left">
              <Link to="/selection" className="inline-flex items-center text-nature-primary hover:text-nature-primary-dark transition-colors mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar selection
              </Link>
            </div>
            <div className="mb-10 text-left">
              <h1 className="text-4xl font-semibold tracking-tight mb-6">Over Kookorting</h1>
              <p className="text-lg text-nature-text text-opacity-80 max-w-2xl font-light leading-relaxed">
                Kookorting helpt je heerlijke maaltijden te bereiden met producten die nu in de aanbieding zijn bij jouw favoriete supermarkt. Onze tool combineert actuele aanbiedingen van Albert Heijn, Jumbo, Lidl, Aldi en Plus met smakelijke recepten op maat.
              </p>
            </div>
          </div>
          
          {/* UVPs */}
          <BenefitsSection />
          
          {/* FAQs */}
          <FAQSection />
          
          {/* Google Form Feedback Section */}
          <FeedbackForm />
          
          <div className="text-left text-sm text-apple-gray-500">
            <p>© {new Date().getFullYear()} Kookorting. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
