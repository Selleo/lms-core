import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Type } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";

import { baseResponse, BaseResponse } from "src/common";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { USER_ROLES } from "src/users/schemas/user-roles";

import { QuestionsService } from "../questions.service";
import { answerQuestionSchema, AnswerQuestionSchema } from "../schema/question.schema";

@UseGuards(RolesGuard)
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post("answer")
  @Roles(USER_ROLES.student)
  @Validate({
    request: [{ type: "body", schema: answerQuestionSchema, required: true }],
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
