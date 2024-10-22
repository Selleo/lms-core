import React from "react";
import { Box, Icon, Label } from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";

const BlankInfo: React.FC<BasePropertyProps> = ({ record, property }) => {
  const isFillInTheBlank =
    record?.params?.question_type === "fill_in_the_blanks_text";
  const isFillInTheBlankAnswer =
    property.resourceId === "question_answer_options";

  if (isFillInTheBlankAnswer)
    return (
      <Box
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <Icon
          color="blue"
          icon="info"
          size={24}
          style={{ marginRight: "8px" }}
        />
        <Label style={{ marginBottom: "0px" }}>
          If this is
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "4px",
              marginRight: "4px",
            }}
          >
            Fill in the blank
          </span>
          question, the position number should correspond to the specific blank
          in the question, e.g., the first position for the first blank.
        </Label>
      </Box>
    );

  if (!isFillInTheBlank) return null;

  return (
    <Box style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
      <Icon color="blue" icon="info" size={24} style={{ marginRight: "8px" }} />
      <Label style={{ marginBottom: "0px" }}>
        Place all blanks between hashes, e.g., #name# is the biggest city in the
        UK.
      </Label>
    </Box>
  );
};

export default BlankInfo;
