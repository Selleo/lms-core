import { Components } from "../components/index.js";
import {
  type ActionContext,
  type ActionRequest,
  type ActionResponse,
  type After,
  type Before,
  Filter,
  type ResourceOptions,
  ValidationError,
} from "adminjs";
import { nanoid } from "nanoid";
import { sendEmail } from "../services/email/emailService.js";
import { CreatePasswordEmail } from "@repo/email-templates";
import { adminLikeRoles } from "./common/consts/selectOptions/adminLikeRoles.js";
import { statusOptions } from "./common/consts/selectOptions/statusOptions.js";
import { statusFilterBeforeAction } from "./common/actions/before/statusFilter.js";
import { noParentNavigation } from "./common/navigation/noParentNavigation.js";
import { nonAdminRoles } from "./common/consts/selectOptions/nonAdminRoles.js";

const beforeUserCreate: Before = async (
  request: ActionRequest,
  context: ActionContext,
) => {
  const { resource } = context;
  const { first_name, last_name, role, email } = request?.payload || {};

  if (!first_name) {
    throw new ValidationError({
      first_name: { message: "Please provide your name" },
    });
  }

  if (!last_name) {
    throw new ValidationError({
      last_name: { message: "Please provide your last name" },
    });
  }

  if (!email) {
    throw new ValidationError({
      email: { message: "Please provide your email address" },
    });
  }

  if (!role) {
    throw new ValidationError({
      role: { message: "Please select a role" },
    });
  }

  const users = await resource.find(new Filter({ email }, resource), {});
  const isUserExist = users.some(
    ({ params: { email } }) => email.toLowerCase() === email.toLowerCase(),
  );

  if (isUserExist) {
    throw new ValidationError({
      email: { message: `User with this email address already exists` },
    });
  }

  return request;
};

const afterUserCreate: After<ActionResponse> = async (
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
      throw new ValidationError({
        email: { message: "Failed to send welcome email" },
      });
    }
  }

  return response;
};

export const usersConfigOptions: ResourceOptions = {
  ...noParentNavigation,
  actions: {
    new: {
      before: [beforeUserCreate],
      after: afterUserCreate,
    },
    list: {
      before: [statusFilterBeforeAction],
    },
  },
  editProperties: ["first_name", "last_name", "email", "role", "archived"],
  filterProperties: ["first_name", "last_name", "email", "status", "role"],
  listProperties: ["first_name", "last_name", "email", "role", "status"],
  showProperties: [
    "first_name",
    "last_name",
    "email",
    "role",
    "created_at",
    "updated_at",
    "status",
  ],
  properties: {
    archived: {
      isRequired: false,
    },
    email: {
      isRequired: false,
    },
    first_name: {
      isRequired: false,
    },
    last_name: {
      isRequired: false,
    },
    role: {
      availableValues: [...adminLikeRoles, ...nonAdminRoles],
    },
    status: {
      type: "boolean",
      components: {
        list: Components.StatusListValue,
        show: Components.ArchiveShow,
        filter: Components.FilterSelect,
      },
      props: {
        availableValues: [...statusOptions],
      },
    },
  },
};
