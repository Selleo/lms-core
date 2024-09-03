import { Box, Label, Badge } from "@adminjs/design-system";
import { ShowPropertyProps } from "adminjs";
import React from "react";

const ArchiveShow: React.FC<ShowPropertyProps> = ({ record, property }) => {
  const isArchived = record.params.archived;

  return (
    <Box style={{ marginBottom: "24px" }}>
      <Label style={{ fontWeight: 300, textTransform: "capitalize" }}>
        {property.label}
      </Label>
      <Badge outline variant={isArchived ? "danger" : "success"}>
        {isArchived ? "Archived" : "Active"}
      </Badge>
    </Box>
  );
};

export default ArchiveShow;
