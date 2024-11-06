import { Body, Controller, Post } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import { baseResponse, BaseResponse } from "src/common";
import { CurrentUser } from "src/common/decorators/user.decorator";

import { QuestionsService } from "../questions.service";
import { answerQuestionSchema, AnswerQuestionSchema } from "../schema/question.schema";

@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post("answer")
  @Validate({
    request: [{ type: "body", schema: answerQuestionSchema }],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async answerQuestion(
    @Body() answerQuestion: AnswerQuestionSchema,
    @CurrentUser("userId") currentUserId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    await this.questionsService.questionAnswer(answerQuestion, currentUserId);
    return new BaseResponse({ message: "Answer submitted successfully" });
  }
}
