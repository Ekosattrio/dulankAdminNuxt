// Mock data untuk halaman /permissions (dipindah dari app/pages/permissions.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const modules = [
  { name: "Inventory", create: true, edit: true, delete: false, view: true },
  { name: "Expense", create: true, edit: true, delete: false, view: true },
  { name: "Product", create: true, edit: true, delete: true, view: true },
  { name: "Category", create: true, edit: true, delete: false, view: true },
  { name: "Sub Category", create: true, edit: true, delete: false, view: true },
  { name: "Unit", create: true, edit: true, delete: false, view: true },
  { name: "Sales", create: true, edit: true, delete: false, view: true },
  { name: "Purchases", create: true, edit: true, delete: false, view: true },
  { name: "Payment", create: true, edit: true, delete: false, view: true },
  { name: "Orders", create: true, edit: true, delete: false, view: true },
  { name: "Reports", create: false, edit: false, delete: false, view: true },
  { name: "User Management", create: true, edit: true, delete: true, view: true },
]
