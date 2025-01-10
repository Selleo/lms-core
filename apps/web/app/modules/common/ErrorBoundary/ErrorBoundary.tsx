import { useNavigate } from "@remix-run/react";
import { ArrowBigLeft } from "lucide-react";

import { Button } from "~/components/ui/button";

type ErrorBoundaryProps = {
  stack?: string;
  message?: string;
};

const CustomErrorBoundary = ({ stack, message }: ErrorBoundaryProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 flex-col w-full">
      <div className="container">
        <h1 className="text-2xl font-bold text-primary-700 mb-4">Oops! Something went wrong.</h1>
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        {stack && <pre className="text-gray-600 bg-slate-200 p-4 rounded-sm">{stack}</pre>}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-500 transition-colors"
        >
          <ArrowBigLeft />
          <span>Go back</span>
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 border border-primary text-primary rounded transition-colors bg-transparent"
        >
          Go to dashboard
        </Button>
      </div>
    </div>
  );
};

export default CustomErrorBoundary;
