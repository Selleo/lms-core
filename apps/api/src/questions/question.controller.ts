import { Body, Controller, Patch, UseGuards } from "@nestjs/common";

import { RolesGuard } from "src/common/guards/roles.guard";

import { QuestionService } from "./question.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { USER_ROLES } from "src/users/schemas/user-roles";
import { Validate } from "nestjs-typebox";
import { Type } from "@sinclair/typebox";
import { BaseResponse, baseResponse, UUIDSchema, UUIDType } from "src/common";

@UseGuards(RolesGuard)
@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Patch("question-anwser-display-order")
  @Roles(USER_ROLES.teacher, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          questionAnswerId: UUIDSchema,
          displayOrder: Type.Number(),
        }),
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateQuestionAnswerDisplayOrder(
    @Body()
    body: {
      questionAnswerId: UUIDType;
      displayOrder: number;
    },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.questionService.updateQuestionAnswerDisplayOrder(body);

    return new BaseResponse({
      message: "Question answer display order updated successfully",
    });
  }

  @Patch("question-display-order")
  @Roles(USER_ROLES.teacher, USER_ROLES.admin)
  @Validate({
    request: [
      {
        type: "body",
        schema: Type.Object({
          questionId: UUIDSchema,
          displayOrder: Type.Number(),
        }),
        required: true,
      },
    ],
    response: baseResponse(Type.Object({ message: Type.String() })),
  })
  async updateQuestionDisplayOrder(
    @Body()
    body: {
      questionId: UUIDType;
      displayOrder: number;
    },
  ): Promise<BaseResponse<{ message: string }>> {
    await this.questionService.updateQuestionDisplayOrder(body);

    return new BaseResponse({
      message: "Question answer display order updated successfully",
    });
  }

  // TODO: repair this
  // @Post("answer")
  // @Roles(USER_ROLES.STUDENT)
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
