import { Type } from "@sinclair/typebox";
import { InferInsertModel } from "drizzle-orm";
import { categories } from "src/storage/schema";

export const categoryCreateSchema = Type.Object({
  title: Type.String(),
});
export type CategoryInsert = InferInsertModel<typeof categories>;
