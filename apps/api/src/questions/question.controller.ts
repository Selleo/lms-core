import { Controller, UseGuards } from "@nestjs/common";

import { RolesGuard } from "src/common/guards/roles.guard";

import { QuestionService } from "./question.service";

@UseGuards(RolesGuard)
@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // TODO: repair this
  // @Post("answer")
  // @Roles(USER_ROLES.student)
  // @Validate({
  //   request: [{ type: "body", schema: answerQuestionSchema, required: true }],
  //   response: baseResponse(Type.Object({ message: Type.String() })),
  // })
  // async answerQuestion(
  //   @Body() answerQuestion: AnswerQuestionSchema,
  //   @CurrentUser("userId") currentUserId: string,
  // ): Promise<BaseResponse<{ message: string }>> {
  //   await this.questionService.questionAnswer(answerQuestion, currentUserId);
  //   return new BaseResponse({ message: "Answer submitted successfully" });
  // }
}
