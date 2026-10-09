<script setup lang="ts">
import type { CartItem, POSCustomer } from '#server/types/pos'
defineProps<{
  cart: CartItem[]
  customer: POSCustomer
  discountAmount: number
  shippingCost: number
  taxRate: number
  subtotal: number
  taxAmount: number
  totalPayable: number
}>()
const emit = defineEmits<{
  customer: []
  clear: []
  hold: []
  tax: []
  shipping: []
  discount: []
  payment: []
  quantity: [item: CartItem, delta: number]
  setQuantity: [item: CartItem, qty: number]
  edit: [item: CartItem]
  remove: [id: string]
}>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <div
    class="flex w-full flex-col border-s border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-[400px] xl:w-[440px] lg:shrink-0"
  >
    <!-- Customer Selector Bar -->
    <div class="border-b border-gray-100 p-3 dark:border-gray-800">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-gray-700 dark:text-gray-300">Customer:</span>
        <button type="button" class="font-semibold text-primary hover:underline" @click="emit('customer')">
          + Change / New
        </button>
      </div>
      <div
        class="mt-1 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      >
        <span>{{ customer.name }}</span>
        <span class="text-gray-400">{{ customer.phone }}</span>
      </div>
    </div>

    <!-- Product Added List -->
    <div
      class="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-xs dark:border-gray-800"
    >
      <div class="flex items-center gap-1.5">
        <span class="font-bold text-gray-900 dark:text-white">Product Added</span>
        <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {{ cart.length }}
        </span>
      </div>
      <button type="button" class="text-xs text-danger hover:underline" @click="emit('clear')">
        Clear all
      </button>
    </div>

    <!-- Scrollable Cart Items -->
    <div class="flex-1 max-h-96 lg:max-h-none overflow-y-auto p-3 space-y-2.5">
      <div
        v-if="cart.length === 0"
        class="flex h-48 flex-col items-center justify-center text-center text-gray-400"
      >
        <FeatherIcon name="shopping-cart" size="32" class="opacity-30" />
        <p class="mt-2 text-xs">Your cart is empty</p>
        <p class="text-[11px] text-gray-400">Select items from the catalog</p>
      </div>

      <div
        v-for="item in cart"
        :key="item.id"
        class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 dark:border-gray-800 dark:bg-gray-800/40"
      >
        <div class="flex items-center gap-2.5">
          <div class="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white p-1 dark:bg-gray-900">
            <img
              src="/assets/img/products/brosur.png"
              :alt="item.name"
              class="h-full w-full object-contain"
            />
          </div>
          <div class="text-xs">
            <p class="font-bold text-gray-900 dark:text-white">{{ item.name }}</p>
            <p class="line-clamp-1 text-[10px] text-gray-500">{{ item.specs }}</p>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-primary">{{ formatRupiah(item.price) }}</span>
              <span class="text-[10px] text-gray-400">Job: {{ item.jobTitle }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Stepper -->
          <div
            class="flex items-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          >
            <button
              type="button"
              class="flex h-6 w-6 items-center justify-center text-gray-500 hover:text-danger"
              @click="emit('quantity', item, -1)"
            >
              <FeatherIcon name="minus" size="11" />
            </button>
            <input
              :value="item.qty"
              type="number"
              min="1"
              aria-label="Item quantity"
              @change="emit('setQuantity', item, Number(($event.target as HTMLInputElement).value))"
              class="w-7 text-center text-xs font-semibold text-gray-900 focus:outline-none dark:text-white"
            />
            <button
              type="button"
              class="flex h-6 w-6 items-center justify-center text-gray-500 hover:text-primary"
              @click="emit('quantity', item, 1)"
            >
              <FeatherIcon name="plus" size="11" />
            </button>
          </div>

          <!-- Item Actions -->
          <button
            type="button"
            class="text-gray-400 hover:text-primary"
            title="Edit item specs"
            @click="emit('edit', item)"
          >
            <FeatherIcon name="edit" size="13" />
          </button>
          <button
            type="button"
            class="text-gray-400 hover:text-danger"
            title="Delete item"
            @click="emit('remove', item.id)"
          >
            <FeatherIcon name="trash-2" size="13" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modifiers Bar: Hold / Void / Tax / Shipping / Discount -->
    <div class="border-t border-gray-100 p-3 dark:border-gray-800">
      <div class="grid grid-cols-2 gap-2 mb-2">
        <button
          type="button"
          class="flex items-center justify-center gap-1 rounded-lg bg-blue-50 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
          @click="emit('hold')"
        >
          <FeatherIcon name="pause" size="13" />
          <span>Hold Order</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-1 rounded-lg bg-rose-50 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
          @click="emit('clear')"
        >
          <FeatherIcon name="trash-2" size="13" />
          <span>Void</span>
        </button>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          class="flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          @click="emit('tax')"
        >
          <FeatherIcon name="percent" size="12" />
          <span>Tax ({{ taxRate }}%)</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          @click="emit('shipping')"
        >
          <FeatherIcon name="truck" size="12" />
          <span>Shipping</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          @click="emit('discount')"
        >
          <FeatherIcon name="tag" size="12" />
          <span>Discount</span>
        </button>
      </div>
    </div>

    <!-- Calculations & Checkout Button -->
    <div class="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
      <div class="mb-3 space-y-1 text-xs">
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Sub Total:</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ formatRupiah(subtotal) }}</span>
        </div>
        <div v-if="discountAmount > 0" class="flex justify-between text-emerald-600">
          <span>Discount:</span>
          <span>-{{ formatRupiah(discountAmount) }}</span>
        </div>
        <div v-if="shippingCost > 0" class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping:</span>
          <span>{{ formatRupiah(shippingCost) }}</span>
        </div>
        <div v-if="taxRate > 0" class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax ({{ taxRate }}%):</span>
          <span>{{ formatRupiah(taxAmount) }}</span>
        </div>
        <div
          class="flex justify-between border-t border-gray-200 pt-1 text-sm font-bold dark:border-gray-700"
        >
          <span class="text-gray-900 dark:text-white">Total Payable:</span>
          <span class="text-primary">{{ formatRupiah(totalPayable) }}</span>
        </div>
      </div>

      <button
        type="button"
        :disabled="cart.length === 0"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-50"
        @click="emit('payment')"
      >
        <FeatherIcon name="credit-card" size="16" />
        <span>Payment Total {{ formatRupiah(totalPayable) }}</span>
      </button>
    </div>
  </div>
</template>
