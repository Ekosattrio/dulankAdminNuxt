<script setup lang="ts">
import type { HeldOrder } from '#server/types/pos'
defineProps<{ holdOrders: HeldOrder[]; totalPayable: number }>()
const holdModalOpen = defineModel<boolean>('holdOpen', { required: true })
const ordersModalOpen = defineModel<boolean>('ordersOpen', { required: true })
const holdReference = defineModel<string>('reference', { required: true })
const emit = defineEmits<{ hold: []; resume: [order: HeldOrder] }>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <SalesDialog :open="holdModalOpen" title="Hold Order" @close="holdModalOpen = false">
    <div class="p-5 text-xs space-y-3">
      <h3 class="text-center text-lg font-bold text-gray-900 dark:text-white">
        {{ formatRupiah(totalPayable) }}
      </h3>
      <label class="font-semibold text-gray-700 dark:text-gray-300">Order Reference / Note</label>
      <input
        v-model="holdReference"
        type="text"
        placeholder="e.g. Table 4 / Pak Budi"
        class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <p class="text-gray-400">
        The current cart will be saved to held orders. You can retrieve it anytime from View Orders.
      </p>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="rounded border px-3 py-1.5" @click="holdModalOpen = false">
          Cancel
        </button>
        <button
          type="button"
          class="rounded bg-primary px-4 py-1.5 font-semibold text-white"
          @click="emit('hold')"
        >
          Hold Order
        </button>
      </div>
    </div>
  </SalesDialog>

  <SalesDialog :open="ordersModalOpen" title="Held Orders" @close="ordersModalOpen = false">
    <div class="p-5 text-xs space-y-3">
      <div v-if="holdOrders.length === 0" class="py-6 text-center text-gray-400">No held orders found</div>
      <div
        v-for="h in holdOrders"
        :key="h.id"
        class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
      >
        <div>
          <p class="font-bold text-gray-900 dark:text-white">{{ h.ref }}</p>
          <p class="text-gray-500">{{ h.items.length }} items | {{ h.time }}</p>
          <span class="font-semibold text-primary">{{ formatRupiah(h.total) }}</span>
        </div>
        <button
          type="button"
          class="rounded bg-primary px-3 py-1.5 font-semibold text-white"
          @click="emit('resume', h)"
        >
          Resume
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
