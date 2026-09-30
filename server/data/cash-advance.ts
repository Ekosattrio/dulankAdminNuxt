// Mock data untuk halaman /cash-advance (dipindah dari app/pages/cash-advance.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const cashAdvances = [
  {
    id: 'CA001',
    employee: 'Maman Suherman',
    date: '2025-08-28',
    tenorTotal: 5,
    tenorRemain: 2,
    totalCash: 550000,
    period: 'Weekly',
    note: 'Cicilan BMW',
    status: 'On',
    history: [
      { date: '25/02/2026', amount: 500000, installment: 50000, period: 'Weekly', tenor: '10/8', note: 'Cicilan BMW', status: 'On' },
      { date: '25/02/2026', amount: 100000, installment: 50000, period: 'Weekly', tenor: '2/2', note: 'Berobat', status: 'Close' },
      { date: '25/02/2026', amount: 1000000, installment: 50000, period: 'Monthly', tenor: '20/19', note: 'Jalan-jalan', status: 'On' }
    ],
    payments: [
      { date: '25/02/2026', payment: 50000 },
      { date: '25/02/2026', payment: 50000 },
      { date: '25/02/2026', payment: 50000 }
    ]
  },
  {
    id: 'CA002',
    employee: 'Indra Subagja',
    date: '2025-09-02',
    tenorTotal: 4,
    tenorRemain: 1,
    totalCash: 300000,
    period: 'Monthly',
    note: 'Renovasi rumah',
    status: 'On',
    history: [
      { date: '02/09/2025', amount: 300000, installment: 75000, period: 'Monthly', tenor: '4/3', note: 'Renovasi rumah', status: 'On' }
    ],
    payments: [
      { date: '02/10/2025', payment: 75000 },
      { date: '02/11/2025', payment: 75000 },
      { date: '02/12/2025', payment: 75000 }
    ]
  },
  {
    id: 'CA003',
    employee: 'Saepul Ahmad',
    date: '2025-08-15',
    tenorTotal: 6,
    tenorRemain: 0,
    totalCash: 600000,
    period: 'Monthly',
    note: 'Kebutuhan keluarga',
    status: 'Close',
    history: [
      { date: '15/08/2025', amount: 600000, installment: 100000, period: 'Monthly', tenor: '6/6', note: 'Lunas', status: 'Close' }
    ],
    payments: [
      { date: '15/09/2025', payment: 100000 },
      { date: '15/10/2025', payment: 100000 },
      { date: '15/11/2025', payment: 100000 },
      { date: '15/12/2025', payment: 100000 },
      { date: '15/01/2026', payment: 100000 },
      { date: '15/02/2026', payment: 100000 }
    ]
  }
]
