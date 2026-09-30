// payroll.ts — type/interface untuk domain payroll (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface AllowanceItem {
  id: string;
  name: string;
  amount: number;
  isEditing?: boolean;
}

export interface EditPayrollLineItem {
  id: string;
  label: string;
  isEditing?: boolean;
  qty: number;
  rate: number;
  amount: number;
}

export interface IncentiveItem {
  id: string;
  code: string;
  employee: string;
  period: string;
  qtyComplete: number;
  totalAmount: number;
  status: "Paid" | "Pending";
}

export interface MyIncentiveItem {
  code: string;
  process: string;
  date: string;
  qty: number;
  amount: number;
  status: "Paid" | "Pending";
}

export interface PayrollLineItem {
  id: string
  label: string
  isEditing?: boolean
  qty: number
  rate: number
  amount: number
}

export interface PayslipItem {
  slipNo: string;
  name: string;
  period: string;
  salaryRate: number;
  dayWorked: number;
  allowance: number;
  overtime: number;
  deduction: number;
  total: number;
  status: "Paid" | "Unpaid";
  paidDate: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  name: string;
  salary: number;
  system: "Monthly" | "Daily" | "Weekly";
  allowanceTotal: number;
  overtimeRate: number;
  status: "Active" | "Disabled";
  allowances: AllowanceItem[];
}
