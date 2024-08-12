import { RenderDialogForUploadVideoInterface } from "../index.js";
import { UploadFileDialog } from "./UploadFile.js";
import { UploadFromInternetDialog } from "./UploadFromInternet.js";

export const RenderDialogForUploadVideo = ({
  uploadMethod,
  setUploadMethod,
  handleFileChange,
  field,
}: RenderDialogForUploadVideoInterface) => {
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
