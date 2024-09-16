import { ResourceOptions } from "adminjs";
import { Components } from "../components/index.js";
import { beforeCreateOrUpdateQuestionAnswer } from "./common/actions/before/beforeCreateOrUpdateQuestionAnswer.js";

export const questionAnswerConfigOptions: ResourceOptions = {
  actions: {
    new: {
      before: [beforeCreateOrUpdateQuestionAnswer],
    },
    edit: {
      before: [beforeCreateOrUpdateQuestionAnswer],
    },
  },
  navigation: false,
  showProperties: ["question_id", "option_text", "is_correct", "position"],
  editProperties: ["question_id", "option_text", "is_correct", "position"],
  listProperties: ["question_id", "option_text", "is_correct", "position"],
  properties: {
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
