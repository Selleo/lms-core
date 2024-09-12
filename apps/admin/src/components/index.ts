import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  ArchiveShow: componentLoader.add("ArchiveShow", "./show/ArchiveShow"),
  StatusListValue: componentLoader.add(
    "StatusListValue",
    "./custom/StatusListValue",
  ),
  ArchiveList: componentLoader.add("ArchiveList", "./list/ArchiveList"),
  FilterSelect: componentLoader.add("FilterSelect", "./filters/FilterSelect"),
  AuthorId: componentLoader.add("AuthorId", "./custom/AuthorId"),
  LessonItems: componentLoader.add("LessonItems", "./custom/LessonItems"),
  PhotoPreview: componentLoader.add("PhotoPreview", "./photo/PhotoPreview"),
  BodyTextCounter: componentLoader.add(
    "BodyTextCounter",
    "./custom/BodyTextCounter",
  ),
};

export { componentLoader, Components };
