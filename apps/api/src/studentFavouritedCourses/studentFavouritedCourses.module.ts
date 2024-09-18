import { Module } from "@nestjs/common";

import { StudentFavouritedCoursesService } from "./studentFavouritedCourses.service";
import { StudentFavouritedCoursesController } from "./api/studentFavouritedCourses.controller";

@Module({
  imports: [],
  controllers: [StudentFavouritedCoursesController],
  providers: [StudentFavouritedCoursesService],
  exports: [],
})
export class StudentFavouritedCoursesModule {}
