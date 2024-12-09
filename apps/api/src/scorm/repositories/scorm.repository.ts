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

  /**
   * Creates file record in DB.
   * Each SCORM package has one file record representing entire package.
   * File record tracks:
   * - Original ZIP name
   * - S3 location of extracted files
   * - Who uploaded it and when
   *
   * @param trx - Optional transaction for atomic operations with metadata
   */
  async createScormFile(data: typeof files.$inferInsert, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    const [file] = await dbInstance.insert(files).values(data).returning();

    return file;
  }

  /**
   * Creates SCORM metadata record.
   * Metadata links SCORM files to course and stores technical details:
   * - SCORM version for choosing correct API
   * - Entry point for initial load
   * - S3 key for file access
   *
   * @param trx - Optional transaction for atomic operations with file record
   */
  async createScormMetadata(
    data: typeof scormMetadata.$inferInsert,
    trx?: PostgresJsDatabase<typeof schema>,
  ) {
    const dbInstance = trx ?? this.db;

    const [metadata] = await dbInstance.insert(scormMetadata).values(data).returning();

    return metadata;
  }

  /**
   * Gets SCORM metadata for course.
   * Used when:
   * - Serving SCORM content
   * - Checking if course has SCORM
   * - Getting SCORM version for API
   *
   * @param trx - Optional transaction for consistency with other operations
   */
  async getScormMetadata(courseId: UUIDType, trx?: PostgresJsDatabase<typeof schema>) {
    const dbInstance = trx ?? this.db;

    const [metadata] = await dbInstance
      .select()
      .from(scormMetadata)
      .where(eq(scormMetadata.courseId, courseId));

    return metadata;
  }
}
