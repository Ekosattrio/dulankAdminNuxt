<script setup lang="ts">
import type { JobBranchFilterParams } from '#server/types/job-branch'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import type { DateRangeValue } from '~/composables/useDateRange'

interface Props {
  open: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const searchQuery = ref('')
const filterBranch = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const branchOptions = ['Dulank Karawang', 'Dulank Jakarta', 'Dulank Cirebon']

const filters = computed<JobBranchFilterParams>(() => ({
    search: searchQuery.value || undefined,
    branch: filterBranch.value || undefined,
    startDate: filterDateRange.value?.start || undefined,
    endDate: filterDateRange.value?.end || undefined,
}))
const { historyItems, pending, refresh } = useJobBranchHistory(filters)
</script>

<template>
  <SalesDialog
    :open="open"
    title="History Job Branch"
    wide
    @close="$emit('close')"
  >
    <div class="space-y-4 text-xs">
      <!-- Toolbar Filters matching legacy -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 dark:border-gray-850">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Date Range -->
          <DateRangePicker
            :model-value="filterDateRange"
            placeholder="Date"
            input-class="w-40"
            @update:model-value="filterDateRange = $event"
          />

          <!-- Search -->
          <div class="relative w-48">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full h-9 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div>
          <!-- Branch Filter -->
          <TableFilterSelect
            :model-value="filterBranch"
            :options="branchOptions"
            placeholder="Branch"
            @update:model-value="filterBranch = $event"
          />
        </div>
      </div>

      <!-- History Table -->
      <div class="border border-gray-200 dark:border-gray-750 rounded-lg overflow-hidden">
        <table class="w-full text-xs">
          <thead class="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold">
            <tr>
              <th class="px-4 py-2.5 text-left">Date</th>
              <th class="px-4 py-2.5 text-left">Branch</th>
              <th class="px-4 py-2.5 text-left">Customers</th>
              <th class="px-4 py-2.5 text-left">Flow Name</th>
              <th class="px-4 py-2.5 text-left">Date Finish</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
            <tr v-if="pending">
              <td colspan="5" class="px-4 py-6 text-center text-gray-400">Loading history...</td>
            </tr>
            <tr v-else-if="historyItems.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-400">No history records found</td>
            </tr>
            <tr
              v-for="item in historyItems"
              :key="item.id || item.date + item.flowName"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
            >
              <td class="px-4 py-2.5 font-medium">{{ item.date }}</td>
              <td class="px-4 py-2.5">{{ item.branch }}</td>
              <td class="px-4 py-2.5 font-semibold text-gray-900 dark:text-white">{{ item.customer }}</td>
              <td class="px-4 py-2.5">{{ item.flowName }}</td>
              <td class="px-4 py-2.5 font-medium text-emerald-600 dark:text-emerald-400">{{ item.dateFinish }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium transition-colors"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium transition-colors"
          @click="$emit('close')"
        >
          Submit
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
