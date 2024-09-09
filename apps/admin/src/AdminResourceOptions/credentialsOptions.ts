import { ResourceOptions } from "adminjs";

export const credentialsConfigOptions: ResourceOptions = {
  navigation: false,
  actions: {
    new: { isAccessible: false },
    edit: { isAccessible: false },
    delete: { isAccessible: false },
    list: { isAccessible: false },
    show: { isAccessible: false },
  },
};
