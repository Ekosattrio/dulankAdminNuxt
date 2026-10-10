<script setup lang="ts">
import type { MyIncentive } from '#server/types/my-incentive'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import type { DateRangeValue } from '~/composables/useDateRange'

interface Props {
  items: MyIncentive[]
  loading?: boolean
  searchQuery: string
  selectedProcess: string
  dateRange: DateRangeValue | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedProcess', val: string): void
  (e: 'update:dateRange', val: DateRangeValue | null): void
  (e: 'refresh'): void
  (e: 'print'): void
}>()

// Exact columns from https://dulank-admin.netlify.app/my-incentive.html
// Date, Job Title, Flow Name, Incentive, Unit, Qty, Amount (NO Action column)
const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'jobTitle', label: 'Job Title', sortable: true },
  { key: 'flowName', label: 'Flow Name', sortable: true },
  { key: 'incentive', label: 'Incentive', sortable: true, align: 'end' as const },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'qty', label: 'Qty', sortable: true, align: 'end' as const },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const },
]

// Exact filter options from Netlify: Printing, Cutting
const processOptions = ['All Process', 'Printing', 'Cutting']

const totalAmount = computed(() => {
  return props.items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
})
</script>

<template>
  <div class="my-incentive-table-wrapper">
    <SalesDataTable
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search..."
      @update:search="emit('update:searchQuery', $event)"
    >
      <template #filters>
        <!-- DateRangePicker Standard -->
        <DateRangePicker
          :model-value="dateRange"
          aria-label="Date"
          input-class="w-44 max-w-44"
          align="end"
          placeholder="Date"
          @update:model-value="emit('update:dateRange', $event)"
        />

        <!-- Name of Process filter matching Netlify (Printing, Cutting) -->
        <TableFilterSelect
          :model-value="selectedProcess"
          :options="processOptions"
          placeholder="Name Of Process"
          aria-label="Name Of Process"
          @update:model-value="emit('update:selectedProcess', $event)"
        />
      </template>

      <!-- Cell Renderers matching exact literal table format from reference HTML -->
      <template #cell(date)="{ item }">
        <span class="text-gray-900 dark:text-gray-100">{{ item.date }}</span>
      </template>

      <template #cell(jobTitle)="{ item }">
        <span class="text-gray-900 dark:text-gray-100">{{ item.jobTitle }}</span>
      </template>

      <template #cell(flowName)="{ item }">
        <span class="text-gray-800 dark:text-gray-200">{{ item.flowName }}</span>
      </template>

      <template #cell(incentive)="{ item }">
        <CurrencyDisplay :value="item.incentive" prefix="" align="right" class="w-full text-gray-800 dark:text-gray-200" />
      </template>

      <template #cell(unit)="{ item }">
        <span class="text-gray-800 dark:text-gray-200">{{ item.unit }}</span>
      </template>

      <template #cell(qty)="{ item }">
        <span class="text-gray-900 dark:text-gray-100 font-mono">{{ item.qty }}</span>
      </template>

      <template #cell(amount)="{ item }">
        <CurrencyDisplay :value="item.amount" prefix="" align="right" class="w-full text-gray-900 dark:text-gray-100 font-medium" />
      </template>

      <!-- Table Footer Total Row matching exact legacy tfoot (Total in col 1, colspan 5, Amount sum in col 7) -->
      <template #footer>
        <tr class="bg-gray-50/80 dark:bg-gray-800/80 font-bold border-t-2 border-gray-300 dark:border-gray-600 text-xs">
          <td class="px-4 py-3 text-start text-gray-900 dark:text-white font-bold">Total</td>
          <td colspan="5"></td>
          <td id="amount-total" class="px-4 py-3 text-end text-gray-900 dark:text-white font-bold">
            <CurrencyDisplay :value="totalAmount" prefix="" align="right" bold class="w-full" />
          </td>
        </tr>
      </template>
    </SalesDataTable>
  </div>
</template>
