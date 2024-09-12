import { asc, desc } from "drizzle-orm";
export function getSortOptions<T extends string, K extends string>(sort: T) {
  return {
    sortOrder: sort.startsWith("-") ? desc : asc,
    sortedField: sort.replace(/^-/, "") as K,
  };
}
