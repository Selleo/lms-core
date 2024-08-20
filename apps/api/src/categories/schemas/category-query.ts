import { Type, Static } from "@sinclair/typebox";

export const categorySortQueries = [
  "title",
  "createdAt",
  "archivedAt",
] as const;

export const CategorySortQueries: Record<CategorySortQuery, CategorySortQuery> =
  {
    title: "title",
    createdAt: "createdAt",
    archivedAt: "archivedAt",
  };

export type CategorySortQuery = (typeof categorySortQueries)[number];

export const sortCategoryQuery = Type.Union([
  Type.Literal("title"),
  Type.Literal("createdAt"),
  Type.Literal("archivedAt"),
  Type.Literal("-title"),
  Type.Literal("-createdAt"),
  Type.Literal("-archivedAt"),
]);

export type SortCategoryQuery = Static<typeof sortCategoryQuery>;
