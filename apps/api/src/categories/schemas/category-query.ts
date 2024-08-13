export const categoryQueries = ["title", "createdAt", "archivedAt"] as const;

export const CategoryQueries: Record<CategoryQuery, CategoryQuery> = {
  title: "title",
  createdAt: "createdAt",
  archivedAt: "archivedAt",
};

export type CategoryQuery = (typeof categoryQueries)[number];
