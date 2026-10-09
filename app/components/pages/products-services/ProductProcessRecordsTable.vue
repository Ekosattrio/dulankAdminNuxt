<script setup lang="ts">
import type { ProductProcessItem } from '#server/types/product-process'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  items: ProductProcessItem[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: ProductProcessItem): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterProcess = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'code', label: '# Process', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'processName', label: 'Name of Process', sortable: true, align: 'center' as const },
  { key: 'createDate', label: 'Create Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const processOptions = [
  { label: 'All Process Names', value: '' },
  { label: 'Printing', value: 'Printing' },
  { label: 'Cutting', value: 'Cutting' },
  { label: 'Laminating', value: 'Laminating' },
  { label: 'Die-Cut', value: 'Die-Cut' },
  { label: 'Packaging', value: 'Packaging' }
]

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchProcess = !filterProcess.value || item.processName === filterProcess.value
    const matchSearch =
      !searchQuery.value ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.processName.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchProcess && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search process code or product..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterProcess"
        :options="processOptions"
        placeholder="Process Name"
      />
      <TableFilterSelect
        v-model="filterStatus"
        :options="[
          { label: 'All Status', value: '' },
          { label: 'Active', value: 'Active' },
          { label: 'Deactive', value: 'Deactive' }
        ]"
        placeholder="Status"
      />
    </template>

    <template #cell-code="{ row }">
      <span class="font-bold text-primary-600 dark:text-primary-400 font-mono text-xs">{{ row.code }}</span>
    </template>

    <template #cell-product="{ row }">
      <div class="flex items-center gap-3">
        <img
          :src="row.image || '/assets/img/products/stock-img-01.png'"
          alt="product"
          class="h-9 w-9 rounded-md object-cover border border-gray-200 dark:border-gray-700"
        />
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.product }}</span>
      </div>
    </template>

    <template #cell-processName="{ row }">
      <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ row.processName }}
      </span>
    </template>

    <template #cell-createDate="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ row.createDate }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="inline-flex items-center gap-1.5 justify-center">
        <SalesActionButton
          action="edit"
          label="Edit Product Process"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Product Process"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

