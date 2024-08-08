import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SES, SESClientConfig } from "@aws-sdk/client-ses";
import { EmailAdapter } from "./email.adapter";
import { Email } from "../email.interface";

@Injectable()
export class AWSSESAdapter extends EmailAdapter {
  private ses: SES;

  constructor(private configService: ConfigService) {
    super();
    const config: SESClientConfig = this.getAWSConfig();
    this.ses = new SES(config);
  }

  private getAWSConfig(): SESClientConfig {
    const region = this.configService.get<string>("aws.AWS_REGION");
    const accessKeyId = this.configService.get<string>("aws.AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "aws.AWS_SECRET_ACCESS_KEY",
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error("Missing AWS configuration");
    }

    return {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };
  }

  async sendMail(email: Email): Promise<void> {
    const params = {
      Source: email.from,
      Destination: {
        ToAddresses: [email.to],
      },
      Message: {
        Subject: {
          Data: email.subject,
        },
        Body: {
          Text: {
            Data: email.text,
          },
          Html: {
            Data: email.html,
          },
        },
      },
    };

    try {
      await this.ses.sendEmail(params);
    } catch (error) {
      console.error("Error sending email via AWS SES:", error);
      throw error;
    }
  }
}
