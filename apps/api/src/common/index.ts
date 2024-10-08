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

export class PaginatedResponse<T, K extends Pagination = Pagination> {
  data: T;
  pagination: K;

  constructor(data: { data: T; pagination: K }) {
    Object.assign(this, data);
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

export function paginatedResponse(data: TSchema) {
  return Type.Object({
    data,
    pagination: pagination,
  });
}

export function nullResponse() {
  return Type.Null();
}

export const pagination = Type.Object({
  totalItems: Type.Number(),
  page: Type.Number(),
  perPage: Type.Number(),
});
export type Pagination = Static<typeof pagination>;
