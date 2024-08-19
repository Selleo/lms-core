import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { AdminGuard } from "../guards/admin.guard";

export const Admin = () =>
  applyDecorators(SetMetadata("isAdmin", true), UseGuards(AdminGuard));
