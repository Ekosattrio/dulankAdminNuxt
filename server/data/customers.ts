// Mock data untuk halaman /customers (dipindah dari app/pages/customers.vue)
// Dikonsumsi oleh server/api/customers.ts

export const customers = [
  { id: 1, customerId: 'ID000001', name: 'Aditya Pratama', email: 'aditya.pratama@gmail.com', type: 'Corporate', balance: 15000000, phone: '+6281234567890', channel: 'Website', dateJoin: '01/12/2025 9:15', lastSeen: '01/12/2025 9:15', address: 'Jl. Riau No. 12, Bandung' },
  { id: 2, customerId: 'ID000002', name: 'Siti Aminah', email: 'siti.aminah@yahoo.co.id', type: 'General', balance: 750000, phone: '+6281398765432', channel: 'Offline', dateJoin: '03/12/2025 10:30', lastSeen: '03/12/2025 10:30', address: 'Jl. Surya Kencana No. 40, Bogor' },
  { id: 3, customerId: 'ID000003', name: 'Budi Santoso', email: 'budi.santoso@outlook.com', type: 'VIP', balance: 5400000, phone: '+625211223344', channel: 'Website', dateJoin: '05/12/2025 14:45', lastSeen: '05/12/2025 14:45', address: 'Jl. Gatot Subroto Kav. 51, Jakarta' },
  { id: 4, customerId: 'ID000004', name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', type: 'Reseller', balance: 2150000, phone: '+6281155667788', channel: 'Website', dateJoin: '08/12/2025 11:20', lastSeen: '08/12/2025 11:20', address: 'Jl. Diponegoro No. 8, Cirebon' }
]
