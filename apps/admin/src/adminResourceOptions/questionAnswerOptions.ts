import { ResourceOptions } from "adminjs";

export const questionAnswerConfigOptions: ResourceOptions = {
  navigation: false,
  showProperties: ["question_id", "option_text", "is_correct", "position"],
  editProperties: ["question_id", "option_text", "is_correct", "position"],
  listProperties: ["question_id", "option_text", "is_correct", "position"],
};
