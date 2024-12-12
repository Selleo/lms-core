export type CourseStatus = "draft" | "published";
export type PricingType = "free" | "paid";

export interface ScormType {
  file: File | null;
  fileMetadata?: {
    name: string;
    size: number;
    type: string;
  };
}

export interface CourseDetailsType {
  title: string;
  category: string;
  description: string;
  thumbnail: File | null;
}

export interface CoursePricingType {
  type: PricingType;
  price?: number;
  currency?: string;
}

export interface CourseFormData {
  scorm: ScormType;
  details: CourseDetailsType;
  pricing: CoursePricingType;
  status: CourseStatus;
}

export interface CourseFormState {
  currentStep: number;
  formData: Partial<CourseFormData>;
}

export interface CourseFormActions {
  setCurrentStep: (step: number) => void;
  setFormData: (data: Partial<CourseFormData>) => void;
  resetForm: () => void;
}

export type CourseFormStore = CourseFormState & CourseFormActions;

export interface StepComponentProps {
  title: string;
  description: string;
}
