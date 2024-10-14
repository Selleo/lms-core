import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { Static, Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import {
  baseResponse,
  BaseResponse,
  nullResponse,
  UUIDSchema,
} from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import {
  ChangePasswordBody,
  changePasswordSchema,
} from "../schemas/change-password.schema";
import {
  UpdateUserBody,
  updateUserSchema,
} from "../schemas/update-user.schema";
import {
  AllUsersResponse,
  allUsersSchema,
  UserResponse,
} from "../schemas/user.schema";
import { UsersService } from "../users.service";
import {
  CommonUser,
  commonUserSchema,
} from "src/common/schemas/common-user.schema";
import {
  deleteUsersSchema,
  DeleteUsersSchema,
} from "../schemas/delete-users.schema";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Validate({
    response: baseResponse(allUsersSchema),
  })
  async getUsers(): Promise<BaseResponse<AllUsersResponse>> {
    const users = await this.usersService.getUsers();

    return new BaseResponse(users);
  }

  @Get(":id")
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
    response: baseResponse(commonUserSchema),
  })
  async getUserById(id: string): Promise<BaseResponse<UserResponse>> {
    const user = await this.usersService.getUserById(id);

    return new BaseResponse(user);
  }

  @Patch(":id")
  @Validate({
    response: baseResponse(commonUserSchema),
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: updateUserSchema },
    ],
  })
  async updateUser(
    id: string,
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

  @Patch("admin/:id")
  @Validate({
    response: baseResponse(commonUserSchema),
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: updateUserSchema },
    ],
  })
  async adminUpdateUser(
    id: string,
    @Body() data: UpdateUserBody,
    @CurrentUser() currentUser: { role: string },
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    {
      if (currentUser.role !== "admin") {
        throw new UnauthorizedException("You don't have permission to update");
      }

      const updatedUser = await this.usersService.updateUser(id, data);

      return new BaseResponse(updatedUser);
    }
  }

  @Patch(":id/change-password")
  @Validate({
    response: nullResponse(),
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: changePasswordSchema },
    ],
  })
  async changePassword(
    id: string,
    @Body() data: ChangePasswordBody,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    if (currentUser.userId !== id) {
      throw new ForbiddenException("You can only update your own account");
    }
    await this.usersService.changePassword(
      id,
      data.oldPassword,
      data.newPassword,
    );

    return null;
  }

  @Delete(":id")
  @Validate({
    response: nullResponse(),
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async deleteUser(
    id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    if (currentUser.userId !== id) {
      throw new ForbiddenException("You can only delete your own account");
    }

    await this.usersService.deleteUser(id);

    return null;
  }

  @Delete()
  @Validate({
    response: nullResponse(),
    request: [{ type: "body", schema: deleteUsersSchema }],
  })
  async deleteBulkUsers(
    @Body() data: DeleteUsersSchema,
    @CurrentUser() currentUser: { userId: string; role: string },
  ): Promise<null> {
    if (currentUser.role !== "admin") {
      throw new UnauthorizedException(
        "You don't have permission to delete users",
      );
    }

    await this.usersService.deleteBulkUsers(data.userIds);

    return null;
  }
}
