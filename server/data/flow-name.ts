// Mock data untuk halaman /flow-name (dipindah dari app/pages/flow-name.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const flowNames = [
  { id: 1, code: 'JBP-0001', category: 'Design', name: 'Design Layout', incentive: 5000, unit: 'Per Job', assignees: 'Adul, Nurdin', flowType: 'Inhouse', createdInfo: 'Admin, 2025-10-13' },
  { id: 2, code: 'JBP-0002', category: 'Pracetak', name: 'Pre-press Setting', incentive: 8500, unit: 'Per Job', assignees: 'Adul, Nurdin, Admin', flowType: 'Inhouse', createdInfo: 'Admin, 2025-10-13' },
  { id: 3, code: 'JBP-0003', category: 'Cetak', name: 'Digital Printing', incentive: 4000, unit: 'Per Meter', assignees: 'Arif, Galih', flowType: 'Outsource', createdInfo: 'Admin, 2025-10-13' },
  { id: 4, code: 'JBP-0004', category: 'Finishing', name: 'Potong Sisir', incentive: 2000, unit: 'Per Rim', assignees: 'Rapli, Budi', flowType: 'Inhouse', createdInfo: 'Admin, 2025-10-13' }
]
