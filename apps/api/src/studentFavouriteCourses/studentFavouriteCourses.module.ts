import { Module } from "@nestjs/common";
import { StudentFavouriteCoursesController } from "./api/studentFavouriteCourses.controller";
import { StudentFavouriteCoursesService } from "./studentFavouriteCourses.service";

@Module({
  imports: [],
  controllers: [StudentFavouriteCoursesController],
  providers: [StudentFavouriteCoursesService],
  exports: [],
})
export class StudentFavouriteCoursesModule {}
