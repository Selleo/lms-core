import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";

export const questionsConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  properties: {
    question_body: {
      type: "richtext",
    },
    solution_explanation: {
      type: "richtext",
    },
    question_type: {
      availableValues: [
        { value: "open_answer", label: "Open Answer" },
        { value: "single_choice", label: "Single Choice" },
        { value: "multiple_choice", label: "Multiple Choice" },
        { value: "fill_in_the_blanks", label: "Fill in the blanks" },
      ],
    },
    status: {
      availableValues: [...stateOptions],
    },
    created_at: {
      position: 7,
      isVisible: {
        edit: false,
        list: true,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    updated_at: {
      position: 8,
      isVisible: {
        edit: false,
        list: false,
        show: true,
        filter: false,
      },
    },
  },
};
