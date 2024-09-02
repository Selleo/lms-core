import { Before } from "adminjs";

export const statusFilterBeforeAction: Before = async (request) => {
  const { query = {} } = request;
  const newQuery = { ...query };

  if (newQuery["filters.status"]) {
    const statusFilter = newQuery["filters.status"].split(",");
    const uniqueStatusFilter = [...new Set(statusFilter)];

    if (uniqueStatusFilter.length === 2) {
      delete newQuery["filters.archived"];
    } else {
      newQuery["filters.archived"] = uniqueStatusFilter[0];
    }

    delete newQuery["filters.status"];
  } else {
    newQuery["filters.archived"] = "false";
  }

  request.query = newQuery;
  return request;
};
