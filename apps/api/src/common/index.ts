import { Static, TSchema, Type } from "@sinclair/typebox";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "src/storage/schema";

export type DatabasePg = PostgresJsDatabase<typeof schema>;

export class BaseResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class BasePaginatedResponse<T, K> {
  data: T;
  pagination: K;

  constructor(data: T, pagination: K) {
    this.data = data;
    this.pagination = pagination;
  }
}

export const UUIDSchema = Type.String({ format: "uuid" });
export type UUIDType = Static<typeof UUIDSchema>;

export function baseResponse(data: TSchema) {
  if (data.type === "array") {
    return Type.Object({
      data: Type.Array(data.items),
    });
  }
  return Type.Object({
    data,
  });
}

export function basePaginatedResponse(data: TSchema) {
  return Type.Object({
    data,
    pagination: basePagination,
  });
}

export function nullResponse() {
  return Type.Null();
}

export const PaginationValidation = [
  {
    name: "limit" as const,
    type: "query" as const,
    schema: Type.Optional(Type.Number()),
    coerceTypes: true,
  },
  {
    name: "offset" as const,
    type: "query" as const,
    schema: Type.Optional(Type.Number()),
    coerceTypes: true,
  },
  {
    name: "sort" as const,
    type: "query" as const,
    schema: Type.Optional(Type.String()),
  },
  {
    name: "filter" as const,
    type: "query" as const,
    schema: Type.Optional(Type.String()),
  },
];

export const basePagination = Type.Object({
  totalItems: Type.Number(),
  page: Type.Number(),
  pageSize: Type.Number(),
});
export type BasePagination = Static<typeof basePagination>;
