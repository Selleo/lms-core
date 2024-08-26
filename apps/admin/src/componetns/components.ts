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
  Dashboard: componentLoader.add("Dashboard", "./custom/Dashboard"),
};

export { componentLoader, Components };
