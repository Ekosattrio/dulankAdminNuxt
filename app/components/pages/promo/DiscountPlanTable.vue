<script setup lang="ts">
import type { DiscountPlan } from '#server/types/promo'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  items: DiscountPlan[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [item: DiscountPlan]
  delete: [item: DiscountPlan]
}>()

const searchQuery = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

const columns = [
  { key: 'planName', label: 'Plan Name', sortable: true },
  { key: 'customers', label: 'Customers', sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const, sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchSearch = !q || item.planName.toLowerCase().includes(q) || item.customers.toLowerCase().includes(q)
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :rows="filteredItems"
    :loading="loading"
    searchable
    v-model:search="searchQuery"
  >
    <template #filters>
      <TableFilterSelect
        v-model="selectedStatus"
        :options="statusOptions"
        placeholder="Filter Status"
        width-class="w-36"
      />
    </template>

    <template #cell-planName="{ row }">
      <span class="font-medium text-gray-900 dark:text-white">{{ row.planName }}</span>
    </template>

    <template #cell-customers="{ row }">
      <span class="text-gray-700 dark:text-gray-300">{{ row.customers }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Plan"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Plan"
          @click="emit('delete', row)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

