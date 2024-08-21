export const categoriesConfigOptions = {
  options: {
    properties: {
      created_at: {
        isVisible: {
          edit: false,
          list: true,
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
      archived_at: {
        isVisible: {
          edit: false,
          list: true,
          show: true,
          filter: true,
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
    },
  },
};
