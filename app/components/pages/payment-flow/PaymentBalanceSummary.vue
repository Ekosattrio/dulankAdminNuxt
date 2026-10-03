<script setup lang="ts">
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PaymentBalanceEntry } from '#server/types/payment-flow'

defineProps<{
  balances: PaymentBalanceEntry[]
  dateRange: DateRangeValue | null
}>()
defineEmits<{
  'update:dateRange': [value: DateRangeValue | null]
}>()
const collapsed = ref(false)
const { formatNumber } = useFormatters()
</script>

<template>
  <section class="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      :aria-expanded="!collapsed"
      @click="collapsed = !collapsed"
    >
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">Balance Summary</h2>
      <FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="18" />
    </button>
    <div v-if="!collapsed" class="border-t border-gray-100 p-5 dark:border-gray-800">
      <!-- Balance Summary Filter (horizontal flex: label & date picker side-by-side) -->
      <div class="mb-4 flex items-center gap-4">
        <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Date</label>
        <DateRangePicker
          :model-value="dateRange"
          aria-label="Balance summary date"
          placeholder="Date"
          input-class="w-52"
          @update:model-value="$emit('update:dateRange', $event)"
        />
      </div>
      <div class="overflow-x-auto">
        <table :class="salesDocumentTable">
          <thead>
            <tr>
              <th>Bank Account</th>
              <th>Account Name</th>
              <th>Amount Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in balances" :key="`${item.bankAccount}-${item.accountName}`">
              <td>{{ item.bankAccount }}</td>
              <td>{{ item.accountName }}</td>
              <td :class="item.amountBalance < 0 ? 'text-red-600' : ''">{{ formatNumber(item.amountBalance) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
