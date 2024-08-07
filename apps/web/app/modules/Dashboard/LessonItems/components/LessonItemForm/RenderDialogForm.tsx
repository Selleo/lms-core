import { RenderDialogFormInterface } from ".";
import { UploadFileDialog } from "./uploadVideo/UploadFile";
import { UploadFromInternetDialog } from "./uploadVideo/UploadFromInternet";

export const RenderDialogForm = ({
  uploadMethod,
  setUploadMethod,
  handleFileChange,
  field,
}: RenderDialogFormInterface) => {
  return (
    <div>
      {uploadMethod.method === "sendFile" && (
        <>
          <UploadFileDialog
            setUploadMethod={setUploadMethod}
            handleFileChange={handleFileChange}
            field={field}
          />
        </>
      )}
      {uploadMethod.method === "internet" && (
        <UploadFromInternetDialog
          setUploadMethod={setUploadMethod}
          handleFileChange={handleFileChange}
          field={field}
        />
      )}
    </div>
  );
};
