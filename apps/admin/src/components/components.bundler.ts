import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  Status: componentLoader.add("Status", "./status"),
  StatusFilter: componentLoader.add("StatusFilter", "./statusFilter"),
};

export { componentLoader, Components };
