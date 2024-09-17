import { ResourceOptions } from "adminjs";
import { Components } from "../components/index.js";
import { beforeCreateOrUpdateQuestionAnswer } from "./common/actions/before/beforeCreateOrUpdateQuestionAnswer.js";
import { createQuestionAnswer } from "./common/actions/after/createQuestionAnswer.js";

export const questionAnswerConfigOptions: ResourceOptions = {
  actions: {
    new: {
      after: [createQuestionAnswer],
      before: [beforeCreateOrUpdateQuestionAnswer],
    },
    edit: {
      after: [createQuestionAnswer],
      before: [beforeCreateOrUpdateQuestionAnswer],
    },
  },
  navigation: false,
  showProperties: ["question_id", "option_text", "is_correct", "position"],
  editProperties: [
    "question_id",
    "option_text",
    "is_correct",
    "blankInfo",
    "position",
  ],
  listProperties: ["question_id", "option_text", "is_correct", "position"],
  properties: {
    blankInfo: {
      components: {
        edit: Components.BlankInfo,
      },
    },
    question_id: {
      isRequired: false,
      components: {
        edit: Components.QuestionId,
        show: Components.QuestionId,
      },
    },
    option_text: {
      isRequired: false,
    },
    is_correct: {
      isRequired: false,
    },
  },
};
