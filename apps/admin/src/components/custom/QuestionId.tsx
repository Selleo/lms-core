import { Box, Label } from "@adminjs/design-system";
import { ShowPropertyProps } from "adminjs";
import React from "react";

const QuestionId: React.FC<ShowPropertyProps> = ({ record }) => {
  const questionId = record?.params?.question_id;
  const htmlString = record?.populated?.question_id?.params?.question_body;

  return (
    <Box style={{ marginBottom: "24px" }}>
      <Label style={{ fontWeight: 300, textTransform: "capitalize" }}>
        Question
      </Label>
      <div dangerouslySetInnerHTML={{ __html: htmlString || questionId }} />
    </Box>
  );
};

export default QuestionId;
