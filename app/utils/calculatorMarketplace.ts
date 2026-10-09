import type { CalculatorListingCategory } from '#server/types/calculator-marketplace'

export interface CalculatorColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}

export interface CalculatorListingPageConfig {
  title: string
  subtitle: string
  reportTitle: string
  columns: CalculatorColumn[]
}

const commonEnd: CalculatorColumn[] = [
  { key: 'updatedLabel', label: 'Update', sortable: true },
  { key: 'statusLabel', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Action', align: 'center' },
]

export const calculatorListingConfigs: Record<CalculatorListingCategory, CalculatorListingPageConfig> = {
  offset: {
    title: 'Mesin Cetak List', subtitle: 'Manage your Mesin Cetak', reportTitle: 'Mesin Cetak Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: 'Nama', sortable: true }, { key: 'priceSummary', label: 'Harga', align: 'end' }, ...commonEnd],
  },
  laminate: {
    title: 'Mesin Laminasi List', subtitle: 'Manage your Mesin Laminasi', reportTitle: 'Mesin Laminasi Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: 'Nama', sortable: true }, { key: 'minSize', label: 'Ukuran Min' }, { key: 'maxSize', label: 'Ukuran Max' }, { key: 'pricePerCm', label: 'Harga (cm)', align: 'end' }, { key: 'minimumPrice', label: 'Harga Min', align: 'end' }, ...commonEnd],
  },
  die_cutting: {
    title: 'Mesin Pond List', subtitle: 'Manage your Mesin Pond', reportTitle: 'Mesin Pond Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: 'Nama', sortable: true }, { key: 'size', label: 'Ukuran' }, { key: 'standard', label: 'Standard', align: 'end' }, { key: 'halfCut', label: 'Setengah Putus', align: 'end' }, ...commonEnd],
  },
  hot_print: {
    title: 'Mesin Poli List', subtitle: 'Manage your Mesin Poli', reportTitle: 'Mesin Poli Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: 'Nama', sortable: true }, { key: 'maxSize', label: 'Ukuran Max' }, { key: 'pricePerCm', label: 'Harga (cm)', align: 'end' }, { key: 'minimumPrice', label: 'Harga Minim', align: 'end' }, ...commonEnd.map(column => column.key === 'updatedLabel' ? { ...column, label: 'Updated' } : column)],
  },
  paper_group: {
    title: "Group Paper's List", subtitle: "Add New Paper's Group", reportTitle: "Paper's Group Report",
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: "Paper's Group", sortable: true }, { key: 'brand', label: 'Merk' }, ...commonEnd],
  },
  paper_size: {
    title: 'Ukuran Kertas List', subtitle: 'Manage your Ukuran Kertas', reportTitle: 'Ukuran Kertas Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: 'Nama', sortable: true }, { key: 'size', label: 'Ukuran' }, { key: 'unit', label: 'Satuan' }, ...commonEnd],
  },
  paper_type: {
    title: 'Jenis Kertas List', subtitle: 'Manage your Jenis Kertas', reportTitle: 'Jenis Kertas Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'paperGroup', label: 'Group Kertas' }, { key: 'brand', label: 'Merk' }, { key: 'size', label: 'Ukuran' }, { key: 'unit', label: 'Satuan' }, { key: 'grammage', label: 'Gramatur', align: 'end' }, ...commonEnd],
  },
  paper_price: {
    title: 'Harga Kertas List', subtitle: 'Manage your Harga Kertas', reportTitle: 'Harga Kertas Report',
    columns: [{ key: 'source', label: 'Sumber' }, { key: 'name', label: 'Nama Kertas' }, { key: 'paperGroup', label: 'Group Kertas' }, { key: 'brand', label: 'Merk' }, { key: 'size', label: 'Ukuran' }, { key: 'unit', label: 'Satuan' }, { key: 'grammage', label: 'Gramatur', align: 'end' }, { key: 'minimumOrderLabel', label: 'Min Order' }, { key: 'orderMultipleLabel', label: 'Order Kelipatan' }, { key: 'paperPrice', label: 'Harga Kertas', align: 'end' }, ...commonEnd],
  },
}

export function formatCalculatorDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value || ''
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`
}
