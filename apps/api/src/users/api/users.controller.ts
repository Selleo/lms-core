import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  baseResponse,
  BaseResponse,
  nullResponse,
  PaginatedResponse,
  paginatedResponse,
  UUIDSchema,
  type UUIDType,
} from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { type CommonUser, commonUserSchema } from "src/common/schemas/common-user.schema";
import { type CreateUserBody, createUserSchema } from "src/users/schemas/create-user.schema";

import { type ChangePasswordBody, changePasswordSchema } from "../schemas/change-password.schema";
import { deleteUsersSchema, type DeleteUsersSchema } from "../schemas/delete-users.schema";
import { type UpdateUserBody, updateUserSchema } from "../schemas/update-user.schema";
import { USER_ROLES } from "../schemas/user-roles";
import {
  allUsersSchema,
  userDetailsSchema,
  type AllUsersResponse,
  type UserResponse,
  type UserDetails,
} from "../schemas/user.schema";
import { SortUserFieldsOptions } from "../schemas/userQuery";
import { UsersService } from "../users.service";

import type { UsersFilterSchema } from "../schemas/userQuery";
import type { Static } from "@sinclair/typebox";

@Controller("users")
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Validate({
    request: [
      { type: "query", name: "keyword", schema: Type.String() },
      { type: "query", name: "role", schema: Type.String() },
      { type: "query", name: "archived", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: Type.String() },
    ],
    response: paginatedResponse(allUsersSchema),
  })
  async getUsers(
    @Query("keyword") keyword: string,
    @Query("role") role: string,
    @Query("archived") archived: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortUserFieldsOptions,
  ): Promise<PaginatedResponse<AllUsersResponse>> {
    const filters: UsersFilterSchema = {
      keyword,
      role,
      archived: archived === "true",
    };

    const query = { filters, page, perPage, sort };

    const users = await this.usersService.getUsers(query);

    return new PaginatedResponse(users);
  }

  @Get("user")
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(commonUserSchema),
  })
  async getUserById(@Query("id") id: string): Promise<BaseResponse<UserResponse>> {
    const user = await this.usersService.getUserById(id);

    return new BaseResponse(user);
  }

  @Get("user-details")
  @Validate({
    request: [{ type: "query", name: "userId", schema: UUIDSchema, required: true }],
    response: baseResponse(userDetailsSchema),
  })
  async getUserDetails(@Query("userId") userId: string): Promise<BaseResponse<UserDetails>> {
    const userDetails = await this.usersService.getUserDetails(userId);
    return new BaseResponse(userDetails);
  }

  @Patch()
  @Validate({
    response: baseResponse(commonUserSchema),
    request: [
      { type: "query", name: "id", schema: UUIDSchema, required: true },
      { type: "body", schema: updateUserSchema },
    ],
  })
  async updateUser(
    @Query("id") id: string,
    @Body() data: UpdateUserBody,
    @CurrentUser() currentUser: { userId: CommonUser["id"] },
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    {
      if (currentUser.userId !== id) {
        throw new ForbiddenException("You can only update your own account");
      }

      const updatedUser = await this.usersService.updateUser(id, data);

      return new BaseResponse(updatedUser);
    }
  }

  @Patch("admin/user")
  @Roles(USER_ROLES.admin)
  @Validate({
    response: baseResponse(commonUserSchema),
    request: [
      { type: "query", name: "id", schema: UUIDSchema, required: true },
      { type: "body", schema: updateUserSchema },
    ],
  })
  async adminUpdateUser(
    @Query("id") id: string,
    @Body() data: UpdateUserBody,
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    {
      const updatedUser = await this.usersService.updateUser(id, data);

      return new BaseResponse(updatedUser);
    }
  }

  @Patch("change-password")
  @Validate({
    response: nullResponse(),
    request: [
      { type: "query", name: "id", schema: UUIDSchema, required: true },
      { type: "body", schema: changePasswordSchema },
    ],
  })
  async changePassword(
    @Query("id") id: string,
    @Body() data: ChangePasswordBody,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    if (currentUser.userId !== id) {
      throw new ForbiddenException("You can only update your own account");
    }
    await this.usersService.changePassword(id, data.oldPassword, data.newPassword);

    return null;
  }

  @Delete("user")
  @Validate({
    response: nullResponse(),
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
  })
  async deleteUser(
    @Query("id") id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    if (currentUser.userId !== id) {
      throw new ForbiddenException("You can only delete your own account");
    }

    await this.usersService.deleteUser(id);

    return null;
  }

  @Delete()
  @Roles(USER_ROLES.admin)
  @Validate({
    response: nullResponse(),
    request: [{ type: "body", schema: deleteUsersSchema }],
  })
  async deleteBulkUsers(@Body() data: DeleteUsersSchema): Promise<null> {
    await this.usersService.deleteBulkUsers(data.userIds);

    return null;
  }

  @Post("create")
  @Roles(USER_ROLES.admin)
  @Validate({
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
    request: [{ type: "body", schema: createUserSchema }],
  })
  async createUser(
    @Body() data: CreateUserBody,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.usersService.createUser(data);

    return new BaseResponse({
      id,
      message: "User created successfully",
    });
  }
}
