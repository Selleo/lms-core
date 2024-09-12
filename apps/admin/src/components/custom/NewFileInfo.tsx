import React from "react";
import { Badge, Box, Icon } from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";

const NewFileInfo: React.FC<BasePropertyProps> = ({ record }) => {
  const isEdit = window.location.pathname.includes(`${record?.id}/edit`);

  if (isEdit) return null;

  return (
    <Box style={{ marginBottom: "24px" }}>
      <Icon color="red" icon="info" size={24} style={{ marginRight: "8px" }} />
      <Badge variant="danger">Upload a file after creating a resource!</Badge>
    </Box>
  );
};

export default NewFileInfo;
