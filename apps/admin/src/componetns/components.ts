import { ComponentLoader } from "adminjs";
import {
  componentLoaderOverride,
  componentsList,
} from "./overrideComponentsList.js";

const componentLoader = new ComponentLoader();

const singleComponents = {
  CustomInputComponent: componentLoader.add(
    "CustomInputComponent",
    "./helpers/CustomInput",
  ),
  CustomSelectComponent: componentLoader.add(
    "CustomSelectComponent",
    "./helpers/CustomSelect",
  ),
};

const pagesComponents = {
  // CustomTable: componentLoader.add("CustomTable", "./CustomTable"),
  // CustomShowPage: componentLoader.add("CustomShowPage", "./CustomShowPage"),
  // CustomEditPage: componentLoader.add("CustomEditPage", "./CustomEditPage"),
};

// componentLoader.override(adminJS Component Name, path to custom component)
componentLoaderOverride(componentsList, componentLoader);

const Components = {
  ...singleComponents,
  ...pagesComponents,
  Dashboard: componentLoader.add("Dashboard", "./custom/Dashboard"),
};

export { componentLoader, Components };
