<script setup lang="ts">
import type { SecurityActivity } from '#server/types/security-settings'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  open: boolean
  activities: SecurityActivity[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="Log Aktivitas Keamanan Akun"
    max-width="md"
    @close="emit('close')"
  >
    <div class="space-y-3 py-2 text-xs">
      <div
        v-for="a in activities"
        :key="a.id"
        class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <FeatherIcon name="shield" :size="16" />
          </div>
          <div>
            <div class="font-semibold text-gray-900 dark:text-gray-100">{{ a.action }}</div>
            <div class="text-gray-500">{{ a.device }} • {{ a.date }}</div>
          </div>
        </div>
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

