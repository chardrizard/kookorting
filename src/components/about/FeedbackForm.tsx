
import { Separator } from "@/components/ui/separator";

const FeedbackForm = () => {
  return (
    <div id="feedback-form" className="mb-16 pt-6">
      <Separator className="mb-8" />
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-nature-border">
        <h2 className="text-xl font-medium mb-4 text-center">Hoe bevallen de recepten?</h2>
        
        {/* Responsive Google Form */}
        <div className="w-full overflow-hidden rounded-lg">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfU2NhO3vn_a-xtGvhhgn4RsA-RyZxiEcPAF1Qkp1unyyAQNg/viewform?embedded=true" 
            width="100%" 
            height="600" 
            style={{ border: 'none' }}
            title="Feedback Form"
            className="mx-auto"
          >
            Loading...
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
