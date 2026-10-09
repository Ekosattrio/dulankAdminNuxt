<script setup lang="ts">
import type { SecurityDevice } from '#server/types/security-settings'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  open: boolean
  devices: SecurityDevice[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="Daftar Perangkat Login Aktif"
    max-width="md"
    @close="emit('close')"
  >
    <div class="space-y-3 py-2 text-xs">
      <div
        v-for="d in devices"
        :key="d.id"
        class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FeatherIcon name="monitor" :size="16" />
          </div>
          <div>
            <div class="font-semibold text-gray-900 dark:text-gray-100">{{ d.name }}</div>
            <div class="text-gray-500">{{ d.ip }} • {{ d.lastActive }}</div>
          </div>
        </div>
        <span class="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Aktif
        </span>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <button
          type="button"
          class="h-9 rounded-md border border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Tutup
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

