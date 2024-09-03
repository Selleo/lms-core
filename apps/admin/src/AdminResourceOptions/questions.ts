import { archivingActions } from "./common/actions/custom/archivingActions.js";
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
    ...archivingActions,
  },
  listProperties: ["created_at", "question_type", "state", "status"],
  properties: {
    solution_explanation: {
      type: "richtext",
    },
    question_type: {
      availableValues: [...questionValueOptions],
    },
    status: {
      components: {
        list: Components.ArchiveList,
        show: Components.ArchiveShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: [...statusOptions],
      },
      isVisible: {
        edit: false,
        show: true,
        filter: true,
      },
    },
    state: {
      availableValues: [...stateOptions],
    },
    created_at: {
      isVisible: {
        edit: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    updated_at: {
      isVisible: {
        edit: false,
        show: true,
        filter: false,
      },
    },
  },
};
