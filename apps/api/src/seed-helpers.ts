import { sql } from "drizzle-orm/sql";


// import { LESSON_ITEM_TYPE } from "./lessons/lesson.type";
// import { QUESTION_TYPE } from "./questions/schema/questions.types";

import type { DatabasePg } from "./common";
// import type { NiceCourseData } from "./utils/types/test-types";

// export async function createNiceCourses(
//   adminUserId: string,
//   db: DatabasePg,
//   data: NiceCourseData[],
// ) {
//   for (const courseData of data) {
//     const [category] = await db
//       .insert(categories)
//       .values({
//         id: crypto.randomUUID(),
//         title: courseData.category,
//         archived: false,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       })
//       .returning();

//     const [course] = await db
//       .insert(courses)
//       .values({
//         id: crypto.randomUUID(),
//         title: courseData.title,
//         description: courseData.description,
//         imageUrl: courseData.imageUrl,
//         state: courseData.state,
//         priceInCents: courseData.priceInCents,
//         authorId: adminUserId,
//         categoryId: category.id,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       })
//       .returning();

//     for (const lessonData of courseData.lessons) {
//       const [lesson] = await db
//         .insert(lessons)
//         .values({
//           id: crypto.randomUUID(),
//           title: lessonData.title,
//           type: lessonData.type,
//           description: lessonData.description,
//           imageUrl: faker.image.urlPicsumPhotos(),
//           authorId: adminUserId,
//           state: lessonData.state,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           itemsCount: lessonData.items.filter(
//             (item) => item.itemType !== LESSON_ITEM_TYPE.text_block.key,
//           ).length,
//         })
//         .returning();

//       await db.insert(courseLessons).values({
//         id: crypto.randomUUID(),
//         courseId: course.id,
//         lessonId: lesson.id,
//         isFree: lessonData.isFree,
//       });

//       for (const [index, item] of lessonData.items.entries()) {
//         if (item.itemType === LESSON_ITEM_TYPE.text_block.key) {
//           const [additionalTextBlock] = await db
//             .insert(textBlocks)
//             .values({
//               id: crypto.randomUUID(),
//               title: item.title,
//               body: item.body,
//               archived: false,
//               state: item.state,
//               authorId: adminUserId,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             })
//             .returning();

//           await db.insert(lessonItems).values({
//             id: crypto.randomUUID(),
//             lessonId: lesson.id,
//             lessonItemId: additionalTextBlock.id,
//             lessonItemType: LESSON_ITEM_TYPE.text_block.key,
//             displayOrder: index + 2,
//           });
//         } else if (item.itemType === LESSON_ITEM_TYPE.file.key) {
//           const [file] = await db
//             .insert(files)
//             .values({
//               id: crypto.randomUUID(),
//               title: item.title,
//               type: item.type,
//               url: item.url,
//               state: item.state,
//               authorId: adminUserId,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             })
//             .returning();

//           await db.insert(lessonItems).values({
//             id: crypto.randomUUID(),
//             lessonId: lesson.id,
//             lessonItemId: file.id,
//             lessonItemType: LESSON_ITEM_TYPE.file.key,
//             displayOrder: index + 2,
//           });
//         } else if (item.itemType === LESSON_ITEM_TYPE.question.key) {
//           const [questionExists] = await db
//             .select()
//             .from(questions)
//             .where(eq(questions.questionBody, item.questionBody));

//           if (questionExists) {
//             await db.insert(lessonItems).values({
//               id: crypto.randomUUID(),
//               lessonId: lesson.id,
//               lessonItemId: questionExists.id,
//               lessonItemType: LESSON_ITEM_TYPE.question.key,
//               displayOrder: index + 2,
//             });

//             continue;
//           }

//           const questionId = crypto.randomUUID();

//           const [question] = await db
//             .insert(questions)
//             .values({
//               id: questionId,
//               questionType: item.questionType,
//               questionBody: item.questionBody,
//               solutionExplanation:
//                 item.questionType === QUESTION_TYPE.fill_in_the_blanks_text.key ||
//                 item.questionType === QUESTION_TYPE.fill_in_the_blanks_dnd.key
//                   ? item.solutionExplanation || "Explanation will be provided after answering."
//                   : null,
//               state: item.state,
//               authorId: adminUserId,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             })
//             .returning();

//           if (item.questionAnswers) {
//             for (let index = 0; index < item.questionAnswers.length; index++) {
//               await db.insert(questionAnswerOptions).values({
//                 id: crypto.randomUUID(),
//                 createdAt: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 questionId,
//                 optionText: item.questionAnswers[index].optionText,
//                 isCorrect: item.questionAnswers[index].isCorrect || false,
//                 position: item.questionAnswers[index].position,
//               });
//             }
//           }

//           await db.insert(lessonItems).values({
//             id: crypto.randomUUID(),
//             lessonId: lesson.id,
//             lessonItemId: question.id,
//             lessonItemType: LESSON_ITEM_TYPE.question.key,
//             displayOrder: index + 2,
//           });
//         }
//       }
//     }
//   }
// }

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
