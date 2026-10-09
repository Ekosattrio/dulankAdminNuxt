<script setup lang="ts">
import type { Discount } from '#server/types/promo'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

const props = defineProps<{
  items: Discount[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [item: Discount]
  delete: [item: Discount]
}>()

const searchQuery = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'value', label: 'Value', align: 'right' as const, sortable: true },
  { key: 'discountPlanName', label: 'Discount Plan', sortable: true },
  { key: 'validity', label: 'Validity', sortable: true },
  { key: 'days', label: 'Days' },
  { key: 'products', label: 'Products', sortable: true },
  { key: 'used', label: 'Used', align: 'right' as const, sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const, sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.discountPlanName.toLowerCase().includes(q) ||
      item.products.toLowerCase().includes(q)
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

    <template #cell-name="{ row }">
      <span class="font-medium text-gray-900 dark:text-white">{{ row.name }}</span>
    </template>

    <template #cell-value="{ row }">
      <template v-if="row.type === 'Flat'">
        <CurrencyDisplay :value="row.value" align="right" />
      </template>
      <template v-else>
        <span class="font-semibold text-gray-900 dark:text-white">{{ row.value }}%</span>
      </template>
    </template>

    <template #cell-discountPlanName="{ row }">
      <span class="text-gray-700 dark:text-gray-300">{{ row.discountPlanName }}</span>
    </template>

    <template #cell-validity="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ row.validFrom }} - {{ row.validTill }}
      </span>
    </template>

    <template #cell-days="{ row }">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="day in (row.days || [])"
          :key="day"
          class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          {{ day }}
        </span>
      </div>
    </template>

    <template #cell-products="{ row }">
      <span class="text-xs text-gray-700 dark:text-gray-300">{{ row.products }}</span>
    </template>

    <template #cell-used="{ row }">
      <span>{{ row.used }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Discount"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Discount"
          @click="emit('delete', row)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

