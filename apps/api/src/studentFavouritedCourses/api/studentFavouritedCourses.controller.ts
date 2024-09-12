import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import {
  BaseResponse,
  nullResponse,
  paginatedResponse,
  PaginatedResponse,
  UUIDSchema,
} from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { StudentFavouritedCoursesService } from "../studentFavouritedCourses.service";
import {
  createFavouritedCourseSchema,
  CreateFavouritedCourseSchema,
} from "../schemas/createFavouritedCourse.schema";
import { Type } from "@sinclair/typebox";
import {
  sortCourseFieldsOptions,
  SortCourseFieldsOptions,
} from "src/courses/schemas/courseQuery";
import { allCoursesSchema, AllCoursesResponse } from "../schemas/course.schema";

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

  @Get()
  @Validate({
    response: paginatedResponse(allCoursesSchema),
    request: [
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortCourseFieldsOptions },
    ],
  })
  async getAllCategories(
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<PaginatedResponse<AllCoursesResponse>> {
    const query = { page, perPage, sort };

    const data =
      await this.studentFavouritedCoursesService.getCoursesForStudents(
        query,
        currentUser.userId,
      );

    return new PaginatedResponse(data);
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
