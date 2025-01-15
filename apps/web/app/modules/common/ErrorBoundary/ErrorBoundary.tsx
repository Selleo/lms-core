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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
      <div className="container">
        <h1 className="text-primary-700 mb-4 text-2xl font-bold">
          {t("common.error.somethingWentWrong")}
        </h1>
        {message && <p className="mb-4 text-gray-600">{message}</p>}
        {stack && <pre className="rounded-sm bg-slate-200 p-4 text-gray-600">{stack}</pre>}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => navigate(-1)}
          className="bg-primary hover:bg-primary-500 mt-6 rounded px-4 py-2 text-white transition-colors"
        >
          <ArrowBigLeft />
          <span>{t("common.button.goBack")}</span>
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="border-primary text-primary mt-6 rounded border bg-transparent px-4 py-2 transition-colors"
        >
          {t("common.button.goToDashboard")}
        </Button>
      </div>
    </div>
  );
};

export default CustomErrorBoundary;
