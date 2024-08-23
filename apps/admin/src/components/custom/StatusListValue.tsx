import React from "react";
import { Badge } from "@adminjs/design-system";

const StatusListValue = (props: any) => {
  const { record } = props;
  const value = record.params.archived;

  return (
    <Badge outline variant={value ? "danger" : "success"}>
      {value ? "Archived" : "Active"}
    </Badge>
  );
};

export default StatusListValue;
