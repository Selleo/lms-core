import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { UploadAlertDialogProps, UploadFileProps } from "../index.d.ts";

export const UploadFromVimeo: React.FC<UploadFileProps> = ({
  setUploadMethod,
}) => {
  return (
    <DropdownMenuItem
      className="dropdown-menu-item"
      onSelect={() =>
        setUploadMethod({
          text: "Upload from Vimeo",
          method: "vimeo",
        })
      }
    >
      Upload from Vimeo
    </DropdownMenuItem>
  );
};
