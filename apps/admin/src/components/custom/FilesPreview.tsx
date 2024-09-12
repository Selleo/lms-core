import { Badge, Box, Label } from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";
import React from "react";

const FilesPreview: React.FC<BasePropertyProps> = ({ record, where }) => {
  const isShow = where === "show";
  const path = record?.params?.url;
  const fileName = path.split("/").pop();

  const isEmpty = !fileName || fileName === "";

  return (
    <Box style={{ marginBottom: isShow ? "24px" : "0" }}>
      {isShow && (
        <Label style={{ fontWeight: 300, textTransform: "capitalize" }}>
          Current Files:
        </Label>
      )}
      {isEmpty ? (
        <p>No files uploaded yet</p>
      ) : (
        <Badge outline variant="primary">
          {fileName}
        </Badge>
      )}
    </Box>
  );
};

export default FilesPreview;
