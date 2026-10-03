import type { WorkFlowFilterParams } from "#server/types/work-flow";
import { listWorkFlows } from "#server/utils/workFlow";

export default defineEventHandler((event) => {
  const query = getQuery<WorkFlowFilterParams>(event);
  const items = listWorkFlows(query);
  return createResponse(items, { total: items.length });
});
