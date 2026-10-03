import { deleteWorkFlow } from "#server/utils/workFlow";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Workflow ID is required" });
  }

  const removed = deleteWorkFlow(id);
  return createResponse(removed, { message: "Workflow deleted successfully" });
});
