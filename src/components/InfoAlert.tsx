import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InfoAlertProps {
  message?: string;
}

export const InfoAlert = ({ message }: InfoAlertProps) => {
  if (!message) return null;
  else
    return (
      <Alert variant="default">
        <Info className="h-6 w-6" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
};
