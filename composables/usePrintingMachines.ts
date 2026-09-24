import type { PrintingMachine, PrintingMachineFormData, PrintingMachineFilterParams } from '#server/types/printing-machine'

interface ResponseData {
  success: boolean
  data: PrintingMachine[]
  message?: string
}

export function usePrintingMachines(filterParams?: Ref<PrintingMachineFilterParams> | PrintingMachineFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/printing-machines', {
    key: 'printing-machines-list',
    query: params
  })

  const printingMachines = computed<PrintingMachine[]>(() => data.value?.data ?? [])

  const savePrintingMachine = async (payload: PrintingMachineFormData) => {
    const res = await $fetch<{ success: boolean; data: PrintingMachine; message?: string }>('/api/printing-machines', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePrintingMachine = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/printing-machines/${id}`, {
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
