import { UploadFromInternet } from "./UploadFromInternet";
import { UploadFile } from "./UploadFile";
import { UploadMethod } from "../index";
import { CustomDropdown } from "../../CustomDropdown";

export const UploadVideoButton = ({
  setUploadMethod,
}: {
  setUploadMethod: React.Dispatch<UploadMethod>;
}) => {
  return (
    <>
      <CustomDropdown
        buttonVariant="default"
        buttonText="Upload Video"
        items={[
          {
            label: <UploadFromInternet setUploadMethod={setUploadMethod} />,
          },
          {
            label: <UploadFile setUploadMethod={setUploadMethod} />,
          },
        ]}
      />
    </>
  );
};
