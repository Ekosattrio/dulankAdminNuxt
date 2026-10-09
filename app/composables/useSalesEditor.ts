import type { Sale, SaleFormData, SaleLineItem } from '#server/types/sale'
import type { SalesContact, SalesDocument } from '#server/types/sales-document'
export function useSalesEditor(props: { isOpen: boolean; isEdit: boolean; editData?: Sale | null }) {
  const doc = ref<SalesDocument>(blankDocument())
  const items = ref<SaleLineItem[]>([])
  const deliveryFee = ref(0)
  const discount = ref(0)
  const voucherMessage = ref('')
  const legacySubtotal = ref(0)
  const legacyTax = ref<number | null>(null)
  function blankDocument(): SalesDocument {
    return {
      contact: { name: '', email: '', phone: '', address: '' },
      shipping: { method: 'Shipping', recipient: '', phone: '', address: '', pickup: '' },
      po: '',
      notes: '',
      voucher: '',
      taxRate: 11,
    }
  }
  function addItem() {
    legacySubtotal.value = 0
    legacyTax.value = null
    items.value.push({
      id: crypto.randomUUID(),
      productId: '',
      code: '',
      name: '',
      category: '',
      price: 0,
      qty: 1,
      specs: '',
      jobTitle: '',
      unit: 'Ream',
    })
  }
  watch(
    () => [props.isOpen, props.editData] as const,
    ([open, record]) => {
      if (!open) return
      doc.value = record?.document ? JSON.parse(JSON.stringify(record.document)) : blankDocument()
      if (record && !record.document) {
        doc.value.contact.name = record.customer
        doc.value.shipping.method = record.delivery
      }
      items.value = JSON.parse(JSON.stringify(record?.items || []))
      legacySubtotal.value = record && !items.value.length ? record.subTotal : 0
      legacyTax.value = record ? record.tax : null
      deliveryFee.value = record?.deliveryFee ?? 0
      discount.value = record?.discount ?? 0
      voucherMessage.value = ''
      if (!record) addItem()
    },
    { immediate: true },
  )
  const subTotal = computed(() =>
    items.value.length
      ? items.value.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0)
      : legacySubtotal.value,
  )
  const tax = computed(
    () =>
      legacyTax.value ??
      Math.round(
        (Math.max(0, subTotal.value - discount.value + deliveryFee.value) * doc.value.taxRate) / 100,
      ),
  )
  const total = computed(() => subTotal.value - discount.value + deliveryFee.value + tax.value)
  function chooseCustomer(contact: SalesContact) {
    doc.value.shipping.recipient = contact.name
    doc.value.shipping.address = contact.address
    doc.value.shipping.phone = contact.phone
  }
  async function applyVoucher() {
    voucherMessage.value = ''
    try {
      const response = await apiFetch<{ data: { discount: number } }>('/api/sales/voucher', {
        method: 'POST',
        body: {
          code: doc.value.voucher,
          subtotal: subTotal.value,
          customer: doc.value.contact.name,
          saleId: props.editData?.id,
        },
      })
      discount.value = response.data.discount
      legacyTax.value = null
      voucherMessage.value = 'Voucher berhasil diterapkan'
    } catch (e) {
      voucherMessage.value = salesErrorMessage(e)
    }
  }
  function payload(): SaleFormData {
    return {
      id: props.editData?.id,
      customer: doc.value.contact.name,
      subTotal: subTotal.value,
      deliveryFee: deliveryFee.value,
      discount: discount.value,
      tax: tax.value,
      delivery: doc.value.shipping.method,
      status: props.editData?.status || 'Unpaid',
      channel: props.editData?.channel || 'Website',
      method: props.editData?.method || 'Cash',
      items: items.value,
      document: doc.value,
    }
  }
  return {
    doc,
    items,
    deliveryFee,
    discount,
    voucherMessage,
    legacySubtotal,
    legacyTax,
    subTotal,
    tax,
    total,
    addItem,
    chooseCustomer,
    applyVoucher,
    payload,
  }
}
