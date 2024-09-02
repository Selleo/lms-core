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
  CategoriesListShow: componentLoader.add(
    "CategoriesShow",
    "./show/CategoriesListShow",
  ),
  FilterSelect: componentLoader.add("FilterSelect", "./filters/FilterSelect"),
  AuthorId: componentLoader.add("AuthorId", "./custom/AuthorId"),
  LessonItems: componentLoader.add("LessonItems", "./custom/LessonItems"),
};

export { componentLoader, Components };
