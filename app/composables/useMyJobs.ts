import type { MyJob, MyJobFormData, MyJobFilterParams } from "#server/types/my-job";

interface ResponseData {
  success: boolean;
  data: MyJob[];
  message?: string;
}

export function useMyJobs(filterParams?: Ref<MyJobFilterParams> | MyJobFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {});

  const { data, pending, error, refresh } = useApiFetch<ResponseData>("/api/my-jobs", {
    key: "my-jobs-list",
    query: params,
  });

  const myJobs = computed<MyJob[]>(() => data.value?.data ?? []);

  const saveMyJob = async (payload: MyJobFormData) => {
    const res = await apiFetch<{ success: boolean; data: MyJob; message?: string }>("/api/my-jobs", {
      method: "POST",
      body: payload,
    });
    await refresh();
    return res;
  };

  const deleteMyJob = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/my-jobs/${id}`, {
      method: "DELETE",
    });
    await refresh();
    return res;
  };

  return {
    myJobs,
    pending,
    error,
    refresh,
    saveMyJob,
    deleteMyJob,
  };
}
