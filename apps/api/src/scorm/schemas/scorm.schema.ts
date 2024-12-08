import { ApiProperty } from "@nestjs/swagger";

export class ScormMetadata {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  fileId: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  entryPoint: string;

  @ApiProperty()
  s3Key: string;
}

export class ScormUploadResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  metadata: ScormMetadata;
}
