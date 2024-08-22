import { Components } from "../componetns/components.js";

export const usersConfigOptions = {
  options: {
    properties: {
      first_name: {
        components: {
          edit: Components.CustomInputComponent,
        },
      },
      last_name: {
        components: {
          edit: Components.CustomInputComponent,
        },
      },
      email: {
        components: {
          edit: Components.CustomInputComponent,
        },
      },
      created_at: {
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      updated_at: {
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      id: {
        isVisible: {
          edit: false,
          list: false,
          show: true,
          filter: false,
        },
      },
      role: {
        availableValues: [
          { value: "admin", label: "Admin" },
          { value: "student", label: "Student" },
          //TODO: Tutor doesnt work
        ],
        components: {
          edit: Components.CustomSelectComponent,
        },
      },
    },
    //TODO: This is just the setup; components will be supplemented in a different branch.

    // actions: {
    //   list: {
    //     component: Components.CustomTable,
    //   },
    //   show: {
    //     component: Components.CustomShowPage,
    //   },
    //   edit: {
    //     component: Components.CustomEditPage,
    //   },
    // },
  },
};
