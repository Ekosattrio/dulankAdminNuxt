<script setup lang="ts">
import type { TaxRateItem } from '#server/types/tax-rates'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

const props = defineProps<{
  taxes: TaxRateItem[]
}>()

const emit = defineEmits<{
  edit: [item: TaxRateItem]
  delete: [item: TaxRateItem]
}>()

const searchQuery = ref('')

const filteredTaxes = computed(() => {
  return props.taxes.filter(t => {
    return !searchQuery.value || t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const columns = [
  { key: 'name', label: 'Nama Pajak', sortable: true },
  { key: 'rate', label: 'Tarif (%)', sortable: true, align: 'center' as const },
  { key: 'createdOn', label: 'Dibuat Pada', sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'actions', label: 'Aksi', align: 'center' as const }
]
</script>

<template>
  <SalesDataTable
    :data="filteredTaxes"
    :columns="columns"
    search-placeholder="Cari tarif pajak..."
    v-model:search="searchQuery"
  >
    <template #cell-name="{ row }">
      <span class="font-semibold text-gray-900 dark:text-white">{{ row.name }}</span>
    </template>

    <template #cell-rate="{ row }">
      <span class="inline-flex rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        {{ row.rate }}%
      </span>
    </template>

    <template #cell-createdOn="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.createdOn }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton action="edit" label="Edit Pajak" @click="emit('edit', row)" />
        <SalesActionButton action="delete" label="Hapus Pajak" @click="emit('delete', row)" />
      </div>
    </template>
  </SalesDataTable>
</template>

