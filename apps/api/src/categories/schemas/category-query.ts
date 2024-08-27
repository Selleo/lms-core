import { Type, Static } from "@sinclair/typebox";

export const categorySortFields = ["title", "createdAt", "archived"] as const;

export const CategorySortFields: Record<CategorySortField, CategorySortField> =
  {
    title: "title",
    createdAt: "createdAt",
    archived: "archived",
  };

export type CategorySortField = (typeof categorySortFields)[number];

export const sortCategoryFieldsOptions = Type.Union([
  Type.Literal("title"),
  Type.Literal("createdAt"),
  Type.Literal("archived"),
  Type.Literal("-title"),
  Type.Literal("-createdAt"),
  Type.Literal("-archived"),
]);

export type SortCategoryFieldsOptions = Static<
  typeof sortCategoryFieldsOptions
>;
