import { ComponentLoader } from "adminjs";
import {
  componentLoaderOverride,
  componentsList,
} from "./overrideComponentsList.js";

const componentLoader = new ComponentLoader();

const singleComponents = {
  Input: componentLoader.add("Input", "./helpers/Input"),
  Select: componentLoader.add("Select", "./helpers/Select"),
};

// componentLoader.override(adminJS Component Name, path to custom component)
componentLoaderOverride(componentsList, componentLoader);

const Components = {
  ...singleComponents,
  ArchiveFilter: componentLoader.add(
    "ArchiveFilter",
    "./filters/ArchiveFilter",
  ),
  ArchiveShow: componentLoader.add("ArchiveShow", "./show/ArchiveShow"),
  StatusListValue: componentLoader.add(
    "StatusListValue",
    "./custom/StatusListValue",
  ),
  CategoriesListShow: componentLoader.add(
    "CategoriesShow",
    "./show/CategoriesListShow",
  ),
  StatusFilter: componentLoader.add("StatusFilter", "./filters/ArchiveFilter"),
  Dashboard: componentLoader.add("Dashboard", "./custom/Dashboard"),
};

export { componentLoader, Components };