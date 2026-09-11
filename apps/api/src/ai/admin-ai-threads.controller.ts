import { Controller, Get, Param, Query } from "@nestjs/common";
import { PERMISSIONS, SUPPORTED_LANGUAGES, type SupportedLanguages } from "@repo/shared";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import {
  adminAiThreadDetailSchema,
  adminAiThreadMessageSchema,
  adminAiThreadPaginationSchema,
  adminAiThreadQuerySchema,
  adminAiThreadSummarySchema,
  type AdminAiThreadDetail,
  type AdminAiThreadMessage,
  type AdminAiThreadQuery,
  type AdminAiThreadSummary,
} from "src/ai/admin-ai-threads.schema";
import { AdminAiThreadsService } from "src/ai/services/admin-ai-threads.service";
import {
  BaseResponse,
  baseResponse,
  PaginatedResponse,
  paginatedResponse,
  UUIDSchema,
} from "src/common";
import { RequirePermission } from "src/common/decorators/require-permission.decorator";

@Controller("admin/ai-threads")
export class AdminAiThreadsController {
  constructor(private readonly service: AdminAiThreadsService) {}

  @Get()
  @RequirePermission(PERMISSIONS.AI_THREAD_READ)
  @Validate({
    request: Object.entries(adminAiThreadQuerySchema.properties).map(([name, schema]) => ({
      type: "query" as const,
      name,
      schema,
    })),
    response: paginatedResponse(Type.Array(adminAiThreadSummarySchema)),
  })
  async getAdminAiThreads(
    @Query("page") page?: number,
    @Query("perPage") perPage?: number,
    @Query("userId") userId?: string,
    @Query("type") type?: AdminAiThreadQuery["type"],
    @Query("status") status?: AdminAiThreadQuery["status"],
    @Query("search") search?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("language") language?: SupportedLanguages,
  ): Promise<PaginatedResponse<AdminAiThreadSummary[]>> {
    return new PaginatedResponse(
      await this.service.list({ page, perPage, userId, type, status, search, from, to, language }),
    );
  }

  @Get(":threadId")
  @RequirePermission(PERMISSIONS.AI_THREAD_READ)
  @Validate({
    request: [
      { type: "param", name: "threadId", schema: UUIDSchema },
      { type: "query", name: "language", schema: Type.Optional(Type.Enum(SUPPORTED_LANGUAGES)) },
    ],
    response: baseResponse(adminAiThreadDetailSchema),
  })
  async getAdminAiThread(
    @Param("threadId") threadId: string,
    @Query("language") language?: SupportedLanguages,
  ): Promise<BaseResponse<AdminAiThreadDetail>> {
    return new BaseResponse(await this.service.get(threadId, { language }));
  }

  @Get(":threadId/messages")
  @RequirePermission(PERMISSIONS.AI_THREAD_READ)
  @Validate({
    request: [
      { type: "param", name: "threadId", schema: UUIDSchema },
      ...Object.entries(adminAiThreadPaginationSchema.properties).map(([name, schema]) => ({
        type: "query" as const,
        name,
        schema,
      })),
    ],
    response: paginatedResponse(Type.Array(adminAiThreadMessageSchema)),
  })
  async getAdminAiThreadMessages(
    @Param("threadId") threadId: string,
    @Query("page") page?: number,
    @Query("perPage") perPage?: number,
  ): Promise<PaginatedResponse<AdminAiThreadMessage[]>> {
    return new PaginatedResponse(await this.service.messages(threadId, { page, perPage }));
  }
}
