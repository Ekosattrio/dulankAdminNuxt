import type { Sale, SaleFormData, SaleLineItem } from '#server/types/sale'
import type { Product } from '#server/types/product'
import type { SalesContact, SalesDocument } from '#server/types/sales-document'
export function useSalesEditor(props: { isOpen: boolean; isEdit: boolean; editData?: Sale | null }) {
  const doc = ref<SalesDocument>(blankDocument())
  const items = ref<SaleLineItem[]>([])
  const deliveryFee = ref(0)
  const voucherDiscount = ref(0)
  const directDiscount = ref(0)
  const voucherMessage = ref('')
  const appliedVoucherCode = ref('')
  const legacySubtotal = ref(0)
  const legacyTax = ref<number | null>(null)
  function blankDocument(): SalesDocument {
    return {
      contact: { name: '', email: '', phone: '', address: '' },
      shipping: { method: 'Shipping', recipient: '', phone: '', address: '', pickup: '' },
      po: '',
      notes: '',
      voucher: '',
      taxRate: 0,
      transactionCode: '',
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
      if (record?.transactionCode && !doc.value.transactionCode)
        doc.value.transactionCode = record.transactionCode
      items.value = JSON.parse(JSON.stringify(record?.items || []))
      legacySubtotal.value = record && !items.value.length ? record.subTotal : 0
      legacyTax.value = record ? record.tax : null
      deliveryFee.value = record?.deliveryFee ?? 0
      voucherDiscount.value = record?.voucherDiscount ?? 0
      directDiscount.value =
        record?.directDiscount ??
        (record?.voucherDiscount === undefined ? record?.discount ?? 0 : 0)
      voucherMessage.value = ''
      appliedVoucherCode.value = doc.value.voucher
      if (!record) addItem()
    },
    { immediate: true },
  )
  const subTotal = computed(() =>
    items.value.length
      ? items.value.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0)
      : legacySubtotal.value,
  )
  const discount = computed(() => voucherDiscount.value + directDiscount.value)
  const totalBeforeTax = computed(() =>
    Math.max(0, subTotal.value + deliveryFee.value - discount.value),
  )
  const tax = computed(
    () =>
      legacyTax.value ??
      Math.round((totalBeforeTax.value * doc.value.taxRate) / 100),
  )
  const total = computed(() => totalBeforeTax.value + tax.value)
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
      voucherDiscount.value = response.data.discount
      appliedVoucherCode.value = doc.value.voucher.trim()
      legacyTax.value = null
      voucherMessage.value = 'Voucher berhasil diterapkan'
    } catch (e) {
      voucherMessage.value = salesErrorMessage(e)
    }
  }
  function selectProduct(item: SaleLineItem, product?: Product) {
    if (!product) return
    item.productId = product.id
    item.code = product.code
    item.name = product.name
    item.category = product.category
    item.price = Number(product.price) || 0
    item.unit = product.unit || item.unit
    item.specs = product.description || item.specs
    legacySubtotal.value = 0
    legacyTax.value = null
  }
  watch(
    () => doc.value.voucher,
    (code) => {
      if (code.trim() === appliedVoucherCode.value) return
      voucherDiscount.value = 0
      voucherMessage.value = ''
      legacyTax.value = null
    },
  )
  function payload(): SaleFormData {
    return {
      id: props.editData?.id,
      customer: doc.value.contact.name,
      subTotal: subTotal.value,
      deliveryFee: deliveryFee.value,
      voucherDiscount: voucherDiscount.value,
      directDiscount: directDiscount.value,
      discount: discount.value,
      tax: tax.value,
      transactionCode: doc.value.transactionCode,
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
    voucherDiscount,
    directDiscount,
    discount,
    voucherMessage,
    legacySubtotal,
    legacyTax,
    subTotal,
    totalBeforeTax,
    tax,
    total,
    addItem,
    chooseCustomer,
    selectProduct,
    applyVoucher,
    payload,
  }
}
