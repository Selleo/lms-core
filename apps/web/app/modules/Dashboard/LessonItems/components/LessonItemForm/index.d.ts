import { ControllerRenderProps } from "react-hook-form";

interface UploadMethod {
  text: string;
  method: "sendFile" | "internet" | "";
}

interface DefaultValuesInterface {
  name: string;
  displayName: string;
  description: string;
  video?: File | null;
}

interface UploadFileProps {
  setUploadMethod: React.Dispatch<UploadMethod>;
}

interface UploadAlertDialogProps extends UploadFileProps {
  handleFileChange: (files: FileList | null) => void;
  field: ControllerRenderProps;
}

interface RenderDialogFormInterface extends UploadAlertDialogProps {
  uploadMethod: UploadMethod;
}
