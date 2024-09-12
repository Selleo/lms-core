import React from "react";
import { Box, Label } from "@adminjs/design-system";
import { ShowPropertyProps } from "adminjs";

const BodyTextCounter: React.FC<ShowPropertyProps> = ({ record }) => {
  const body = record?.params?.body;
  const length = body?.length || 0;

  return (
    <Box style={{ marginBottom: "28px", display: "flex" }}>
      <Label style={{ marginRight: "8px" }}>Body size:</Label>
      <p>{length}</p>
    </Box>
  );
};

export default BodyTextCounter;
