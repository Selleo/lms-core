import React from "react";
import { BasePropertyProps } from "adminjs";
import { Badge, Box, Label } from "@adminjs/design-system";

const CategoriesListShow = (props: BasePropertyProps) => {
  const isArchived = props?.record?.params?.archived;
  const isShow = props.where === "show";

  const badge = (
    <Badge
      outline
      style={{ width: "fit-content" }}
      variant={isArchived ? "danger" : "success"}
    >
      {isArchived ? "Archived" : "Active"}
    </Badge>
  );

  if (isShow) {
    return (
      <Box flex flexDirection="column" style={{ marginBottom: "24px" }}>
        <Label
          disabled
          inline
          style={{ fontWeight: 300, marginBottom: "4px" }}
          variant="secondary"
        >
          Status
        </Label>
        {badge}
      </Box>
    );
  }

  return <Box>{badge}</Box>;
};

export default CategoriesListShow;
