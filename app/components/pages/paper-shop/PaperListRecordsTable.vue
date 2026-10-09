<script setup lang="ts">
import type { PaperItem, PaperGroup } from '#server/types/paper-shop'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  items: PaperItem[]
  groups?: PaperGroup[]
}>()

const emit = defineEmits<{
  (e: 'view', item: PaperItem): void
  (e: 'edit', item: PaperItem): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')
const filterGroup = ref('')

const groupOptions = computed(() => [
  { label: 'All Groups', value: '' },
  ...(props.groups || []).map((g) => ({ label: g.name, value: g.id }))
])

const columns = [
  { key: 'name', label: 'Paper Name', sortable: true },
  { key: 'merk', label: 'Merk', sortable: true },
  { key: 'price', label: 'Price', sortable: true, align: 'right' as const },
  { key: 'priceType', label: 'Price Type', sortable: true, align: 'center' as const },
  { key: 'unitPrice', label: 'Unit', sortable: true, align: 'center' as const },
  { key: 'gsm', label: 'GSM', sortable: true, align: 'center' as const },
  { key: 'paperSize', label: 'Paper Size', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true, align: 'right' as const },
  { key: 'unitStock', label: 'Unit Stock', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchGroup = !filterGroup.value || String(item.groupId) === String(filterGroup.value)
    const matchSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.paperSize.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(item.gsm).includes(searchQuery.value)
    return matchStatus && matchGroup && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search paper name, size or gsm..."
  >
    <template #filters>
      <TableFilterSelect
        v-if="groups && groups.length > 0"
        v-model="filterGroup"
        :options="groupOptions"
        placeholder="Paper Group"
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

    <template #cell-name="{ row }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
    </template>

    <template #cell-merk="{ row }">
      <span class="text-gray-700 dark:text-gray-300">{{ row.merk }}</span>
    </template>

    <template #cell-price="{ row }">
      <CurrencyDisplay :value="row.price" align="right" class="font-bold text-gray-900 dark:text-gray-100" />
    </template>

    <template #cell-priceType="{ row }">
      <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ row.priceType }}
      </span>
    </template>

    <template #cell-unitPrice="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.unitPrice }}</span>
    </template>

    <template #cell-gsm="{ row }">
      <span class="font-bold text-gray-800 dark:text-gray-200">{{ row.gsm }}</span>
    </template>

    <template #cell-paperSize="{ row }">
      <span class="font-mono text-xs bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
        {{ row.paperSize }}
      </span>
    </template>

    <template #cell-stock="{ row }">
      <span
        class="font-semibold"
        :class="row.stock < 200 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-gray-100'"
      >
        {{ row.stock.toLocaleString('id-ID') }}
      </span>
    </template>

    <template #cell-unitStock="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.unitStock }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="inline-flex items-center gap-1.5 justify-center">
        <SalesActionButton
          action="view"
          label="View Paper Item"
          @click="emit('view', row)"
        />
        <SalesActionButton
          action="edit"
          label="Edit Paper Item"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Paper Item"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

