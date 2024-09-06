import { After, ActionResponse, ActionContext, ActionRequest } from "adminjs";

export const afterUpdateLesson: After<ActionResponse> = async (
  response,
  request: ActionRequest,
  context: ActionContext,
) => {
  const { record } = context;
  if (!record) return response;

  const lessonResource = context._admin.findResource("lessons");
  const lessonRecord = await lessonResource.findOne(record?.id());
  if (
    lessonRecord?.params.state === "published" &&
    !lessonRecord?.params.image_url
  ) {
    await lessonRecord.update({ state: "draft" });
    return {
      record: response.record,
      notice: {
        message:
          "Cannot publish a lesson without an image. The state was reverted to draft.",
        type: "error",
      },
    };
  }

  return response;
};
