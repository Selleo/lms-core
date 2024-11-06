export const SORTABLE_FIELDS = ["title", "author", "category"] as const;
export type SortableField = (typeof SORTABLE_FIELDS)[number];
export type SortOption = SortableField | `-${SortableField}` | "";

const FIELD_LABEL_MAP: Record<SortableField, string> = {
  title: "Course Name",
  author: "Author",
  category: "Category",
};

export const getFieldLabel = (field: SortableField): string => FIELD_LABEL_MAP[field];

export const createSortOption = (
  field: SortableField,
  order: "asc" | "desc",
): { value: SortOption; label: string } => ({
  value: order === "asc" ? field : `-${field}`,
  label: `${getFieldLabel(field)} ${order === "asc" ? "A-Z" : "Z-A"}`,
});

export const SORT_OPTIONS = SORTABLE_FIELDS.flatMap((field) => [
  createSortOption(field, "asc"),
  createSortOption(field, "desc"),
]);
