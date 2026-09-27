import type { RFQDocument, RFQItem } from '#server/types/request-quotation'

export function useRequestQuotationEditor(editing = false) {
  const route = useRoute()
  const router = useRouter()
  const { data, pending, error } = useFetch<{ success: boolean; data: RFQItem[] }>(
    '/api/request-quotations',
    { key: 'request-quotation-editor' },
  )
  const record = computed(() =>
    data.value?.data.find((item) => item.noRequest === route.query.no || item.id === route.query.id),
  )
  const form = ref<RFQDocument>({
    to: '',
    rfqNo: '',
    att: '',
    date: new Date().toISOString().slice(0, 10),
    telp: '',
    email: '',
    dueDate: '',
    paymentTerm: 'Cash on Delivery',
    items: [],
    requestedTo: [{ department: '', attn: '', email: '', telp: '' }],
    signature: '',
  })
  watch(
    record,
    (item) => {
      if (!editing || !item) return
      form.value = item.document
        ? JSON.parse(JSON.stringify(item.document))
        : {
            ...form.value,
            to: item.customer,
            rfqNo: item.noRequest,
            telp: item.telp,
            email: item.email,
            date: /^\d{4}-/.test(item.date) ? item.date : item.date.split('/').reverse().join('-'),
          }
      form.value.rfqNo = item.noRequest
      form.value.requestedTo ??= [{ department: '', attn: '', email: '', telp: '' }]
      form.value.signature ??= ''
    },
    { immediate: true },
  )
  const isSubmitting = ref(false)
  const actionError = ref('')
  const loadError = computed(() =>
    error.value
      ? 'Unable to load request quotations.'
      : editing && !pending.value && !record.value
        ? 'Request quotation not found.'
        : '',
  )
  async function handleSubmit() {
    if (isSubmitting.value || loadError.value) return
    if (!form.value.items.length) {
      actionError.value = 'Add at least one item.'
      return
    }
    isSubmitting.value = true
    actionError.value = ''
    try {
      await $fetch<unknown>('/api/request-quotations', {
        method: 'POST',
        body: {
          ...(editing ? record.value : {}),
          id: editing ? record.value?.id : undefined,
          customer: form.value.to,
          email: form.value.email,
          telp: form.value.telp,
          date: form.value.date,
          document: form.value,
        },
      })
      await refreshNuxtData('request-quotations-list')
      await router.push('/request-quotation')
    } catch (error) {
      actionError.value = salesErrorMessage(error)
    } finally {
      isSubmitting.value = false
    }
  }
  return { form, pending, loadError, isSubmitting, actionError, handleSubmit }
}
