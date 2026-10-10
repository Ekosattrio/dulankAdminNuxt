<script setup lang="ts">
import type { CalculatorDashboardUser } from '#server/types/calculator-dashboard'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'

const props = defineProps<{
  users: CalculatorDashboardUser[]
}>()

const emit = defineEmits<{
  view: [item: CalculatorDashboardUser]
  edit: [item: CalculatorDashboardUser]
  delete: [item: CalculatorDashboardUser]
}>()

const searchQuery = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' }
]

const filteredUsers = computed(() => {
  return props.users.filter(item => {
    const matchesSearch = !searchQuery.value || item.user.toLowerCase().includes(searchQuery.value.toLowerCase()) || (item.role && item.role.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesStatus = !selectedStatus.value || item.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const columns = [
  { key: 'user', label: 'User', sortable: true },
  { key: 'calculate', label: 'Calculate', sortable: true },
  { key: 'request', label: 'Request', sortable: true },
  { key: 'usage', label: 'Usage', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', align: 'center' as const }
]
</script>

<template>
  <SalesDataTable
    :data="filteredUsers"
    :columns="columns"
    search-placeholder="Cari user calculator..."
    v-model:search="searchQuery"
  >
    <template #filters>
      <TableFilterSelect
        v-model="selectedStatus"
        :options="statusOptions"
        aria-label="Filter status"
      />
    </template>

    <template #cell-user="{ row }">
      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {{ row.user.charAt(0) }}
        </div>
        <div>
          <div class="font-medium text-gray-900 dark:text-gray-100">{{ row.user }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ row.role || 'Estimator' }}</div>
        </div>
      </div>
    </template>

    <template #cell-calculate="{ row }">
      <span class="font-medium text-gray-800 dark:text-gray-200">{{ row.calculate.toLocaleString() }}</span>
    </template>

    <template #cell-request="{ row }">
      <span class="font-medium text-gray-800 dark:text-gray-200">{{ row.request.toLocaleString() }}</span>
    </template>

    <template #cell-usage="{ row }">
      <div class="w-full max-w-[140px]">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ row.usage }}%</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="h-full rounded-full transition-all duration-300"
            :class="row.usage > 80 ? 'bg-[#28C76F]' : row.usage > 40 ? 'bg-primary' : 'bg-[#FF9F43]'"
            :style="{ width: `${Math.min(row.usage, 100)}%` }"
          />
        </div>
      </div>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton action="view" label="View Stats" @click="emit('view', row)" />
        <SalesActionButton action="edit" label="Edit Record" @click="emit('edit', row)" />
        <SalesActionButton action="delete" label="Delete Record" @click="emit('delete', row)" />
      </div>
    </template>
  </SalesDataTable>
</template>

