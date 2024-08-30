import { Box, Label } from "@adminjs/design-system";
import { ShowPropertyProps } from "adminjs";
import React from "react";

const AuthorId: React.FC<ShowPropertyProps> = ({ record }) => {
  const firstName = record?.populated?.author_id?.params.first_name;
  const lastName = record?.populated?.author_id?.params.last_name;
  const email = record?.populated?.author_id?.params.email;

  const label = firstName && lastName ? `${firstName} ${lastName}` : email;

  return (
    <Box>
      <Label style={{ textTransform: "capitalize" }}>{label}</Label>
    </Box>
  );
};

export default AuthorId;
