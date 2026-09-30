// Mock data untuk halaman /discount (dipindah dari app/pages/discount.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const discounts = [
  {
    id: 1,
    name: 'Weekend Deal',
    value: 70,
    type: 'Percentage',
    valueText: '70 (Percentage)',
    plan: 'Standard',
    validity: '22 May 2025 - 24 Jun 2025',
    validFrom: '22/05/2025',
    validTill: '24/06/2025',
    days: ['Sat', 'Sun'],
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Loyalty Reward',
    value: 40,
    type: 'Flat',
    valueText: '40 (Flat)',
    plan: 'Membership',
    validity: '16 Apr 2025 - 16 May 2025',
    validFrom: '16/04/2025',
    validTill: '16/05/2025',
    days: ['Mon', 'Tue', 'Thu', 'Fri'],
    products: 'Specific Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Flash Sale',
    value: 60,
    type: 'Percentage',
    valueText: '60 (Percentage)',
    plan: 'Standard',
    validity: '20 Mar 2025 - 20 Apr 2025',
    validFrom: '20/03/2025',
    validTill: '20/04/2025',
    days: ['Thu', 'Fri', 'Sat', 'Sun'],
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Super Saver',
    value: 80,
    type: 'Percentage',
    valueText: '80 (Percentage)',
    plan: 'Standard',
    validity: '15 Feb 2025 - 15 Apr 2025',
    validFrom: '15/02/2025',
    validTill: '15/04/2025',
    days: ['Mon', 'Tue', 'Wed'],
    products: 'All Products',
    used: 7,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Surprise Savings',
    value: 50,
    type: 'Flat',
    valueText: '50 (Flat)',
    plan: 'Standard',
    validity: '24 Jan 2025 - 24 Mar 2025',
    validFrom: '24/01/2025',
    validTill: '24/03/2025',
    days: ['Mon', 'Tue', 'Thu', 'Sat'],
    products: 'Specific Products',
    used: 7,
    status: 'Active'
  }
]
