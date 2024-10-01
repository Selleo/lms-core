import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>("s3.AWS_REGION") || "us-east-1",
      credentials: {
        accessKeyId:
          this.configService.get<string>("s3.AWS_ACCESS_KEY_ID") || "",
        secretAccessKey:
          this.configService.get<string>("s3.AWS_SECRET_ACCESS_KEY") || "",
      },
    });
    this.bucketName =
      this.configService.get<string>("s3.AWS_S3_BUCKET_NAME") || "";
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
