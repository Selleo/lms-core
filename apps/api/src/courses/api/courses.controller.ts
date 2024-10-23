import {
  Body,
  Controller,
  Delete,
  Get,
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
} from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { CoursesService } from "../courses.service";
import { type AllCoursesResponse } from "../schemas/course.schema";
import {
  type CoursesFilterSchema,
  type SortCourseFieldsOptions,
} from "../schemas/courseQuery";
import {
  CreateCourseBody,
  createCourseSchema,
} from "../schemas/createCourse.schema";
import {
  type CommonShowCourse,
  commonShowCourseSchema,
} from "../schemas/showCourseCommon.schema";
import { allCoursesValidation } from "./validations";
import {
  UpdateCourseBody,
  updateCourseSchema,
} from "../schemas/updateCourse.schema";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("courses")
@UseGuards(RolesGuard)
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

    const data = await this.coursesService.getAllCourses(query);

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

  @Get("course-by-id")
  @Roles("tutor", "admin")
  @Validate({
    request: [
      { type: "query", name: "id", schema: UUIDSchema, required: true },
    ],
    response: baseResponse(commonShowCourseSchema),
  })
  async getCourseById(
    @Query("id") id: string,
  ): Promise<BaseResponse<CommonShowCourse>> {
    return new BaseResponse(await this.coursesService.getCourseById(id));
  }

  @Post()
  @Validate({
    request: [{ type: "body", schema: createCourseSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async createCourse(
    @Body() createCourseBody: CreateCourseBody,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.coursesService.createCourse(createCourseBody, currentUserId);
    return new BaseResponse({ message: "Course enrolled successfully" });
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  @Roles("tutor", "admin")
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
  ): Promise<BaseResponse<{ message: string }>> {
    await this.coursesService.updateCourse(id, updateCourseBody, image);

    return new BaseResponse({ message: "Course updated successfully" });
  }

  @Post("enroll-course")
  @Validate({
    request: [{ type: "query", name: "id", schema: UUIDSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async enrollCourse(
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
  async unenrollCourse(
    @Query("id") id: string,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    await this.coursesService.unenrollCourse(id, currentUser.userId);

    return null;
  }
}
