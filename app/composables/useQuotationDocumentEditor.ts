import type { Quotation, QuotationDocument } from '#server/types/quotation'
export function useQuotationDocumentEditor(editing = false) {
  const route = useRoute()
  const { quotations, pending, error, saveQuotation } = useQuotations()
  const record = computed(() =>
    quotations.value.find((q) => q.id === route.query.id || q.noQuotation === route.query.no),
  )
  const blank = (): QuotationDocument => ({
    contact: { name: '', email: '', phone: '', address: '' },
    shipping: { method: 'Shipping', recipient: '', phone: '', address: '', pickup: '' },
    date: new Date().toISOString().slice(0, 10),
    currency: 'IDR',
    top: '30 Days',
    att: '',
    items: [],
    terms: ['Harga Sudah Termasuk PPN', 'Penawaran Ini Berlaku 30 Hari'],
    shippingCost: 0,
    taxRate: 11,
    pricesIncludeTax: false,
    signature: '',
    position: '',
  })
  const form = ref<QuotationDocument>(blank())
  watch(
    record,
    (item) => {
      if (!editing || !item) return
      form.value = item.document
        ? JSON.parse(JSON.stringify(item.document))
        : {
            ...blank(),
            date: /^\d{4}-/.test(item.date) ? item.date : item.date.split('/').reverse().join('-'),
            contact: { name: item.customer, email: item.email, phone: '', address: '' },
            legacyTotal: item.total,
          }
    },
    { immediate: true },
  )
  const number = computed(() => (editing ? record.value?.noQuotation || '' : ''))
  const busy = ref(false)
  const actionError = ref('')
  const loadError = computed(() =>
    error.value
      ? 'Unable to load quotations.'
      : editing && !pending.value && !record.value
        ? 'Quotation not found.'
        : '',
  )
  const subTotal = computed(() =>
    form.value.items.reduce((sum, item) => sum + item.order * item.unitPrice, 0),
  )
  const tax = computed(() =>
    Math.round(
      ((subTotal.value + Number(form.value.shippingCost || 0)) * form.value.taxRate) /
        (form.value.pricesIncludeTax ? 100 + form.value.taxRate : 100),
    ),
  )
  const total = computed(() =>
    form.value.legacyTotal !== undefined && !form.value.items.length
      ? form.value.legacyTotal
      : subTotal.value + Number(form.value.shippingCost || 0) + (form.value.pricesIncludeTax ? 0 : tax.value),
  )
  async function submit() {
    if (busy.value || loadError.value) return
    actionError.value = ''
    if (!form.value.items.length && form.value.legacyTotal === undefined) {
      actionError.value = 'Add at least one product.'
      return
    }
    busy.value = true
    try {
      const due = new Date(form.value.date + 'T12:00:00')
      due.setDate(due.getDate() + (Number.parseInt(form.value.top) || 0))
      await saveQuotation({
        id: editing ? record.value?.id : undefined,
        customer: form.value.contact.name,
        email: form.value.contact.email,
        status: record.value?.status || 'Send',
        channel: record.value?.channel || 'Sales Staff',
        total: total.value,
        dueDate: due.toLocaleDateString('en-GB'),
        document: form.value,
      })
      await navigateTo('/quotation')
    } catch (e) {
      actionError.value = salesErrorMessage(e)
    } finally {
      busy.value = false
    }
  }
  return { form, number, pending, loadError, busy, actionError, subTotal, tax, total, submit }
}
