import { useNavigate } from "@remix-run/react";
import { ArrowBigLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";

type ErrorBoundaryProps = {
  stack?: string;
  message?: string;
};

const CustomErrorBoundary = ({ stack, message }: ErrorBoundaryProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 flex-col w-full">
      <div className="container">
        <h1 className="text-2xl font-bold text-primary-700 mb-4">{t('common.error.somethingWentWrong')}</h1>
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        {stack && <pre className="text-gray-600 bg-slate-200 p-4 rounded-sm">{stack}</pre>}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-500 transition-colors"
        >
          <ArrowBigLeft />
          <span>{t('common.button.goBack')}</span>
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 border border-primary text-primary rounded transition-colors bg-transparent"
        >
          {t('common.button.goToDashboard')}
        </Button>
      </div>
    </div>
  );
};

export default CustomErrorBoundary;
