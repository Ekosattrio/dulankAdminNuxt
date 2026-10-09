import type { WorkFlowFormData } from "#server/types/work-flow";
import { createWorkFlow } from "#server/utils/workFlow";

export default defineEventHandler(async (event) => {
  const body = await readBody<WorkFlowFormData>(event);
  const item = createWorkFlow(body);
  return createResponse(item, { message: "Workflow created successfully" });
});
