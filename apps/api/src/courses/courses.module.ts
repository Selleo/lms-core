import { CoursesController } from "./api/courses.controller";
import { CoursesService } from "./courses.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [],
})
export class CoursesModule {}
