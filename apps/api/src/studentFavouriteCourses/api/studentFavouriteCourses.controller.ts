import { Body, Controller, Delete, Post, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import { BaseResponse, nullResponse, UUIDSchema } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { StudentFavouriteCoursesService } from "../studentFavouriteCourses.service";
import {
  createFavouriteCourseSchema,
  CreateFavouriteCourseSchema,
} from "../schemas/createFavouriteCourse.schema";

@Controller("studentFavouriteCourses")
export class StudentFavouriteCoursesController {
  constructor(
    private readonly studentFavouriteCoursesService: StudentFavouriteCoursesService,
  ) {}

  @Post()
  @Validate({
    request: [{ type: "body", schema: createFavouriteCourseSchema }],
  })
  async createFavouriteCourse(
    @Body() data: CreateFavouriteCourseSchema,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.studentFavouriteCoursesService.createFavouriteCourseForUser(
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
  async deleteFavouriteCourseForUser(
    @Query("id") id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    console.log(id, currentUser.userId);

    await this.studentFavouriteCoursesService.deleteFavouriteCourseForUser(
      id,
      currentUser.userId,
    );

    return null;
  }
}
