<script setup lang="ts">
import type { IncentiveItem } from '#server/types/incentive'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'

defineProps<{
  incentives: IncentiveItem[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: IncentiveItem): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
      <thead class="bg-gray-50 dark:bg-gray-800/60 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-4 py-3 text-left"># Incentive</th>
          <th scope="col" class="px-4 py-3 text-left">Employee Name</th>
          <th scope="col" class="px-4 py-3 text-center">Periode</th>
          <th scope="col" class="px-4 py-3 text-center">Qty Selesai</th>
          <th scope="col" class="px-4 py-3 text-right">Total Amount</th>
          <th scope="col" class="px-4 py-3 text-center">Status</th>
          <th scope="col" class="px-4 py-3 text-center w-24">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
        <tr
          v-for="inc in incentives"
          :key="inc.id"
          class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
        >
          <td class="px-4 py-3 font-semibold text-primary">
            {{ inc.code }}
          </td>
          <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
            {{ inc.employee }}
          </td>
          <td class="px-4 py-3 text-center">
            <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              {{ inc.period }}
            </span>
          </td>
          <td class="px-4 py-3 text-center font-bold text-gray-800 dark:text-gray-200">
            {{ inc.qtyComplete }}
          </td>
          <td class="px-4 py-3 text-right">
            <CurrencyDisplay :value="inc.totalAmount" align="right" class="font-bold text-emerald-600 dark:text-emerald-400" />
          </td>
          <td class="px-4 py-3 text-center">
            <SalesStatusBadge :status="inc.status" />
          </td>
          <td class="px-4 py-3 text-center">
            <div class="inline-flex items-center gap-1.5 justify-center">
              <SalesActionButton
                action="edit"
                label="Edit Incentive"
                @click="emit('edit', inc)"
              />
              <SalesActionButton
                action="delete"
                label="Delete Incentive"
                @click="emit('delete', inc.id)"
              />
            </div>
          </td>
        </tr>
        <tr v-if="incentives.length === 0">
          <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Tidak ada data insentif karyawan yang ditemukan.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
