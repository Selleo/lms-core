import React from "react";
import { BasePropertyProps } from "adminjs";
import { Badge, Box, Label, Text } from "@adminjs/design-system";

const Status = (props: BasePropertyProps) => {
  const isArchived = props?.record?.params?.archived;
  const isShow = props.where === "show";

  if (isShow) {
    return (
      <Box mb="24px">
        <Box>
          <Label
            disabled
            inline
            style={{ fontWeight: 300 }}
            variant="secondary"
          >
            Status
          </Label>
          <Text style={{ fontWeight: 400, lineHeight: "16px" }}>
            {isArchived ? "not active" : "active"}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Badge size="default" variant={isArchived ? "danger" : "success"} outline>
        {isArchived ? "not active" : "active"}
      </Badge>
    </Box>
  );
};

export default Status;
