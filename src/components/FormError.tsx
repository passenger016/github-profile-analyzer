import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  else
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-6 w-6" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
};
