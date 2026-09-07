<script setup lang="ts">
import { formatRupiah } from "~/composables/useFormatters";

interface MyIncentiveItem {
  code: string;
  process: string;
  date: string;
  qty: number;
  amount: number;
  status: "Paid" | "Pending";
}

const items = ref<MyIncentiveItem[]>([
  { code: "INC-01", process: "Printing", date: "2025-08-10", qty: 10, amount: 50000, status: "Paid" },
  { code: "INC-02", process: "Cutting", date: "2025-08-12", qty: 8, amount: 24000, status: "Pending" },
  { code: "INC-03", process: "Laminasi", date: "2025-08-14", qty: 15, amount: 75000, status: "Paid" },
  { code: "INC-04", process: "Printing", date: "2025-08-18", qty: 12, amount: 36000, status: "Paid" },
  { code: "INC-05", process: "Cutting", date: "2025-08-20", qty: 5, amount: 15000, status: "Pending" },
]);

const searchQuery = ref("");
const selectedProcess = ref("");

const filteredItems = computed(() => {
  return items.value.filter((i) => {
    const matchSearch = !searchQuery.value || i.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchProcess = !selectedProcess.value || i.process === selectedProcess.value;
    return matchSearch && matchProcess;
  });
});

const columns = [
  { key: "code", label: "# Incentive" },
  { key: "process", label: "Name Of Process" },
  { key: "date", label: "Date" },
  { key: "qty", label: "Qty" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="My Incentive List" subtitle="Manage My Incentive" />

    <!-- Stat widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-primary dark:bg-orange-950/40">
          <FeatherIcon name="award" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Total Count Incentive</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">307,144</h4>
        </div>
      </div>

      <div
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
          <FeatherIcon name="dollar-sign" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Amount Incentive</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">Rp4.385.000</h4>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search code..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <FeatherIcon name="search" size="16" />
          </span>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedProcess"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Process: All</option>
            <option value="Printing">Printing</option>
            <option value="Cutting">Cutting</option>
            <option value="Laminasi">Laminasi</option>
          </select>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredItems">
        <template #cell(code)="{ row }">
          <span class="font-semibold text-primary">{{ row.code }}</span>
        </template>

        <template #cell(process)="{ row }">
          <span
            class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {{ row.process }}
          </span>
        </template>

        <template #cell(date)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.date }}</span>
        </template>

        <template #cell(qty)="{ row }">
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ row.qty }}</span>
        </template>

        <template #cell(amount)="{ row }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(row.amount) }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
            ]"
          >
            {{ row.status }}
          </span>
        </template>
      </TableDataTable>
    </div>
  </div>
</template>
