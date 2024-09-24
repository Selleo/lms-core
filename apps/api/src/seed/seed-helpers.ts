import { faker } from "@faker-js/faker";
import {
  categories,
  courseLessons,
  courses,
  files,
  lessonItems,
  lessons,
  questions,
  textBlocks,
} from "src/storage/schema";
import { DatabasePg } from "../common";
import { niceCourses } from "./nice-data-seeds";
import { sql } from "drizzle-orm/sql";

export async function createNiceCourses(adminUserId: string, db: DatabasePg) {
  for (const courseData of niceCourses) {
    const [category] = await db
      .insert(categories)
      .values({
        id: crypto.randomUUID(),
        title: courseData.category,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    const [course] = await db
      .insert(courses)
      .values({
        id: crypto.randomUUID(),
        title: courseData.title,
        description: courseData.description,
        imageUrl: courseData.imageUrl,
        state: courseData.state,
        priceInCents: courseData.priceInCents,
        authorId: adminUserId,
        categoryId: category.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    for (const lessonData of courseData.lessons) {
      const [lesson] = await db
        .insert(lessons)
        .values({
          id: crypto.randomUUID(),
          title: lessonData.title,
          description: lessonData.description,
          imageUrl: faker.image.urlPicsumPhotos(),
          authorId: adminUserId,
          state: lessonData.state,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      await db.insert(courseLessons).values({
        id: crypto.randomUUID(),
        courseId: course.id,
        lessonId: lesson.id,
      });

      const [textBlock] = await db
        .insert(textBlocks)
        .values({
          id: crypto.randomUUID(),
          title: lessonData.title,
          body: lessonData.description,
          archived: false,
          state: lessonData.state,
          authorId: adminUserId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      await db.insert(lessonItems).values({
        id: crypto.randomUUID(),
        lessonId: lesson.id,
        lessonItemId: textBlock.id,
        lessonItemType: "text_block",
        displayOrder: 1,
      });

      for (const [index, item] of lessonData.items.entries()) {
        if (item.type === "text_block") {
          const [additionalTextBlock] = await db
            .insert(textBlocks)
            .values({
              id: crypto.randomUUID(),
              title: item.title,
              body: item.body,
              archived: false,
              state: item.state,
              authorId: adminUserId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
            .returning();

          await db.insert(lessonItems).values({
            id: crypto.randomUUID(),
            lessonId: lesson.id,
            lessonItemId: additionalTextBlock.id,
            lessonItemType: "text_block",
            displayOrder: index + 2,
          });
        } else if (item.type === "file") {
          const [file] = await db
            .insert(files)
            .values({
              id: crypto.randomUUID(),
              title: item.title,
              type: item.fileType,
              url: item.url,
              state: item.state,
              authorId: adminUserId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
            .returning();

          await db.insert(lessonItems).values({
            id: crypto.randomUUID(),
            lessonId: lesson.id,
            lessonItemId: file.id,
            lessonItemType: "file",
            displayOrder: index + 2,
          });
        } else if (item.type === "question") {
          const [question] = await db
            .insert(questions)
            .values({
              id: crypto.randomUUID(),
              questionType: item.questionType,
              questionBody: item.questionBody,
              solutionExplanation:
                "Explanation will be provided after answering.",
              state: item.state,
              authorId: adminUserId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
            .returning();

          await db.insert(lessonItems).values({
            id: crypto.randomUUID(),
            lessonId: lesson.id,
            lessonItemId: question.id,
            lessonItemType: "question",
            displayOrder: index + 2,
          });
        }
      }
    }
  }
}

export async function seedTruncateAllTables(db: DatabasePg): Promise<void> {
  await db.transaction(async (tx) => {
    const result = await tx.execute(sql`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `);

    const tables = (result as unknown as Record<string, unknown>[]).map(
      (row) => row.tablename as string,
    );

    await tx.execute(sql`SET CONSTRAINTS ALL DEFERRED`);

    for (const table of tables) {
      console.log(`Truncating table ${table}`);
      await tx.execute(sql`TRUNCATE TABLE ${sql.identifier(table)} CASCADE`);
    }

    await tx.execute(sql`SET CONSTRAINTS ALL IMMEDIATE`);
  });
}
