import type { PrintingMachine, PrintingMachineFormData, PrintingMachineFilterParams } from '#server/types/printing-machine'

interface ResponseData {
  success: boolean
  data: PrintingMachine[]
  message?: string
}

export function usePrintingMachines(filterParams?: Ref<PrintingMachineFilterParams> | PrintingMachineFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/printing-machines', {
    key: 'printing-machines-list',
    query: params
  })

  const printingMachines = computed<PrintingMachine[]>(() => data.value?.data ?? [])

  const savePrintingMachine = async (payload: PrintingMachineFormData) => {
    const res = await apiFetch<{ success: boolean; data: PrintingMachine; message?: string }>('/api/v1/admin/printing-machines', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePrintingMachine = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/v1/admin/printing-machines/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    printingMachines,
    pending,
    error,
    refresh,
    savePrintingMachine,
    deletePrintingMachine
  }
}
