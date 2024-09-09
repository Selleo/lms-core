import { addAuthorId } from "./common/actions/before/addAuthorId.js";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { beforeCreateOrUpdateQuestions } from "./common/actions/before/createOrUpdateQuestions.js";
import { Components } from "../components/index.js";
import { questionValueOptions } from "./common/consts/selectOptions/questionValueOptions.js";
import { ResourceOptions } from "adminjs";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";

export const questionsConfigOptions: ResourceOptions = {
  parent: "lesson-items",
  actions: {
    list: {
      before: [statusFilterBeforeAction],
    },
    delete: {
      isAccessible: false,
      isVisible: false,
    },
    new: {
      before: [beforeCreateOrUpdateQuestions, addAuthorId],
    },
    edit: {
      before: [beforeCreateOrUpdateQuestions],
    },
    ...archivingActions,
  },
  editProperties: [
    "question_type",
    "question_body",
    "solution_explanation",
    "state",
    "archived",
  ],
  filterProperties: ["created_at", "question_type", "state", "status"],
  listProperties: ["question_body", "question_type", "state", "status"],
  showProperties: [
    "question_type",
    "question_body",
    "solution_explanation",
    "author_id",
    "created_at",
    "updated_at",
    "state",
    "status",
  ],
  properties: {
    archived: {
      isRequired: false,
    },
    solution_explanation: {
      type: "richtext",
      isRequired: false,
    },
    status: {
      components: {
        list: Components.ArchiveList,
        show: Components.ArchiveShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: statusOptions,
      },
    },
    state: {
      availableValues: stateOptions,
      isRequired: false,
    },
    question_body: {
      isRequired: false,
    },
    question_type: {
      availableValues: questionValueOptions,
      isRequired: false,
    },
  },
};
