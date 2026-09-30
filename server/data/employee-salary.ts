// Mock data untuk halaman /employee-salary (dipindah dari app/pages/employee-salary.vue)
// Dilayani generic CRUD: server/api/[...mock].ts (catch-all)

export const records = [
  {
    id: "1",
    employeeId: "ST001",
    name: "Budi Setiadi",
    salary: 4500000,
    system: "Monthly",
    allowanceTotal: 500000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [
      { id: "1", name: "Present Allowance", amount: 300000 },
      { id: "2", name: "Pengiriman", amount: 200000 },
    ],
  },
  {
    id: "2",
    employeeId: "ST002",
    name: "Siti Nurhaliza",
    salary: 4200000,
    system: "Monthly",
    allowanceTotal: 300000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [{ id: "1", name: "Present Allowance", amount: 300000 }],
  },
  {
    id: "3",
    employeeId: "ST003",
    name: "Agus Rahardjo",
    salary: 4000000,
    system: "Monthly",
    allowanceTotal: 400000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [
      { id: "1", name: "Present Allowance", amount: 250000 },
      { id: "2", name: "Transport", amount: 150000 },
    ],
  },
  {
    id: "4",
    employeeId: "ST004",
    name: "Rina Permata",
    salary: 3800000,
    system: "Monthly",
    allowanceTotal: 700000,
    overtimeRate: 15000,
    status: "Active",
    allowances: [
      { id: "1", name: "Present Allowance", amount: 300000 },
      { id: "2", name: "Bonus Sales", amount: 400000 },
    ],
  },
]
