// Mock data untuk halaman /mesin-cetak-self (dipindah dari app/pages/mesin-cetak-self.vue)
// Dikonsumsi oleh server/api/mesin-cetak-self.ts

export const machines = [
  { id: 1, type: 'Offset', name: 'Heidelberg SM52', colors: 4, maxArea: '36 x 52 cm', plateCost: 65000, minim: 240000, druck: 85, update: '25/12/2025 Admin', status: 'Active' },
  { id: 2, type: 'Digital Printing', name: 'Xerox C70 A3+', colors: 4, maxArea: '32 x 48 cm', plateCost: 0, minim: 1500, druck: 1500, update: '25/12/2025 Admin', status: 'Active' },
  { id: 3, type: 'Offset', name: 'Heidelberg SM74', colors: 4, maxArea: '52 x 74 cm', plateCost: 95000, minim: 380000, druck: 110, update: '25/12/2025 Admin', status: 'Active' },
  { id: 4, type: 'Offset', name: 'Oliver Sakurai 58', colors: 2, maxArea: '44 x 58 cm', plateCost: 55000, minim: 160000, druck: 50, update: '25/12/2025 Admin', status: 'Active' },
  { id: 5, type: 'Digital Printing', name: 'Konica Minolta AccurioPress', colors: 4, maxArea: '33 x 70 cm', plateCost: 0, minim: 2200, druck: 2200, update: '25/12/2025 Admin', status: 'Inactive' }
]
