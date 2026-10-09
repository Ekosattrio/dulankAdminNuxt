<script setup lang="ts">
import type { BanIpItem } from '#server/types/ban-ip'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'

const props = defineProps<{
  items: BanIpItem[]
}>()

const emit = defineEmits<{
  edit: [item: BanIpItem]
  delete: [item: BanIpItem]
}>()

const searchQuery = ref('')

const filteredIps = computed(() => {
  return props.items.filter(item => {
    return !searchQuery.value ||
      item.ip.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const columns = [
  { key: 'ip', label: 'IP Address', sortable: true },
  { key: 'reason', label: 'Alasan Pemblokiran', sortable: false },
  { key: 'date', label: 'Tanggal Diblokir', sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'actions', label: 'Aksi', align: 'center' as const }
]
</script>

<template>
  <SalesDataTable
    :data="filteredIps"
    :columns="columns"
    search-placeholder="Cari alamat IP atau alasan..."
    v-model:search="searchQuery"
  >
    <template #cell-ip="{ row }">
      <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ row.ip }}</span>
    </template>

    <template #cell-reason="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-300">{{ row.reason }}</span>
    </template>

    <template #cell-date="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.date }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status ? 'Banned' : 'Inactive'" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton action="edit" label="Edit Ban" @click="emit('edit', row)" />
        <SalesActionButton action="delete" label="Hapus dari Ban" @click="emit('delete', row)" />
      </div>
    </template>
  </SalesDataTable>
</template>

