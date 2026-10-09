<script setup lang="ts">
import type { CustomField } from '#server/types/custom-fields'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  fields: CustomField[]
}>()

const emit = defineEmits<{
  edit: [item: CustomField]
  delete: [item: CustomField]
}>()

const searchQuery = ref('')
const filterModule = ref('')
const filterStatus = ref('')

const moduleOptions = [
  { label: 'Semua Modul', value: '' },
  { label: 'Expense', value: 'Expense' },
  { label: 'Transaction', value: 'Transaction' },
  { label: 'Customer', value: 'Customer' },
  { label: 'Product', value: 'Product' }
]

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

const filteredFields = computed(() => {
  return props.fields.filter(f => {
    const matchesSearch = !searchQuery.value ||
      f.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      f.module.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesModule = !filterModule.value || f.module === filterModule.value
    const matchesStatus = !filterStatus.value || f.status === filterStatus.value
    return matchesSearch && matchesModule && matchesStatus
  })
})

const columns = [
  { key: 'module', label: 'Modul', sortable: true },
  { key: 'label', label: 'Label Field', sortable: true },
  { key: 'type', label: 'Tipe Data', sortable: true },
  { key: 'defaultValue', label: 'Nilai Default', sortable: false },
  { key: 'required', label: 'Wajib', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'actions', label: 'Aksi', align: 'center' as const }
]
</script>

<template>
  <SalesDataTable
    :data="filteredFields"
    :columns="columns"
    search-placeholder="Cari label field atau modul..."
    v-model:search="searchQuery"
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterModule"
        :options="moduleOptions"
        aria-label="Filter modul"
      />
      <TableFilterSelect
        v-model="filterStatus"
        :options="statusOptions"
        aria-label="Filter status"
      />
    </template>

    <template #cell-module="{ row }">
      <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        {{ row.module }}
      </span>
    </template>

    <template #cell-label="{ row }">
      <span class="font-medium text-gray-900 dark:text-white">{{ row.label }}</span>
    </template>

    <template #cell-type="{ row }">
      <span class="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ row.type }}
      </span>
    </template>

    <template #cell-defaultValue="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.defaultValue || '-' }}</span>
    </template>

    <template #cell-required="{ row }">
      <span
        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
        :class="row.required ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
      >
        {{ row.required ? 'Required' : 'Optional' }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton action="edit" label="Edit Field" @click="emit('edit', row)" />
        <SalesActionButton action="delete" label="Hapus Field" @click="emit('delete', row)" />
      </div>
    </template>
  </SalesDataTable>
</template>

