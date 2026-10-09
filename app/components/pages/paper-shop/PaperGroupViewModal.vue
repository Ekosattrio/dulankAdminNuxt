<script setup lang="ts">
import type { PaperGroup } from '#server/types/paper-shop'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'

defineProps<{
  open: boolean
  group: PaperGroup | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Paper Group"
    size="md"
    @close="emit('close')"
  >
    <div v-if="group" class="space-y-4">
      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Paper Group Name</span>
        <span class="col-span-7 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ group.name }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Merk / Brand</span>
        <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ group.merk }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Price Type</span>
        <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ group.priceType }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Last Update</span>
        <span class="col-span-7 text-sm font-mono text-gray-700 dark:text-gray-300">{{ group.update }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
        <div class="col-span-7">
          <SalesStatusBadge :status="group.status" />
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>

