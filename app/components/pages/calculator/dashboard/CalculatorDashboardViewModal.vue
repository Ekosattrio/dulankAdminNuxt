<script setup lang="ts">
import type { CalculatorDashboardUser } from '#server/types/calculator-dashboard'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'

defineProps<{
  open: boolean
  user: CalculatorDashboardUser | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="Detail Kalkulator User"
    max-width="md"
    @close="emit('close')"
  >
    <div v-if="user" class="space-y-4 py-2 text-sm">
      <div class="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
          {{ user.user.charAt(0) }}
        </div>
        <div>
          <div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ user.user }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.role }} • {{ user.departmentId || 'Estimator' }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="text-gray-500">Calculate Count</div>
          <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ user.calculate.toLocaleString() }}</div>
        </div>
        <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="text-gray-500">Request Count</div>
          <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ user.request.toLocaleString() }}</div>
        </div>
        <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="text-gray-500">Usage Ratio</div>
          <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ user.usage }}%</div>
        </div>
        <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="text-gray-500">Status</div>
          <div class="mt-0.5"><SalesStatusBadge :status="user.status" /></div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400">
        <div class="flex justify-between">
          <span>Terakhir Aktif:</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ user.lastActive || '-' }}</span>
        </div>
        <div v-if="user.employeeId" class="mt-1 flex justify-between">
          <span>ID Karyawan Terhubung:</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ user.employeeId }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <button
          type="button"
          class="h-9 rounded-md border border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Tutup
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

