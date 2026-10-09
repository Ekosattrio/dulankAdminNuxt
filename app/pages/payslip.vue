<<<<<<< HEAD
<script setup lang="ts">import { formatRupiah } from "~/composables/useFormatters";

const { data: payslipData } = await useFetch<PayslipItem[]>('/api/payslip')
const payslips = ref<PayslipItem[]>(payslipData.value ?? [])
useMockSync('payslip', payslips);

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
};</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Payslip" subtitle="Manage your Payslip">
      <template #actions>
        <NuxtLink
          to="/add-payroll"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
        >
          <CommonFeatherIcon name="plus-circle" size="18" />
          <span>Add New Payroll</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Filter Bar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search payslip..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Paid', label: 'Paid' }, { value: 'Unpaid', label: 'Unpaid' }]" />
      </div>

      <!-- Table -->
      <TablesDataTable :columns="columns" :items="filteredPayslips">
        <template #cell(slipNo)="{ item }">
          <NuxtLink to="/payslip-detail" class="font-semibold text-primary hover:underline">
            {{ item.slipNo }}
          </NuxtLink>
        </template>

        <template #cell(name)="{ item }">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(period)="{ item }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.period }}</span>
        </template>

        <template #cell(salaryRate)="{ item }">
          <span class="font-mono text-gray-800 dark:text-gray-200">{{ formatRupiah(item.salaryRate) }}</span>
        </template>

        <template #cell(dayWorked)="{ item }">
          <span class="text-xs font-semibold">{{ item.dayWorked }} days</span>
        </template>

        <template #cell(allowance)="{ item }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatRupiah(item.allowance) }}</span>
        </template>

        <template #cell(overtime)="{ item }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatRupiah(item.overtime) }}</span>
        </template>

        <template #cell(deduction)="{ item }">
          <span class="font-mono text-gray-600 dark:text-gray-400">{{ formatRupiah(item.deduction) }}</span>
        </template>

        <template #cell(total)="{ item }">
          <span class="font-mono font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(item.total) }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

        <template #cell(paidDate)="{ item }">
          <span class="text-xs text-gray-500">{{ item.paidDate }}</span>
        </template>

        <template #cell(action)="{ item }">
          <div class="flex items-center justify-end gap-2">
            <NuxtLink
              to="/payslip-detail"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View Payslip"
            >
              <CommonFeatherIcon name="eye" size="16" />
            </NuxtLink>
            <NuxtLink
              to="/edit-payroll"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
            >
              <CommonFeatherIcon name="edit" size="16" />
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deletePayslip(item.slipNo)"
            >
              <CommonFeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TablesDataTable>
    </div>
=======
<script setup lang="ts">
import PayslipWorkspace from '~/components/pages/payslip/PayslipWorkspace.vue'

useLegacyPage({ title: 'Payslips - Penggajian Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-payslip">
    <PayslipWorkspace />
>>>>>>> origin/eko
  </div>
</template>
