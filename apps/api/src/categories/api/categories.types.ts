import type { CategoryFilterSchema, SortCategoryFieldsOptions } from "../schemas/categoryQuery";
import type { UUIDType } from "src/common";
import type { UserRole } from "src/users/schemas/user-roles";

export type CategoriesQuery = {
  filters?: CategoryFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortCategoryFieldsOptions;
  currentUserId?: UUIDType;
  currentUserRole?: UserRole;
};
