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

export function nullResponse() {
  return Type.Null();
}

export const QueryParamsSchema = Type.Object({
  limit: Type.Optional(Type.Number()),
  offset: Type.Optional(Type.Number()),
  sort: Type.Optional(Type.String()),
  filter: Type.Optional(Type.String()),
});
