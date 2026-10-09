<script setup lang="ts">
export interface OrderProductItem {
  id: number | string
  name: string
  jobTitle: string
  description?: string
  qty: string | number
  priority: 'Urgent' | 'High' | 'Normal' | 'Low' | string
  workflow: any[]
}

defineProps<{
  products: OrderProductItem[]
  selectedIndex: number
  salesInfo?: {
    salesDate: string
    noSales: string
    customer: string
    shipping: string
  }
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Sales Info Card -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <h6 class="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
        Sales Information
      </h6>
      <div class="mt-3 space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">Sales Date:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ salesInfo?.salesDate || '17/12/2025' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">No Sales:</span>
          <span class="font-semibold text-primary">{{ salesInfo?.noSales || '25250025452' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">Customer:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ salesInfo?.customer || 'PT. Makmur Abadi' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">Shipping:</span>
          <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            {{ salesInfo?.shipping || 'Pick Up' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">Order Summary:</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ products.length }} Products</span>
        </div>
      </div>

      <h6 class="mt-4 border-t border-gray-100 pt-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
        Order Items
      </h6>
      <div class="mt-2 space-y-2">
        <div
          v-for="(prod, idx) in products"
          :key="prod.id"
          class="cursor-pointer rounded-lg border p-3 transition"
          :class="
            selectedIndex === idx
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
          "
          @click="emit('select', idx)"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">{{ prod.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ prod.jobTitle }}</p>
            </div>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="
                selectedIndex === idx
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              "
            >
              {{ selectedIndex === idx ? 'Editing' : 'Manage' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

