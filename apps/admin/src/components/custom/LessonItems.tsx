import { Box, Label } from "@adminjs/design-system";
import { ApiClient, RecordActionResponse, ShowPropertyProps } from "adminjs";
import React, { useEffect, useState } from "react";

const LessonItems: React.FC<ShowPropertyProps> = ({ record }) => {
  const [lessonItems, setlessonItems] = useState([]);

  const recordId = record.id;
  const api = new ApiClient();

  useEffect(() => {
    const fetchlessonItems = async () => {
      try {
        const response = await api.resourceAction({
          resourceId: "lesson_items",
          actionName: "list",
        });
        const relatedLessonItems = response.data.records.filter(
          (record: RecordActionResponse) =>
            record.params.lesson_id === recordId,
        );
        setlessonItems(relatedLessonItems);
      } catch (error) {
        console.error("Error fetching lesson items order:", error);
      }
    };

    fetchlessonItems();
  }, []);

  return (
    <Box>
      <Label style={{ textTransform: "capitalize" }}>
        {lessonItems?.length || 0}
      </Label>
    </Box>
  );
};

export default LessonItems;
