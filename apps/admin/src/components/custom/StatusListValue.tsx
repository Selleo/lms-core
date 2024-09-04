import React from "react";
import { Badge } from "@adminjs/design-system";

const StatusListValue = ({ value }: { value: string }) => {
  return (
    <Badge outline variant={value ? "danger" : "success"}>
      {value ? "Archived" : "Active"}
    </Badge>
  );
};

export default StatusListValue;
