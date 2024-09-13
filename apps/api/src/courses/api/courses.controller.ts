import { Controller, Get, Query } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import { paginatedResponse, PaginatedResponse } from "src/common";
import { CoursesService } from "../courses.service";
import { AllCoursesResponse, allCoursesSchema } from "../schemas/course.schema";
import {
  CoursesFilterSchema,
  SortCourseFieldsOptions,
  sortCourseFieldsOptions,
} from "../schemas/courseQuery";
import { CurrentUser } from "src/common/decorators/user.decorator";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Validate({
    response: paginatedResponse(allCoursesSchema),
    request: [
      { type: "query", name: "title", schema: Type.String() },
      { type: "query", name: "category", schema: Type.String() },
      { type: "query", name: "author", schema: Type.String() },
      { type: "query", name: "creationDateRange[0]", schema: Type.String() },
      { type: "query", name: "creationDateRange[1]", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortCourseFieldsOptions },
    ],
  })
  async getAllCourses(
    @Query("title") title: string,
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("creationDateRange[0]") creationDateRangeStart: string,
    @Query("creationDateRange[1]") creationDateRangeEnd: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
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

    const data = await this.coursesService.getAllCourses(query);

    return new PaginatedResponse(data);
  }

  @Get("get-student-courses")
  @Validate({
    response: paginatedResponse(allCoursesSchema),
    request: [
      { type: "query", name: "title", schema: Type.String() },
      { type: "query", name: "category", schema: Type.String() },
      { type: "query", name: "author", schema: Type.String() },
      { type: "query", name: "creationDateRange[0]", schema: Type.String() },
      { type: "query", name: "creationDateRange[1]", schema: Type.String() },
      { type: "query", name: "page", schema: Type.Number({ minimum: 1 }) },
      { type: "query", name: "perPage", schema: Type.Number() },
      { type: "query", name: "sort", schema: sortCourseFieldsOptions },
    ],
  })
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
}