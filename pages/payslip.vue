<script setup lang="ts">
import { formatRupiah } from "~/composables/useFormatters";

interface PayslipItem {
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

const payslips = ref<PayslipItem[]>([
  {
    slipNo: "PS000001",
    name: "Budi Setiadi",
    period: "02/02/26 - 07/02/26",
    salaryRate: 150000,
    dayWorked: 6,
    allowance: 500000,
    overtime: 150000,
    deduction: 0,
    total: 1400000,
    status: "Paid",
    paidDate: "09/02/2026",
  },
  {
    slipNo: "PS000002",
    name: "Siti Nurhaliza",
    period: "02/02/26 - 07/02/26",
    salaryRate: 4200000,
    dayWorked: 6,
    allowance: 300000,
    overtime: 0,
    deduction: 0,
    total: 1125000,
    status: "Paid",
    paidDate: "09/02/2026",
  },
  {
    slipNo: "PS000003",
    name: "Agus Rahardjo",
    period: "02/02/26 - 07/02/26",
    salaryRate: 4000000,
    dayWorked: 6,
    allowance: 400000,
    overtime: 75000,
    deduction: 50000,
    total: 1125000,
    status: "Paid",
    paidDate: "09/02/2026",
  },
  {
    slipNo: "PS000004",
    name: "Rina Permata",
    period: "02/02/26 - 07/02/26",
    salaryRate: 3800000,
    dayWorked: 6,
    allowance: 700000,
    overtime: 100000,
    deduction: 0,
    total: 1225000,
    status: "Paid",
    paidDate: "09/02/2026",
  },
]);

const searchQuery = ref("");
const selectedStatus = ref("");

const filteredPayslips = computed(() => {
  return payslips.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.slipNo.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !selectedStatus.value || p.status === selectedStatus.value;
    return matchSearch && matchStatus;
  });
});

const columns = [
  { key: "slipNo", label: "No. Slip" },
  { key: "name", label: "Name" },
  { key: "period", label: "Periode" },
  { key: "salaryRate", label: "Salary (Rate)" },
  { key: "dayWorked", label: "Day Worked" },
  { key: "allowance", label: "Allowance" },
  { key: "overtime", label: "Overtime" },
  { key: "deduction", label: "Deduction" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "paidDate", label: "Paid Date" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

const deletePayslip = (slipNo: string) => {
  if (confirm(`Are you sure you want to delete payslip ${slipNo}?`)) {
    payslips.value = payslips.value.filter((p) => p.slipNo !== slipNo);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Payslip" subtitle="Manage your Payslip">
      <template #actions>
        <NuxtLink
          to="/add-payroll"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Payroll</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Filter Bar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search payslip..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <FeatherIcon name="search" size="16" />
          </span>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedStatus"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Status: All</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <TableDataTable :columns="columns" :rows="filteredPayslips">
        <template #cell(slipNo)="{ row }">
          <NuxtLink to="/payslip-detail" class="font-semibold text-primary hover:underline">
            {{ row.slipNo }}
          </NuxtLink>
        </template>

        <template #cell(name)="{ row }">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(period)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.period }}</span>
        </template>

        <template #cell(salaryRate)="{ row }">
          <span class="font-mono text-gray-800 dark:text-gray-200">{{ formatRupiah(row.salaryRate) }}</span>
        </template>

        <template #cell(dayWorked)="{ row }">
          <span class="text-xs font-semibold">{{ row.dayWorked }} days</span>
        </template>

        <template #cell(allowance)="{ row }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatRupiah(row.allowance) }}</span>
        </template>

        <template #cell(overtime)="{ row }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatRupiah(row.overtime) }}</span>
        </template>

        <template #cell(deduction)="{ row }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatRupiah(row.deduction) }}</span>
        </template>

        <template #cell(total)="{ row }">
          <span class="font-mono font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(row.total) }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(paidDate)="{ row }">
          <span class="text-xs text-gray-500">{{ row.paidDate }}</span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <NuxtLink
              to="/payslip-detail"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View Payslip"
            >
              <FeatherIcon name="eye" size="16" />
            </NuxtLink>
            <NuxtLink
              to="/edit-payroll"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
            >
              <FeatherIcon name="edit" size="16" />
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deletePayslip(row.slipNo)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>
  </div>
</template>
