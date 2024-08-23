import { ComponentLoader } from "adminjs";

interface ComponentsList {
  [adminComponent: string]: string;
}

export const componentsList: ComponentsList = {
  // LoggedIn: "custom/LoggedIn",
  // Sidebar: "custom/Sidebar",
  // SidebarResourceSection: "custom/SidebarResourceSection",
  // SidebarFooter: "custom/SidebarFooter",
  // SidebarBranding: "custom/SidebarBranding",
  // TopBar: "custom/TopBar",
  // StyledBackButton: "custom/StyledBackButton",
  // ActionHeader: "custom/ActionHeader",
  // Login: "custom/Login",
  // AuthenticationBackgroundComponent: "custom/AuthenticationBackgroundComponent",
  // Footer: "custom/Footer",
  // RecordInList: "list/RecordInList",
  // RecordsTableHeader: "list/RecordsTableHeader",
  // RecordsTable: "list/RecordsTable",
  // SelectedRecords: "list/SelectedRecords",
  // DefaultShowAction: "show/DefaultShowAction",
};

export const componentLoaderOverride = (
  componentsList: ComponentsList,
  componentLoader: ComponentLoader,
) => {
  Object.entries(componentsList).forEach(([componentName, path]) => {
    componentLoader.override(componentName, `./${path}`);
  });
};