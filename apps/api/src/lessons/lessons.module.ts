import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./api/lessons.controller";

@Module({
  imports: [],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [],
})
export class LessonsModule {}
