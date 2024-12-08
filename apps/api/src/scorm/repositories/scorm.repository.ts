import { Injectable, Inject } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { files, scormMetadata } from "src/storage/schema";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { UUIDType } from "src/common";
import type * as schema from "src/storage/schema";

@Injectable()
export class ScormRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async createScormFile(data: typeof files.$inferInsert, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    const [file] = await dbInstance.insert(files).values(data).returning();

    return file;
  }

  async createScormMetadata(
    data: typeof scormMetadata.$inferInsert,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    const [metadata] = await dbInstance.insert(scormMetadata).values(data).returning();

    return metadata;
  }

  async getScormMetadata(courseId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    const [metadata] = await dbInstance
      .select()
      .from(scormMetadata)
      .where(eq(scormMetadata.courseId, courseId));

    return metadata;
  }
}
