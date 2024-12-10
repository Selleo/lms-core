import { useStepperContext } from "~/components/Stepper/StepperContext";

export const UploadStep = () => {
  const { onNext, onPrev } = useStepperContext();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload SCORM</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded">
          Upload
        </button>
        <button onClick={onPrev} className="px-4 py-2 bg-blue-500 text-white rounded">
          Back
        </button>
      </div>
    </div>
  );
};
