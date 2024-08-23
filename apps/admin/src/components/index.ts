import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  ArchiveFilter: componentLoader.add(
    "ArchiveFilter",
    "./filters/ArchiveFilter",
  ),
  ArchiveShow: componentLoader.add("ArchiveShow", "./show/ArchiveShow"),
  StatusListValue: componentLoader.add(
    "StatusListValue",
    "./custom/StatusListValue",
  ),
};

export { componentLoader, Components };
