interface StepHeaderProps {
  title?: string;
  description?: string;
}

export const StepHeader = ({ title, description }: StepHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold">{title}</h1>
    {description && <p className="text-gray-600 mt-2">{description}</p>}
  </div>
);
