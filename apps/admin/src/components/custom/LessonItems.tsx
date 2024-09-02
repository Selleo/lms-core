import { Box, Label } from "@adminjs/design-system";
import { ApiClient, RecordActionResponse, ShowPropertyProps } from "adminjs";
import React, { useEffect, useState } from "react";

const LessonItems: React.FC<ShowPropertyProps> = ({ record }) => {
  const [lessonItemsOrder, setLessonItemsOrder] = useState([]);

  const recordId = record.id;
  const api = new ApiClient();

  useEffect(() => {
    const fetchLessonItemsOrder = async () => {
      try {
        const response = await api.resourceAction({
          resourceId: "lesson_items_order",
          actionName: "list",
        });
        const relatedLessonItems = response.data.records.filter(
          (record: RecordActionResponse) =>
            record.params.lesson_id === recordId,
        );
        setLessonItemsOrder(relatedLessonItems);
      } catch (error) {
        console.error("Error fetching lesson items order:", error);
      }
    };

    fetchLessonItemsOrder();
  }, []);

  return (
    <Box>
      <Label style={{ textTransform: "capitalize" }}>
        {lessonItemsOrder?.length || 0}
      </Label>
    </Box>
  );
};

export default LessonItems;
