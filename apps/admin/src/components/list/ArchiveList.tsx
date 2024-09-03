import React from "react";
import { BasePropertyProps } from "adminjs";
import { Badge } from "@adminjs/design-system";

const ArchiveList = (props: BasePropertyProps) => {
  const isArchived = props?.record?.params?.archived;

  return (
    <Badge
      outline
      style={{ width: "fit-content" }}
      variant={isArchived ? "danger" : "success"}
    >
      {isArchived ? "Archived" : "Active"}
    </Badge>
  );
};

export default ArchiveList;
