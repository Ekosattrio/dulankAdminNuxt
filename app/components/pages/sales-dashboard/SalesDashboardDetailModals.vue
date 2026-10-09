<script setup lang="ts">
import type { BestSellerItem } from './SalesBestSellersCard.vue'
import type { TransactionItem } from './SalesRecentTransactionsCard.vue'
import BaseModal from '~/components/modal/BaseModal.vue'

defineProps<{
  txModalOpen: boolean
  productModalOpen: boolean
  activeTransaction: TransactionItem | null
  activeProduct: BestSellerItem | null
}>()

const emit = defineEmits<{
  (e: 'closeTx'): void
  (e: 'closeProduct'): void
}>()
</script>

<template>
  <div>
    <!-- Modal: Transaction Details -->
    <BaseModal :model-value="txModalOpen" title="Transaction Details" max-width="md" @update:model-value="emit('closeTx')">
      <div v-if="activeTransaction" class="space-y-4 text-xs sm:text-sm">
        <div class="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
          <img
            :src="activeTransaction.image"
            :alt="activeTransaction.name"
            class="h-12 w-12 rounded-lg bg-gray-50 object-contain p-1 dark:bg-gray-800"
          />
          <div>
            <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ activeTransaction.name }}</h4>
            <p class="text-xs text-gray-400">{{ activeTransaction.date }} ({{ activeTransaction.time }} ago)</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 py-2">
          <div>
            <span class="block text-xs text-gray-400">Payment Method</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ activeTransaction.paymentMethod }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-400">Reference No</span>
            <span class="font-mono font-semibold text-[#1B5A90]">{{ activeTransaction.reference }}</span>
          </div>
          <div>
            <span class="block text-xs text-gray-400">Status</span>
            <span
              :class="[
                'inline-block rounded px-2.5 py-0.5 text-xs font-semibold',
                activeTransaction.status === 'Success'
                  ? 'border border-emerald-500 bg-emerald-50 text-emerald-600'
                  : activeTransaction.status === 'Canceled'
                    ? 'border border-red-500 bg-red-50 text-red-600'
                    : 'border border-amber-500 bg-amber-50 text-amber-600'
              ]"
            >
              {{ activeTransaction.status }}
            </span>
          </div>
          <div>
            <span class="block text-xs text-gray-400">Total Amount</span>
            <span class="text-base font-bold text-gray-900 dark:text-white">
              ${{ activeTransaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('closeTx')"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <!-- Modal: Product Details -->
    <BaseModal :model-value="productModalOpen" title="Product Details" max-width="md" @update:model-value="emit('closeProduct')">
      <div v-if="activeProduct" class="space-y-4 text-xs sm:text-sm">
        <div class="flex items-center gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
          <img
            :src="activeProduct.image"
            :alt="activeProduct.name"
            class="h-16 w-16 rounded-xl bg-gray-50 object-contain p-1.5 dark:bg-gray-800"
          />
          <div>
            <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ activeProduct.name }}</h4>
            <span class="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {{ activeProduct.category }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 py-2 text-center">
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="mb-1 block text-xs text-gray-400">Price</span>
            <span class="text-base font-bold text-gray-900 dark:text-white">${{ activeProduct.price }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="mb-1 block text-xs text-gray-400">Total Sales</span>
            <span class="text-base font-bold text-primary">{{ activeProduct.sales.toLocaleString() }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <span class="mb-1 block text-xs text-gray-400">In Stock</span>
            <span class="text-base font-bold text-emerald-600">{{ activeProduct.stock }} pcs</span>
          </div>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('closeProduct')"
        >
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>

