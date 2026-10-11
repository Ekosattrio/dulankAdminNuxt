import type { SaleFormData } from '#server/types/sale'

export function useAddSalesPage() {
  const { saveSale } = useSales()
  const busy = ref(false)
  const error = ref('')
  const message = ref('')

  async function submit(payload: SaleFormData) {
    if (busy.value) return
    busy.value = true
    error.value = ''
    message.value = ''
    try {
      await saveSale(payload)
      message.value = 'Sales order saved successfully.'
      await navigateTo('/sales')
    } catch (reason) {
      error.value = salesErrorMessage(reason)
    } finally {
      busy.value = false
    }
  }

  return { busy, error, message, submit }
}
