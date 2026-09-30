// Mock data untuk halaman /edit-job-order (dipindah dari app/pages/edit-job-order.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const orderProducts = [
  {
    id: 1,
    name: 'Brosur Full Color Promo',
    jobTitle: 'Brosur SMKN 1 Karawang',
    description: 'Brosur Full Color A4 (210x297 mm), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan',
    qty: '15 Rim',
    priority: 'Urgent',
    workflow: [
      { id: 101, flowName: 'Cetak Multilith', branch: 'Dulank Karawang', assignee: 'Abdul', incentive: 1500 },
      { id: 102, flowName: 'Potong Sisir', branch: 'Dulank Karawang', assignee: 'Nurdin', incentive: 500 },
      { id: 103, flowName: 'Finishing Packing', branch: 'Dulank Karawang', assignee: 'Rapli', incentive: 300 }
    ]
  },
  {
    id: 2,
    name: 'Yasin Soft Cover 192 HVS',
    jobTitle: '40 Hari Alm Kusnadi',
    description: 'Buku Yasin 192 Halaman HVS, Cover Art Carton 260gr Doff + Poly Emas',
    qty: '200 Pcs',
    priority: 'High',
    workflow: [
      { id: 201, flowName: 'Cetak Isi Digital', branch: 'Dulank Jakarta', assignee: 'Dani', incentive: 2000 },
      { id: 202, flowName: 'Hot Print Foil Cover', branch: 'Dulank Jakarta', assignee: 'Adul', incentive: 1000 },
      { id: 203, flowName: 'Jilid Lem Panas (Binding)', branch: 'Dulank Jakarta', assignee: 'Arif', incentive: 1500 }
    ]
  }
]
