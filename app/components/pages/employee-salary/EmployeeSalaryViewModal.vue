<script setup lang="ts">
import type { EmployeeSalaryItem } from '#server/types/employeeSalary'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

defineProps<{
  open: boolean
  salaryData: EmployeeSalaryItem | null
}>()

const emit = defineEmits<{
  close: []
  edit: [item: EmployeeSalaryItem]
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Employee Salary"
    medium
    @close="emit('close')"
  >
    <div v-if="salaryData" class="space-y-5">
      <!-- Employee Info Section -->
      <div>
        <div class="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <FeatherIcon name="info" size="14" class="text-primary" />
          <span>Employee Information</span>
        </div>
        <div class="divide-y divide-gray-100 rounded-lg border border-gray-200/70 bg-gray-50/50 p-4 text-sm dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-800/40">
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Employee ID</span>
            <span class="font-bold text-primary dark:text-primary-400">{{ salaryData.employeeId }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Employee Name</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ salaryData.name }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Base Salary</span>
            <span class="font-bold text-gray-900 dark:text-white">
              <CurrencyDisplay :value="salaryData.salary" />
            </span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Payroll System</span>
            <span class="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {{ salaryData.system }}
            </span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Overtime Rate</span>
            <span class="font-medium text-gray-900 dark:text-white">
              <CurrencyDisplay :value="salaryData.overtimeRate" /> / jam
            </span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Status</span>
            <span
              :class="[
                'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
                salaryData.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
              ]"
            >
              {{ salaryData.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Allowances Section -->
      <div>
        <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <FeatherIcon name="award" size="14" class="text-amber-500" />
            <span>Allowance List</span>
          </div>
          <span class="text-primary font-bold">
            Total: <CurrencyDisplay :value="salaryData.allowanceTotal" />
          </span>
        </div>
        <div class="overflow-hidden rounded-lg border border-gray-200/70 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Allowance Name</th>
                <th class="px-4 py-2 text-right font-semibold">Amount (IDR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="a in salaryData.allowances" :key="a.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">{{ a.name }}</td>
                <td class="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                  <CurrencyDisplay :value="a.amount" align="right" />
                </td>
              </tr>
              <tr v-if="!salaryData.allowances || salaryData.allowances.length === 0">
                <td colspan="2" class="px-4 py-3 text-center italic text-gray-400">
                  No allowances registered for this employee
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Close
        </button>
        <button
          v-if="salaryData"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          @click="emit('edit', salaryData)"
        >
          <FeatherIcon name="edit" size="14" />
          <span>Edit Salary</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
