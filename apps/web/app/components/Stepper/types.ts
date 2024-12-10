import type { ReactNode } from "react";

export interface StepConfig {
  title: string;
  description?: string;
  stepId: number;
  content: ReactNode;
}

export interface FormGroupSteps extends StepConfig {
  content: ReactNode;
}

export interface FormGroupConfig {
  steps: FormGroupSteps[];
  startStep: number;
  endStep: number;
}

export type Step = StepConfig | FormGroupConfig;

export interface StepperContextType {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  currentTitle?: string;
  currentDescription?: string;
}

export interface StepProps {
  children: ReactNode;
  stepId: number;
}

export interface FormGroupProps {
  children: ReactNode;
  startStep: number;
  endStep: number;
  steps: FormGroupSteps[];
}

export interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  children: ReactNode;
  className?: string;
  steps: Step[];
}
