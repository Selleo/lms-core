import { Action, ActionContext, ActionRequest, ActionResponse } from "adminjs";

const archiveAction = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  const { currentAdmin, record, resource } = context;
  try {
    if (record) {
      if (record.params.archived) throw new Error("Record is already archived");

      await resource.update(record.id(), { archived: true });
    }
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: "Record has been archived successfully",
        type: "success",
      },
      redirectUrl: context.h.resourceUrl({
        resourceId: resource._decorated?.id() || resource.id(),
      }),
    };
  } catch (error) {
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: `There was an error archiving the record:\n\n ${error.message}`,
        type: "error",
      },
    };
  }
};

const unarchiveAction = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  const { currentAdmin, record, resource } = context;
  try {
    if (record) {
      if (!record.params.archived) throw new Error("Record is already active");

      await resource.update(record.id(), { archived: false });
    }
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: "Record has been activated successfully",
        type: "success",
      },
      redirectUrl: context.h.resourceUrl({
        resourceId: resource._decorated?.id() || resource.id(),
      }),
    };
  } catch (error) {
    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: `There was an error activating the record:\n\n ${error.message}`,
        type: "error",
      },
    };
  }
};

export const archiveActions: {
  [key: string]: Partial<Action<ActionResponse>>;
} = {
  archive: {
    actionType: "record",
    component: false,
    guard: "Do you really want to archive this record?",
    handler: archiveAction,
    icon: "Archive",
    isAccessible: true,
    isVisible: (context: ActionContext) => {
      return !context.record?.params?.archived;
    },
    variant: "danger",
  },
  unarchive: {
    actionType: "record",
    component: false,
    guard: "Do you really want to unarchive this record?",
    handler: unarchiveAction,
    icon: "Unlock",
    isAccessible: true,
    isVisible: (context: ActionContext) => {
      return context.record?.params?.archived;
    },
    variant: "success",
  },
};
