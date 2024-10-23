import { ApiProperty } from "@nestjs/swagger";

export class FileUploadResponse {
  @ApiProperty()
  fileKey: string;

  @ApiProperty()
  fileUrl: string;
}
