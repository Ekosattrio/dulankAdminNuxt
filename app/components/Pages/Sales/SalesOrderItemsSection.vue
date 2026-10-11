<script setup lang="ts">
import type { SaleLineItem } from '#server/types/sale'
import type { Product } from '#server/types/product'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import QuantityStepper from '~/components/Common/QuantityStepper.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { salesField, salesLabel } from '~/utils/salesUi'

const props = defineProps<{ products: Product[]; disabled?: boolean }>()
const items = defineModel<SaleLineItem[]>({ required: true })
const emit = defineEmits<{
  add: []
  remove: [index: number]
  amountChange: []
  productSelect: [item: SaleLineItem, product: Product]
}>()
const productListId = useId()

function selectProduct(item: SaleLineItem) {
  const product = props.products.find((entry) => entry.name === item.name)
  if (product) emit('productSelect', item, product)
}
</script>

<template>
  <section class="space-y-4" aria-labelledby="sales-items-title">
    <h2 id="sales-items-title" class="app-section-title">Order Items</h2>
    <datalist :id="productListId">
      <option v-for="product in products" :key="product.id" :value="product.name">
        {{ product.code }} · {{ product.unit }}
      </option>
    </datalist>
    <div class="space-y-3">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="rounded-lg border border-primary/15 bg-primary/5 p-3 sm:p-4"
      >
        <div class="grid grid-cols-2 items-start gap-3 lg:grid-cols-12">
          <label :class="salesLabel" class="col-span-2 lg:col-span-4">
            Product Name
            <input
              v-model="item.name"
              :list="productListId"
              :class="salesField"
              placeholder="Ketik minimal 3 huruf..."
              required
              @change="selectProduct(item)"
            />
            <span class="mt-2 block">Description:</span>
            <textarea
              v-model="item.specs"
              :class="salesField"
              rows="2"
              placeholder="Enter description here..."
            />
          </label>
          <label :class="salesLabel" class="lg:col-span-2">
            Qty
            <QuantityStepper
              v-model="item.qty"
              :min="1"
              :disabled="disabled"
              @update:model-value="emit('amountChange')"
            />
          </label>
          <label :class="salesLabel" class="lg:col-span-2">
            Unit
            <select v-model="item.unit" :class="salesField">
              <option>Ream</option>
              <option>Pcs</option>
              <option>Box</option>
              <option>Set</option>
            </select>
          </label>
          <label :class="salesLabel" class="lg:col-span-2">
            Price (IDR)
            <CurrencyInput
              v-model="item.price"
              thousand-separator="."
              :min="0"
              align="right"
              required
              @update:model-value="emit('amountChange')"
            />
          </label>
          <div class="col-span-2 lg:col-span-2">
            <span :class="salesLabel">Amount (IDR)</span>
            <div :class="salesField" class="flex items-center justify-end bg-gray-50 dark:bg-gray-800">
              <CurrencyDisplay :value="item.qty * item.price" align="right" prefix="" />
            </div>
          </div>
        </div>
        <div class="mt-3 flex justify-end">
          <SalesActionButton
            action="delete"
            :label="`Delete Product ${index + 1}`"
            :disabled="disabled"
            @click="emit('remove', index)"
          />
        </div>
      </div>
    </div>
    <button
      type="button"
      class="inline-flex h-9 items-center gap-2 rounded-md border border-primary px-3 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
      :disabled="disabled"
      @click="emit('add')"
    >
      <FeatherIcon name="plus-circle" :size="16" />add New blank
    </button>
  </section>
</template>
