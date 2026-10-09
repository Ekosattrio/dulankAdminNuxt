import { formatNumber } from '~/composables/useFormatters'

export const purchasePrintColumns = [
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'date', label: 'Date' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'product', label: 'Product' },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment', align: 'center' as const },
]

export const purchaseItemPrintColumns = [
  { key: 'id', label: 'ID' },
  { key: 'product', label: 'Item Name' },
  { key: 'category', label: 'Category' },
  { key: 'merk', label: 'Merk' },
  { key: 'unit', label: 'Unit', align: 'center' as const },
  { key: 'priceFormatted', label: 'Price (IDR)', align: 'right' as const },
  { key: 'created', label: 'Created' },
]

export const purchaseCategoryPrintColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Category Name' },
  { key: 'itemCount', label: 'Total Items', align: 'center' as const },
  { key: 'created', label: 'Created' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

export const purchaseReturnPrintColumns = [
  { key: 'noPR', label: 'No PR' },
  { key: 'date', label: 'Date' },
  { key: 'created', label: 'Created' },
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'statusBy', label: 'Status By' },
]

export const purchaseOrderPrintColumns = [
  { key: 'noPO', label: 'No PO' },
  { key: 'date', label: 'Date' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { key: 'status', label: 'Status' },
  { key: 'goodsStatus', label: 'Goods Status' },
]

