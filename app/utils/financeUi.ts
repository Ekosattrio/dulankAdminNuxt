import { formatIDR } from '~/utils/currency'

export const expensePrintColumns = [
  { key: 'noExpense', label: 'No Expense' },
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Expense' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'status', label: 'Status' }
]

export const incomePrintColumns = [
  { key: 'no', label: 'No Income' },
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Income' },
  { key: 'category', label: 'Category' },
  { key: 'bankAccount', label: 'Bank Account' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'notes', label: 'Notes' }
]

export const expenseCategoryPrintColumns = [
  { key: 'categoryName', label: 'Category Name' },
  { key: 'description', label: 'Description' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' }
]

