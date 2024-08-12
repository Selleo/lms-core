import { ControllerRenderProps } from "react-hook-form";

interface UploadMethod {
  text: string;
  method: "sendFile" | "internet" | "";
}

interface DefaultValuesInterface {
  title: string;
  status: string;
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

interface RenderDialogForUploadVideoInterface extends UploadAlertDialogProps {
  uploadMethod: UploadMethod;
}
