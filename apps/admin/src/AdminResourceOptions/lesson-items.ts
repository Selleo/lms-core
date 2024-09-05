import { ResourceOptions } from "adminjs";

export const lessonItemsConfigOptions: ResourceOptions = {
  navigation: false,
  showProperties: ["lesson_id", "lesson_item_id", "display_order"],
  editProperties: ["lesson_id", "lesson_item_id", "display_order"],
  listProperties: ["lesson_id", "lesson_item_id", "display_order"],
};
