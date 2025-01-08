import { useNavigate } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";

import { SCORM_CONFIG } from "../scorm.config";
import { useScormFormStore } from "../store/scormForm.store";

import { Progress } from "./Progress";

import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

interface StepWrapperProps {
  title: string;
  description: string;
}

export function StepWrapper({ title, description, children }: PropsWithChildren<StepWrapperProps>) {
  const navigate = useNavigate();
  const { currentStep } = useScormFormStore();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
          <Icon name="ArrowRight" className="w-4 h-4 mr-2 rotate-180" />
          <span>{t('adminScorm.button.back')}</span>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-neutral-950">{title}</h1>
        <p className="text-neutral-800 text-lg">{description}</p>
      </div>
      <Progress currentStep={currentStep} steps={SCORM_CONFIG} />
      {children}
    </div>
  );
}
