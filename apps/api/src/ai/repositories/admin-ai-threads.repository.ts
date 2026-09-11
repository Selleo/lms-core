import { Inject, Injectable } from "@nestjs/common";
import { MESSAGE_ROLE } from "@repo/shared";
import { and, asc, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { LocalizationService } from "src/localization/localization.service";
import { DB } from "src/storage/db/db.providers";
import {
  aiMentorJudgementBlockingErrors,
  aiMentorJudgementCriteria,
  aiMentorJudgements,
  aiMentorLessons,
  aiMentorPracticeSessions,
  aiMentorThreadMessages,
  aiMentorThreads,
  chapters,
  courses,
  lessons,
  users,
} from "src/storage/schema";

import type {
  AdminAiThreadEvaluation,
  AdminAiThreadMessage,
  AdminAiThreadQuery,
  AdminAiThreadSummary,
} from "src/ai/admin-ai-threads.schema";

@Injectable()
export class AdminAiThreadsRepository {
  constructor(
    @Inject(DB) private readonly db: DatabasePg,
    private readonly localization: LocalizationService,
  ) {}

  private summaries(query: AdminAiThreadQuery) {
    const lessonTitle = this.localization.getLocalizedSqlField(lessons.title, query.language);
    const courseTitle = this.localization.getLocalizedSqlField(courses.title, query.language);
    const opening = sql<
      string | null
    >`(select left(${aiMentorThreadMessages.content}, 160) from ${aiMentorThreadMessages}
      where ${aiMentorThreadMessages.threadId} = ${aiMentorThreads.id}
      and ${aiMentorThreadMessages.role} in (${MESSAGE_ROLE.USER}, ${MESSAGE_ROLE.MENTOR})
      order by ${aiMentorThreadMessages.createdAt}, ${aiMentorThreadMessages.id} limit 1)`;
    return this.db
      .select({
        id: aiMentorThreads.id,
        type: sql<
          AdminAiThreadSummary["type"]
        >`case when ${aiMentorThreads.practiceSessionId} is not null then 'practice' else 'ai-mentor' end`.as(
          "source_type",
        ),
        practiceSessionId: aiMentorThreads.practiceSessionId,
        aiMentorLessonId: aiMentorThreads.aiMentorLessonId,
        lessonId: aiMentorLessons.lessonId,
        courseId: chapters.courseId,
        courseTitle: sql<
          string | null
        >`case when ${courses.id} is not null then ${courseTitle} else null end`.as("course_title"),
        title:
          sql<string>`coalesce(nullif(${aiMentorPracticeSessions.title}, ''), nullif(${lessonTitle}, ''), ${opening}, '')`.as(
            "resolved_title",
          ),
        openingPreview: opening.as("opening_preview"),
        owner: {
          id: sql<string>`${users.id}`.as("owner_id"),
          firstName: users.firstName,
          lastName: users.lastName,
          avatarReference: users.avatarReference,
        },
        status: sql<AdminAiThreadSummary["status"]>`${aiMentorThreads.status}`.as("thread_status"),
        language: aiMentorThreads.userLanguage,
        createdAt: aiMentorThreads.createdAt,
        lastActivityAt:
          sql<string>`coalesce((select max(${aiMentorThreadMessages.createdAt}) from ${aiMentorThreadMessages}
        where ${aiMentorThreadMessages.threadId} = ${aiMentorThreads.id}
        and ${aiMentorThreadMessages.role} in (${MESSAGE_ROLE.USER}, ${MESSAGE_ROLE.MENTOR})), ${aiMentorThreads.createdAt})`.as(
            "last_activity_at",
          ),
      })
      .from(aiMentorThreads)
      .innerJoin(users, eq(users.id, aiMentorThreads.userId))
      .leftJoin(
        aiMentorPracticeSessions,
        eq(aiMentorPracticeSessions.id, aiMentorThreads.practiceSessionId),
      )
      .leftJoin(aiMentorLessons, eq(aiMentorLessons.id, aiMentorThreads.aiMentorLessonId))
      .leftJoin(lessons, eq(lessons.id, aiMentorLessons.lessonId))
      .leftJoin(chapters, eq(chapters.id, lessons.chapterId))
      .leftJoin(courses, eq(courses.id, chapters.courseId));
  }

  async list(query: AdminAiThreadQuery) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const threads = this.summaries(query).as("admin_threads");
    const conditions = and(
      query.userId ? eq(threads.owner.id, query.userId) : undefined,
      query.type ? eq(threads.type, query.type) : undefined,
      query.status ? eq(threads.status, query.status) : undefined,
      query.search
        ? sql`${threads.title} ilike ${`%${query.search.replace(/[\\%_]/g, "\\$&")}%`}`
        : undefined,
      query.from ? gte(threads.createdAt, query.from) : undefined,
      query.to ? lt(threads.createdAt, query.to) : undefined,
    );
    const [data, totals] = await Promise.all([
      this.db
        .select()
        .from(threads)
        .where(conditions)
        .orderBy(desc(threads.lastActivityAt), desc(threads.id))
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db.select({ total: count() }).from(threads).where(conditions),
    ]);
    return { data, pagination: { page, perPage, totalItems: totals[0].total } };
  }

  async find(id: string, query: AdminAiThreadQuery = {}) {
    const [thread] = await this.summaries(query).where(eq(aiMentorThreads.id, id)).limit(1);
    return thread;
  }

  async messages(id: string, page = 1, perPage = 100) {
    const condition = and(
      eq(aiMentorThreadMessages.threadId, id),
      inArray(aiMentorThreadMessages.role, [MESSAGE_ROLE.USER, MESSAGE_ROLE.MENTOR]),
    );
    const [data, totals] = await Promise.all([
      this.db
        .select({
          id: aiMentorThreadMessages.id,
          role: sql<AdminAiThreadMessage["role"]>`${aiMentorThreadMessages.role}`,
          content: aiMentorThreadMessages.content,
          createdAt: aiMentorThreadMessages.createdAt,
        })
        .from(aiMentorThreadMessages)
        .where(condition)
        .orderBy(asc(aiMentorThreadMessages.createdAt), asc(aiMentorThreadMessages.id))
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db.select({ total: count() }).from(aiMentorThreadMessages).where(condition),
    ]);
    return { data, pagination: { page, perPage, totalItems: totals[0].total } };
  }

  async evaluation(threadId: string): Promise<AdminAiThreadEvaluation | null> {
    const [judgement] = await this.db
      .select()
      .from(aiMentorJudgements)
      .where(eq(aiMentorJudgements.threadId, threadId))
      .limit(1);
    if (!judgement) return null;
    const [criteria, blockingErrors] = await Promise.all([
      this.db
        .select({
          criterionId: aiMentorJudgementCriteria.criterionId,
          title: aiMentorJudgementCriteria.criterionTitle,
          awardedScore: aiMentorJudgementCriteria.awardedPoints,
          maxScore: aiMentorJudgementCriteria.maxScoreAtJudgement,
          status: aiMentorJudgementCriteria.status,
          learnerSafeFeedback: sql<string>`coalesce(${aiMentorJudgementCriteria.learnerSafeFeedback}, '')`,
        })
        .from(aiMentorJudgementCriteria)
        .where(eq(aiMentorJudgementCriteria.judgementId, judgement.id))
        .orderBy(asc(aiMentorJudgementCriteria.createdAt), asc(aiMentorJudgementCriteria.id)),
      this.db
        .select({
          blockingErrorId: aiMentorJudgementBlockingErrors.blockingErrorId,
          description: aiMentorJudgementBlockingErrors.blockingErrorDescription,
          learnerSafeFeedback: aiMentorJudgementBlockingErrors.learnerSafeFeedback,
        })
        .from(aiMentorJudgementBlockingErrors)
        .where(eq(aiMentorJudgementBlockingErrors.judgementId, judgement.id))
        .orderBy(
          asc(aiMentorJudgementBlockingErrors.createdAt),
          asc(aiMentorJudgementBlockingErrors.id),
        ),
    ]);
    return {
      passed: judgement.passed,
      score: judgement.earnedPoints,
      maxScore: judgement.maxScore,
      percentage: judgement.percentage,
      criteria,
      blockingErrors,
    };
  }
}
