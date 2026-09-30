<script setup lang="ts">import { formatRupiah } from "~/composables/useFormatters";

const { data: myIncentiveData } = await useFetch<MyIncentiveItem[]>('/api/my-incentive')
const items = ref<MyIncentiveItem[]>(myIncentiveData.value ?? [])
useMockSync('my-incentive', items);

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
];</script>

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
          <CommonFeatherIcon name="award" size="24" />
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
          <CommonFeatherIcon name="dollar-sign" size="24" />
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
        <CommonSearchFilter v-model="searchQuery" placeholder="Search code..." />

        <CommonFilterSelect v-model="selectedProcess" :options="[{ value: 'Printing', label: 'Printing' }, { value: 'Cutting', label: 'Cutting' }, { value: 'Laminasi', label: 'Laminasi' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredItems">
        <template #cell(code)="{ item }">
          <span class="font-semibold text-primary">{{ item.code }}</span>
        </template>

        <template #cell(process)="{ item }">
          <span
            class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {{ item.process }}
          </span>
        </template>

        <template #cell(date)="{ item }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.date }}</span>
        </template>

        <template #cell(qty)="{ item }">
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ item.qty }}</span>
        </template>

        <template #cell(amount)="{ item }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(item.amount) }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>
      </TablesDataTable>
    </div>
  </div>
</template>
