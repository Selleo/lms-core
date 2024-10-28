import { asc, desc } from "drizzle-orm";

type SortOrder = typeof asc | typeof desc;
type RemoveDescSign<T extends string> = T extends `-${infer U}` ? U : T;

export function getSortOptions<T extends string = string>(
  sort: T | undefined = "" as T,
): {
  sortOrder: SortOrder;
  sortedField: RemoveDescSign<T>;
} {
  return {
    sortOrder: sort.startsWith("-") ? desc : asc,
    sortedField: (sort.startsWith("-")
      ? sort.slice(1)
      : sort) as RemoveDescSign<T>,
  };
}
