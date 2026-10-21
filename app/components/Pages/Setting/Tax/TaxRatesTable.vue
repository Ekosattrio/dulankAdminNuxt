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
    :items="filteredTaxes"
    :columns="columns"
    search-placeholder="Cari tarif pajak..."
    :search="searchQuery"
    @update:search="searchQuery = $event"
  >
    <template #cell(name)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
    </template>

    <template #cell(rate)="{ item }">
      <span class="inline-flex rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        {{ item.rate }}%
      </span>
    </template>

    <template #cell(createdOn)="{ item }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.createdOn || '-' }}</span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton action="edit" label="Edit Pajak" @click="emit('edit', item)" />
        <SalesActionButton action="delete" danger label="Hapus Pajak" @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>

