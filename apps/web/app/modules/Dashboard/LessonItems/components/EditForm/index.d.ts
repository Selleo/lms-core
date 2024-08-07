import { ControllerRenderProps } from "react-hook-form";

interface UploadMethod {
  text: string;
  method: "sendFile" | "internet" | "";
}

interface UploadFileProps {
  setUploadMethod: React.Dispatch<UploadMethod>;
}

interface UploadAlertDialogProps extends UploadFileProps {
  handleFileChange: (files: FileList | null) => void;
  videoFile: File | null;
  field: ControllerRenderProps;
}
