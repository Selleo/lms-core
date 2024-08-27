import { ComponentLoader } from "adminjs";
import {
  componentLoaderOverride,
  componentsList,
} from "./overrideComponentsList.js";

const componentLoader = new ComponentLoader();

const singleComponents = {
  MyInput: componentLoader.add("MyInput", "./helpers/MyInput"),
  Select: componentLoader.add("Select", "./helpers/Select"),
};

const pagesComponents = {
  // Table: componentLoader.add("Table", "./Table"),
  // ShowPage: componentLoader.add("ShowPage", "./ShowPage"),
  // EditPage: componentLoader.add("EditPage", "./EditPage"),
};

// componentLoader.override(adminJS Component Name, path to custom component)
componentLoaderOverride(componentsList, componentLoader);

const Components = {
  ...singleComponents,
  ...pagesComponents,
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
