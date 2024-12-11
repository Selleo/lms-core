import FileUploadInput from "~/components/FileUploadInput/FileUploadInput";
import { useStepperContext } from "~/components/Stepper/StepperContext";
import { Button } from "~/components/ui/button";

export const SetupCourse = () => {
  const { onNext, onPrev } = useStepperContext();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="text" className="w-full p-2 border rounded" placeholder="Course name" />
        <input type="text" className="w-full p-2 border rounded" placeholder="Course name" />
      </div>
      <textarea
        name="description"
        id=""
        className="w-full p-2 border rounded"
        placeholder="Course description"
      />
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
          Pricing
        </Button>
      </div>
    </div>
  );
};
