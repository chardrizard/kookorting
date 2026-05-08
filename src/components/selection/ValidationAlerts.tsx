
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationAlertsProps {
  showProteinAlert: boolean;
  showCuisineAlert: boolean;
}

const ValidationAlerts = ({ showProteinAlert, showCuisineAlert }: ValidationAlertsProps) => {
  return (
    <>
      {showProteinAlert && (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Selecteer een eiwit voordat je doorgaat.
          </AlertDescription>
        </Alert>
      )}

      {showCuisineAlert && (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Selecteer een keuken voordat je doorgaat.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ValidationAlerts;
