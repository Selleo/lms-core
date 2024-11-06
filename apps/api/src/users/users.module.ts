import { Module } from "@nestjs/common";
import { EmailModule } from "src/common/emails/emails.module";

import { UsersController } from "./api/users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
