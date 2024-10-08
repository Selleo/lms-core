import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  ArchiveList: componentLoader.add("ArchiveList", "./list/ArchiveList"),
  ArchiveShow: componentLoader.add("ArchiveShow", "./show/ArchiveShow"),
  AuthorId: componentLoader.add("AuthorId", "./custom/AuthorId"),
  BlankInfo: componentLoader.add("BlankInfo", "./edit/BlankInfo"),
  BodyTextCounter: componentLoader.add(
    "BodyTextCounter",
    "./custom/BodyTextCounter",
  ),
  Dashboard: componentLoader.add("Dashboard", "./custom/Dashboard"),
  FilesPreview: componentLoader.add("FilesPreview", "./custom/FilesPreview"),
  FilterSelect: componentLoader.add("FilterSelect", "./filters/FilterSelect"),
  LessonItems: componentLoader.add("LessonItems", "./custom/LessonItems"),
  PhotoPreview: componentLoader.add("PhotoPreview", "./photo/PhotoPreview"),
  QuestionId: componentLoader.add("QuestionId", "./custom/QuestionId"),
  LessonItemsAssigner: componentLoader.add(
    "LessonItemsAssigner",
    "./custom/LessonItemsAssigner/LessonItemsAssigner",
  ),
  StatusListValue: componentLoader.add(
    "StatusListValue",
    "./custom/StatusListValue",
  ),
  LessonAssigner: componentLoader.add(
    "LessonAssigner",
    "./custom/LessonAssigner/LessonAssigner",
  ),
};

export { componentLoader, Components };
