import { Body, Controller, Delete, Post, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import { BaseResponse, nullResponse, UUIDSchema } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { StudentFavouritedCoursesService } from "../studentFavouritedCourses.service";
import {
  createFavouritedCourseSchema,
  CreateFavouritedCourseSchema,
} from "../schemas/createFavouritedCourse.schema";

@Controller("studentFavouritedCourses")
export class StudentFavouritedCoursesController {
  constructor(
    private readonly studentFavouritedCoursesService: StudentFavouritedCoursesService,
  ) {}

  @Post()
  @Validate({
    request: [{ type: "body", schema: createFavouritedCourseSchema }],
  })
  async createFavouritedCourse(
    @Body() data: CreateFavouritedCourseSchema,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.studentFavouritedCoursesService.createFavouritedCourseForUser(
      data.courseId,
      currentUser.userId,
    );

    return new BaseResponse({
      message: "Favourite course created successfully",
    });
  }

  @Delete()
  @Validate({
    response: nullResponse(),
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
  })
  async deleteFavouritedCourseForUser(
    @Query("id") id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    console.log(id, currentUser.userId);

    await this.studentFavouritedCoursesService.deleteFavouritedCourseForUser(
      id,
      currentUser.userId,
    );

    return null;
  }
}
