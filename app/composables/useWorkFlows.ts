import type { WorkFlow, WorkFlowFilterParams, WorkFlowFormData } from "#server/types/work-flow";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
}

export function useWorkFlows(filterParams?: Ref<WorkFlowFilterParams> | WorkFlowFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {});

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<WorkFlow[]>>("/api/work-flows", {
    key: "work-flows-list",
    query: params,
  });

  const workFlows = computed<WorkFlow[]>(() => data.value?.data ?? []);

  const getWorkFlow = async (id: string): Promise<WorkFlow> => {
    const res = await apiFetch<ApiResponse<WorkFlow>>(`/api/work-flows/${id}`);
    return res.data;
  };

  const saveWorkFlow = async (payload: WorkFlowFormData) => {
    let res: ApiResponse<WorkFlow>;
    if (payload.id) {
      res = await apiFetch<ApiResponse<WorkFlow>>(`/api/work-flows/${payload.id}`, {
        method: "PUT",
        body: payload,
      });
    } else {
      res = await apiFetch<ApiResponse<WorkFlow>>("/api/work-flows", {
        method: "POST",
        body: payload,
      });
    }
    await refresh();
    return res;
  };

  const deleteWorkFlow = async (id: string) => {
    const res = await apiFetch<ApiResponse<WorkFlow>>(`/api/work-flows/${id}`, {
      method: "DELETE",
    });
    await refresh();
    return res;
  };

  return {
    workFlows,
    pending,
    error,
    refresh,
    getWorkFlow,
    saveWorkFlow,
    deleteWorkFlow,
  };
}
