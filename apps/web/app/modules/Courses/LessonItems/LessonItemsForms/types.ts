import { ControllerRenderProps } from "react-hook-form";

export interface UploadMethod {
  text: string;
  method: "sendFile" | "internet" | "";
}

export interface DefaultValuesInterface {
  name: string;
  displayName: string;
  description: string;
  video: string | File | FileList | null;
}

export interface UploadFileProps {
  setUploadMethod: React.Dispatch<UploadMethod>;
}

export interface UploadAlertDialogProps extends UploadFileProps {
  handleFileChange: (files: FileList | null) => void;
  field: ControllerRenderProps;
}

export interface RenderDialogFormInterface extends UploadAlertDialogProps {
  uploadMethod: UploadMethod;
}
