import { Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import {
  baseResponse,
  BaseResponse,
  nullResponse,
  PaginatedResponse,
  UUIDSchema,
} from "src/common";
import { CoursesService } from "../courses.service";
import { type AllCoursesResponse } from "../schemas/course.schema";
import {
  type CoursesFilterSchema,
  type SortCourseFieldsOptions,
} from "../schemas/courseQuery";
import { CurrentUser } from "src/common/decorators/user.decorator";
import {
  type CommonShowCourse,
  commonShowCourseSchema,
} from "../schemas/showCourseCommon.schema";
import { Type } from "@sinclair/typebox";
import { allCoursesValidation } from "./validations";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Validate(allCoursesValidation)
  async getAllCourses(
    @Query("title") title: string,
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("creationDateRange[0]") creationDateRangeStart: string,
    @Query("creationDateRange[1]") creationDateRangeEnd: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<PaginatedResponse<AllCoursesResponse>> {
    const filters: CoursesFilterSchema = {
      title,
      category,
      author,
      creationDateRange:
        creationDateRangeStart && creationDateRangeEnd
          ? [creationDateRangeStart, creationDateRangeEnd]
          : undefined,
    };
    const query = { filters, page, perPage, sort, currentUserId };

    const data = await this.coursesService.getAllCourses(query, currentUserId);

    return new PaginatedResponse(data);
  }

  @Get("get-student-courses")
  @Validate(allCoursesValidation)
  async getStudentCourses(
    @Query("title") title: string,
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("creationDateRange[0]") creationDateRangeStart: string,
    @Query("creationDateRange[1]") creationDateRangeEnd: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<PaginatedResponse<AllCoursesResponse>> {
    const filters: CoursesFilterSchema = {
      title,
      category,
      author,
      creationDateRange:
        creationDateRangeStart && creationDateRangeEnd
          ? [creationDateRangeStart, creationDateRangeEnd]
          : undefined,
    };
    const query = { filters, page, perPage, sort };

    const data = await this.coursesService.getCoursesForUser(
      query,
      currentUserId,
    );

    return new PaginatedResponse(data);
  }

  @Get("available-courses")
  @Validate(allCoursesValidation)
  async getAvailableCourses(
    @Query("title") title: string,
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("creationDateRange[0]") creationDateRangeStart: string,
    @Query("creationDateRange[1]") creationDateRangeEnd: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<PaginatedResponse<AllCoursesResponse>> {
    const filters: CoursesFilterSchema = {
      title,
      category,
      author,
      creationDateRange:
        creationDateRangeStart && creationDateRangeEnd
          ? [creationDateRangeStart, creationDateRangeEnd]
          : undefined,
    };
    const query = { filters, page, perPage, sort };

    const data = await this.coursesService.getAvailableCourses(
      query,
      currentUserId,
    );

    return new PaginatedResponse(data);
  }

  @Get("course")
  @Validate({
    request: [
      { type: "query", name: "id", schema: UUIDSchema, required: true },
    ],
    response: baseResponse(commonShowCourseSchema),
  })
  async getCourse(
    @Query("id") id: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<CommonShowCourse>> {
    return new BaseResponse(
      await this.coursesService.getCourse(id, currentUserId),
    );
  }

  @Post("enroll-course")
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async createFavouritedCourse(
    @Query("id") id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.coursesService.enrollCourse(id, currentUser.userId);

    return new BaseResponse({ message: "Course enrolled successfully" });
  }

  @Delete("unenroll-course")
  @Validate({
    response: nullResponse(),
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
  })
  async deleteFavouritedCourseForUser(
    @Query("id") id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    await this.coursesService.unenrollCourse(id, currentUser.userId);

    return null;
  }
}
