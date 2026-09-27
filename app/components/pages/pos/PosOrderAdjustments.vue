<script setup lang="ts">
const taxModalOpen = defineModel<boolean>('taxOpen', { required: true })
const shippingModalOpen = defineModel<boolean>('shippingOpen', { required: true })
const discountModalOpen = defineModel<boolean>('discountOpen', { required: true })
const taxRate = defineModel<number>('tax', { required: true })
const shippingCost = defineModel<number>('shipping', { required: true })
const discountAmount = defineModel<number>('discount', { required: true })
</script>
<template>
  <SalesDialog :open="taxModalOpen" title="Order Tax" @close="taxModalOpen = false">
    <div class="p-5 text-xs space-y-3">
      <label class="font-semibold text-gray-700 dark:text-gray-300">Select Tax Rate</label>
      <select
        v-model="taxRate"
        class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option :value="0">No Tax (0%)</option>
        <option :value="10">Standard 10%</option>
        <option :value="11">PPN 11%</option>
        <option :value="15">Luxury 15%</option>
      </select>
      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="rounded bg-primary px-4 py-1.5 font-semibold text-white"
          @click="taxModalOpen = false"
        >
          Apply
        </button>
      </div>
    </div>
  </SalesDialog>

  <SalesDialog :open="shippingModalOpen" title="Shipping Cost" @close="shippingModalOpen = false">
    <div class="p-5 text-xs space-y-3">
      <label class="font-semibold text-gray-700 dark:text-gray-300">Enter Shipping Fee</label>
      <input
        v-model.number="shippingCost"
        type="number"
        min="0"
        class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="rounded bg-primary px-4 py-1.5 font-semibold text-white"
          @click="shippingModalOpen = false"
        >
          Apply
        </button>
      </div>
    </div>
  </SalesDialog>

  <SalesDialog :open="discountModalOpen" title="Order Discount" @close="discountModalOpen = false">
    <div class="p-5 text-xs space-y-3">
      <label class="font-semibold text-gray-700 dark:text-gray-300">Discount Amount</label>
      <input
        v-model.number="discountAmount"
        type="number"
        min="0"
        class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="rounded bg-primary px-4 py-1.5 font-semibold text-white"
          @click="discountModalOpen = false"
        >
          Apply
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
