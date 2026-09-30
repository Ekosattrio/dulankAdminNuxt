// Mock data untuk halaman /custom-field (dipindah dari app/pages/custom-field.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const customFields = [
  {
    id: 1,
    module: 'Expense',
    label: 'Name',
    type: 'Text',
    defaultValue: 'Name',
    required: true,
    disabled: false,
    status: 'Active'
  },
  {
    id: 2,
    module: 'Transaction',
    label: 'Comment',
    type: 'Textarea',
    defaultValue: 'Enter Comments',
    required: true,
    disabled: false,
    status: 'Active'
  }
]
