import {
  type ActionContext,
  type ActionRequest,
  type ActionResponse,
  type After,
  Filter,
} from "adminjs";
import { CreatePasswordEmail } from "@repo/email-templates";
import { nanoid } from "nanoid";
import { sendEmail } from "../../../../services/email/emailService.js";

export const afterCreateUser: After<ActionResponse> = async (
  response,
  request: ActionRequest,
  context: ActionContext,
) => {
  const { record, _admin } = context;

  if (record?.isValid()) {
    const { first_name, email, role } = record.params;

    try {
      const token = nanoid(64);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);

      const usersResource = _admin.findResource("users");
      const user = await usersResource.find(
        new Filter({ email }, usersResource),
        {},
      );

      const createTokensResource = _admin.findResource("create_tokens");

      await createTokensResource.create(
        {
          user_id: user[0].id(),
          create_token: token,
          expiry_date: expiryDate,
        },
        context,
      );

      const url = `${process.env.CORS_ORIGIN}/auth/create-new-password?createToken=${token}&email=${email}`;

      const { text, html } = new CreatePasswordEmail({
        name: first_name,
        role,
        createPasswordLink: url,
      });

      await sendEmail({
        to: email,
        subject: "Welcome to the Platform!",
        text,
        html,
      });
    } catch (error) {
      response.notice = {
        message:
          "User was created but failed to send welcome email\n\n" + error,
        type: "error",
      };
      return response;
    }
  }

  return response;
};
