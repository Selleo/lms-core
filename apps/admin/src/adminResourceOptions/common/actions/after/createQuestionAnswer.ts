import { After, ActionResponse, ActionRequest } from "adminjs";

export const createQuestionAnswer: After<ActionResponse> = async (
  response,
  request: ActionRequest,
) => {
  const questionID = request?.payload?.question_id;

  return {
    ...response,
    redirectUrl: `/admin/resources/questions/records/${questionID}/show`,
  };
};
