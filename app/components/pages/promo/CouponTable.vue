<script setup lang="ts">
import type { Coupon } from '#server/types/promo'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { tableFilterControlClass } from '~/utils/salesUi'

const props = defineProps<{
  items: Coupon[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [item: Coupon]
  delete: [item: Coupon]
}>()

const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const typeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Fixed Amount', value: 'Fixed' },
  { label: 'Percentage', value: 'Percentage' }
]

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'code', label: 'Code', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'discount', label: 'Discount', align: 'right' as const, sortable: true },
  { key: 'limit', label: 'Limit', align: 'right' as const, sortable: true },
  { key: 'used', label: 'Used', align: 'right' as const, sortable: true },
  { key: 'valid', label: 'Valid Until', sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const, sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchSearch = !q || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
    const matchType = !selectedType.value || item.type === selectedType.value
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value
    return matchSearch && matchType && matchStatus
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
        v-model="selectedType"
        :options="typeOptions"
        placeholder="Filter Type"
        width-class="w-40"
      />
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

    <template #cell-code="{ row }">
      <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        {{ row.code }}
      </span>
    </template>

    <template #cell-type="{ row }">
      <span>{{ row.type === 'Fixed' ? 'Fixed Amount' : 'Percentage' }}</span>
    </template>

    <template #cell-discount="{ row }">
      <template v-if="row.type === 'Fixed'">
        <CurrencyDisplay :value="row.discount" align="right" />
      </template>
      <template v-else>
        <span class="font-semibold text-gray-900 dark:text-white">{{ row.discount }}%</span>
      </template>
    </template>

    <template #cell-limit="{ row }">
      <span>{{ row.limit }}</span>
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
          label="Edit Coupon"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Coupon"
          @click="emit('delete', row)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

