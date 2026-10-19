import type { MyJob, MyJobFormData, MyJobFilterParams, MyJobStatusUpdatePayload } from "#server/types/my-job";

interface ResponseData {
  success: boolean;
  data: MyJob[];
  message?: string;
}

/**
 * Tugas saya (view pegawai) — backend Laravel `/api/v1/admin/my-jobs`.
 * Halaman bersifat pemantauan; mutasi tugas dilakukan lewat Job Order /
 * Job Branch di modul workflow.
 */
export function useMyJobs(filterParams?: Ref<MyJobFilterParams> | MyJobFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {});

  const { data, pending, error, refresh } = useApiFetch<ResponseData>("/api/v1/admin/my-jobs", {
    key: "my-jobs-list",
    query: params,
  });

  const myJobs = computed<MyJob[]>(() => data.value?.data ?? []);

  const saveMyJob = async (_payload: MyJobFormData) => {
    void _payload;

    throw new Error("Tugas dibuat lewat job order; halaman ini hanya pemantauan.");
  };

  const deleteMyJob = async (_id: string) => {
    void _id;

    throw new Error("Tugas tidak dihapus dari halaman ini; kelola lewat Job Order.");
  };

  const updateJobStatus = async (_id: string, _payload: MyJobStatusUpdatePayload) => {
    void _id;
    void _payload;

    throw new Error("Status tugas diubah lewat Job Branch/Progress, bukan di halaman ini.");
  };

  return {
    myJobs,
    pending,
    error,
    refresh,
    saveMyJob,
    deleteMyJob,
    updateJobStatus,
  };
}