// Mock data untuk halaman /currency-settings (dipindah dari app/pages/currency-settings.vue)
// Dikonsumsi oleh server/api/currency-settings.ts

export const currencies = [
  { id: 1, name: 'Indonesian Rupiah', code: 'IDR', symbol: 'Rp', exchangeRate: 'Default', createdOn: '01 Jan 2023' },
  { id: 2, name: 'US Dollar', code: 'USD', symbol: '$', exchangeRate: '15,600', createdOn: '10 Jan 2023' },
  { id: 3, name: 'Euro', code: 'EUR', symbol: '€', exchangeRate: '16,900', createdOn: '12 Jul 2023' },
  { id: 4, name: 'Singapore Dollar', code: 'SGD', symbol: 'S$', exchangeRate: '11,700', createdOn: '14 Jul 2023' }
]
