import { Module } from "@nestjs/common";
import { UsersController } from "./api/users.controller";
import { UsersService } from "./users.service";
import { EmailModule } from "src/common/emails/emails.module";

@Module({
  imports: [EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
