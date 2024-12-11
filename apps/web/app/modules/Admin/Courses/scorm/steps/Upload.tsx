import FileUploadInput from "~/components/FileUploadInput/FileUploadInput";
import { useStepperContext } from "~/components/Stepper/StepperContext";
import { Button } from "~/components/ui/button";

export const UploadStep = () => {
  const { onNext, onPrev } = useStepperContext();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload SCORM</h2>
      <FileUploadInput
        handleFileUpload={function (file: File): Promise<void> {
          throw new Error("Function not implemented.");
        }}
        isUploading={false}
        contentTypeToDisplay={""}
      />
      <div className="flex gap-2">
        <Button onClick={onPrev} className="px-4 py-2 rounded">
          Cancel
        </Button>
        <Button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded">
          Setup Course
        </Button>
      </div>
    </div>
  );
};
