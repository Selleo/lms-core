import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import type { Static } from "@sinclair/typebox";

export const scormMetadataSchema = Type.Object({
  id: UUIDSchema,
  createdAt: Type.String(),
  updatedAt: Type.String(),
  courseId: UUIDSchema,
  fileId: UUIDSchema,
  version: Type.String(),
  entryPoint: Type.String(),
  s3Key: Type.String(),
});

export const scormUploadResponseSchema = Type.Object({
  message: Type.String(),
  metadata: scormMetadataSchema,
});

export type ScormMetadata = Static<typeof scormMetadataSchema>;
export type ScormUploadResponse = Static<typeof scormUploadResponseSchema>;
