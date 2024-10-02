import {
  Box,
  Label,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@adminjs/design-system";
import { ApiClient, RecordJSON, ShowPropertyProps } from "adminjs";
import React, { useEffect, useState } from "react";

const MaxPerPage = 500;

interface LessonItemRelation extends RecordJSON {
  params: {
    id: string;
    lesson_id?: string;
    lesson_item_type?: "text_block" | "file" | "question";
    display_order?: number;
    lesson_item_id?: string;
  };
}

interface LessonItem extends RecordJSON {
  params: {
    id: string;
    title: string;
    type: "text_block" | "file" | "question";
    content: string;
    lesson_item_id?: string;
  };
}

const LessonContentItemsTable: React.FC<ShowPropertyProps> = ({ record }) => {
  const [assignedItems, setAssignedItems] = useState<LessonItem[]>([]);
  const [unassignedItems, setUnassignedItems] = useState<LessonItem[]>([]);
  const lessonId = record.id;
  const api = new ApiClient();

  const fetchAllItems = async () => {
    let allItems: LessonItem[] = [];
    const itemTypes = ["text_blocks", "files", "questions"];

    for (const itemType of itemTypes) {
      let page = 1;
      while (true) {
        const response = await api.resourceAction({
          resourceId: itemType,
          actionName: "list",
          params: {
            filters: { archived: false, state: "published" },
            page,
            perPage: MaxPerPage,
          },
        });
        const items: LessonItem[] = response.data.records.map(
          (item: RecordJSON) => ({
            ...item,
            params: {
              ...item.params,
              title:
                itemType.slice(0, -1) === "question"
                  ? item.params.question_body.slice(0, 77) + "..."
                  : item.params.title.slice(0, 77) + "...",
              type: itemType.slice(0, -1) as "text_block" | "file" | "question",
            },
          }),
        );
        allItems = [...allItems, ...items];
        if (items.length < MaxPerPage) {
          break;
        }
        page++;
      }
    }
    return allItems;
  };

  const fetchLessonItems = async () => {
    try {
      const assignedResponse = await api.resourceAction({
        resourceId: "lesson_items",
        actionName: "list",
        params: {
          filters: { lesson_id: lessonId },
          perPage: MaxPerPage,
        },
      });
      const lessonItemAssignments: LessonItemRelation[] =
        assignedResponse.data.records;
      const itemToLessonItemMap = new Map(
        lessonItemAssignments.map((assignment) => [
          `${assignment.params.lesson_item_type}-${assignment.params.lesson_item_id}`,
          assignment.params.id,
        ]),
      );

      const allItems = await fetchAllItems();
      const assignedItems: LessonItem[] = [];
      const unassignedItems: LessonItem[] = [];

      allItems.forEach((item: LessonItem) => {
        const lessonItemId = itemToLessonItemMap.get(
          `${item.params.type}-${item.params.id}`,
        );

        if (lessonItemId) {
          assignedItems.push({
            ...item,
            params: {
              ...item.params,
              lesson_item_id: lessonItemId,
            },
          });
        } else {
          unassignedItems.push(item);
        }
      });

      setAssignedItems(assignedItems);
      setUnassignedItems(unassignedItems);
    } catch (error) {
      console.error("Error fetching lesson items:", error);
    }
  };

  useEffect(() => {
    fetchLessonItems();
  }, [lessonId]);

  const handleAssign = async (itemId: string, itemType: string) => {
    try {
      await api.resourceAction({
        resourceId: "lesson_items",
        actionName: "new",
        data: {
          lesson_id: lessonId,
          lesson_item_id: itemId,
          lesson_item_type: itemType,
        },
      });
      await fetchLessonItems();
    } catch (error) {
      console.error("Error assigning item:", error);
    }
  };

  const handleRemove = async (lessonItemId: string | undefined) => {
    if (!lessonItemId) return;
    try {
      await api.recordAction({
        resourceId: "lesson_items",
        actionName: "delete",
        method: "post",
        recordId: lessonItemId,
      });
      await fetchLessonItems();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const renderItemList = (items: LessonItem[], title: string) => (
    <Box mb={20}>
      <Label>{title}</Label>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item: LessonItem) => (
            <TableRow key={`${item.params.type}-${item.params.id}`}>
              <TableCell>{item.params.title}</TableCell>
              <TableCell>{item.params.type}</TableCell>
              <TableCell>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() =>
                    title === "Assigned Items"
                      ? handleRemove(item.params.lesson_item_id)
                      : handleAssign(item.params.id, item.params.type)
                  }
                >
                  {title === "Assigned Items" ? "Remove" : "Assign"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Box>
      {renderItemList(assignedItems, "Assigned Items")}
      {renderItemList(unassignedItems, "Unassigned Items")}
    </Box>
  );
};

export default LessonContentItemsTable;
