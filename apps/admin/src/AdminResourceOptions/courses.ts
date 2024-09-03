import { ResourceOptions } from "adminjs";
import { archivingActions } from "./common/actions/custom/archivingActions.js";
import { Components } from "../components/index.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { stateOptions } from "./common/consts/selectOptions/stateOptions.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";

export const coursesConfigOptions: ResourceOptions = {
  ...noParentNavigation,
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
  filterProperties: ["status", "category_id", "status"],
  properties: {
    id: {
      position: 1,
      isVisible: {
        edit: false,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    title: {
      position: 2,
      isVisible: {
        edit: true,
        list: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    description: {
      type: "richtext",
      props: {
        rows: 30,
      },
      position: 3,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    category_id: {
      position: 4,
      isVisible: {
        edit: true,
        list: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    state: {
      position: 5,
      isVisible: {
        list: true,
        filter: true,
        show: true,
        edit: true,
      },
      isSortable: true,
      availableValues: [...stateOptions],
    },
    status: {
      components: {
        list: Components.CategoriesListShow,
        show: Components.CategoriesListShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: [...statusOptions],
      },
      isVisible: {
        edit: false,
        list: true,
        show: true,
        filter: true,
      },
    },
    archived: {
      isRequired: false,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    image_url: {
      position: 11,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
    },
    author_id: {
      position: 10,
      components: {
        list: Components.AuthorId,
      },
      isVisible: {
        edit: true,
        list: true,
        show: true,
        filter: true,
      },
      isSortable: true,
    },
    price_in_cents: {
      position: 9,
      isVisible: {
        edit: true,
        list: false,
        show: true,
        filter: false,
      },
      isSortable: false,
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
      isSortable: false,
    },
  },
};
