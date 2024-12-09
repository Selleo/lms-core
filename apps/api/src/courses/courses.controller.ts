import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  baseResponse,
  BaseResponse,
  nullResponse,
  PaginatedResponse,
  UUIDSchema,
  type UUIDType,
} from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CoursesService } from "src/courses/courses.service";
import { allCoursesSchema } from "src/courses/schemas/course.schema";
import { SortCourseFieldsOptions } from "src/courses/schemas/courseQuery";
import { CreateCourseBody, createCourseSchema } from "src/courses/schemas/createCourse.schema";
import { commonShowCourseSchema } from "src/courses/schemas/showCourseCommon.schema";
import { UpdateCourseBody, updateCourseSchema } from "src/courses/schemas/updateCourse.schema";
import { allCoursesValidation, coursesValidation } from "src/courses/validations/validations";
import { USER_ROLES, UserRole } from "src/users/schemas/user-roles";

import type {
  AllCoursesForTeacherResponse,
  AllCoursesResponse,
} from "src/courses/schemas/course.schema";
import type { CoursesFilterSchema } from "src/courses/schemas/courseQuery";
import type { CommonShowCourse } from "src/courses/schemas/showCourseCommon.schema";

@Controller("courses")
@UseGuards(RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Roles(USER_ROLES.admin, USER_ROLES.teacher)
  @Validate(allCoursesValidation)
  async getAllCourses(
    @Query("title") title: string,
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("creationDateRange[0]") creationDateRangeStart: string,
    @Query("creationDateRange[1]") creationDateRangeEnd: string,
    @Query("state") state: string,
    @Query("archived") archived: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
    @CurrentUser("userId") currentUserId: UUIDType,
    @CurrentUser("role") currentUserRole: UserRole,
  ): Promise<PaginatedResponse<AllCoursesResponse>> {
    const filters: CoursesFilterSchema = {
      title,
      category,
      author,
      state,
      archived,
      creationDateRange:
        creationDateRangeStart && creationDateRangeEnd
          ? [creationDateRangeStart, creationDateRangeEnd]
          : undefined,
    };

    const query = {
      filters,
      page,
      perPage,
      sort,
      currentUserId,
      currentUserRole,
    };

    const data = await this.coursesService.getAllCourses(query);

    return new PaginatedResponse(data);
  }

  @Get("get-student-courses")
  @Validate(coursesValidation)
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

    const data = await this.coursesService.getCoursesForUser(query, currentUserId);

    return new PaginatedResponse(data);
  }

  @Get("available-courses")
  @Validate(coursesValidation)
  async getAvailableCourses(
    @Query("title") title: string,
    @Query("category") category: string,
    @Query("author") author: string,
    @Query("creationDateRange[0]") creationDateRangeStart: string,
    @Query("creationDateRange[1]") creationDateRangeEnd: string,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
    @Query("sort") sort: SortCourseFieldsOptions,
    @CurrentUser("userId") currentUserId: UUIDType,
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

    const data = await this.coursesService.getAvailableCourses(query, currentUserId);

    return new PaginatedResponse(data);
  }

  @Get("teacher-courses")
  @Validate({
    request: [{ type: "query", name: "authorId", schema: UUIDSchema, required: true }],
    response: baseResponse(allCoursesSchema),
  })
  async getTeacherCourses(
    @Query("authorId") authorId: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<AllCoursesForTeacherResponse>> {
    return new BaseResponse(await this.coursesService.getTeacherCourses(authorId));
  }

  @Get("course")
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(commonShowCourseSchema),
  })
  async getCourse(
    @Query("id") id: string,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<CommonShowCourse>> {
    return new BaseResponse(await this.coursesService.getCourse(id, currentUserId));
  }

  @Get("course-by-id")
  @Roles(USER_ROLES.teacher, USER_ROLES.admin)
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(commonShowCourseSchema),
  })
  async getCourseById(@Query("id") id: string): Promise<BaseResponse<CommonShowCourse>> {
    return new BaseResponse(await this.coursesService.getCourseById(id));
  }

  @Get("beta-course-by-id")
  @Roles(USER_ROLES.teacher, USER_ROLES.admin)
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema, required: true }],
    response: baseResponse(commonShowCourseSchema),
  })
  async getBetaCourseById(@Query("id") id: UUIDType): Promise<BaseResponse<CommonShowCourse>> {
    return new BaseResponse(await this.coursesService.getBetaCourseById(id));
  }

  @Post()
  @Roles(USER_ROLES.admin, USER_ROLES.teacher)
  @Validate({
    request: [{ type: "body", schema: createCourseSchema }],
    response: baseResponse(Type.Object({ id: UUIDSchema, message: Type.String() })),
  })
  async createCourse(
    @Body() createCourseBody: CreateCourseBody,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ id: UUIDType; message: string }>> {
    const { id } = await this.coursesService.createCourse(createCourseBody, currentUserId);

    return new BaseResponse({ id, message: "Course created successfully" });
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  @Roles(USER_ROLES.teacher, USER_ROLES.admin)
  @Validate({
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: updateCourseSchema },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateCourse(
    @Param("id") id: string,
    @Body() updateCourseBody: UpdateCourseBody,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.coursesService.updateCourse(id, updateCourseBody, image, currentUserId);

    return new BaseResponse({ message: "Course updated successfully" });
  }

  @Post("enroll-course")
  @Roles(USER_ROLES.student)
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async enrollCourse(
    @Query("id") id: string,
    @CurrentUser("userId") currentUserId: UUIDType,
    @Headers("x-test-key") testKey: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.coursesService.enrollCourse(id, currentUserId, testKey);

    return new BaseResponse({ message: "Course enrolled successfully" });
  }

  @Delete("unenroll-course")
  @Roles(USER_ROLES.student)
  @Validate({
    response: nullResponse(),
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
  })
  async unenrollCourse(
    @Query("id") id: string,
    @CurrentUser("userId") currentUserId: UUIDType,
  ): Promise<null> {
    await this.coursesService.unenrollCourse(id, currentUserId);

    return null;
  }
}
