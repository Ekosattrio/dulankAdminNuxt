<script setup lang="ts">
import type { Product } from '#server/types/product'
import type { Sale, SaleFormData, SaleLineItem } from '#server/types/sale'
import SalesOrderAdjustmentsSection from './SalesOrderAdjustmentsSection.vue'
import SalesOrderItemsSection from './SalesOrderItemsSection.vue'
import SalesOrderPartiesSection from './SalesOrderPartiesSection.vue'
import SalesOrderSummary from './SalesOrderSummary.vue'
import { salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = withDefaults(
  defineProps<{
    open?: boolean
    isEdit?: boolean
    editData?: Sale | null
    busy?: boolean
    error?: string
  }>(),
  { open: true, isEdit: false, editData: null, busy: false, error: '' },
)
const emit = defineEmits<{ cancel: []; submit: [payload: SaleFormData] }>()
const editorProps = {
  get isOpen() {
    return props.open
  },
  get isEdit() {
    return props.isEdit
  },
  get editData() {
    return props.editData
  },
}
const {
  doc,
  items,
  deliveryFee,
  voucherDiscount,
  directDiscount,
  voucherMessage,
  legacyTax,
  subTotal,
  totalBeforeTax,
  tax,
  total,
  addItem,
  chooseCustomer,
  selectProduct,
  applyVoucher,
  payload,
} = useSalesEditor(editorProps)
const { products } = useProducts()
const validationError = ref('')

function removeItem(index: number) {
  items.value.splice(index, 1)
  legacyTax.value = null
}

function selectItemProduct(item: SaleLineItem, product: Product) {
  selectProduct(item, product)
}

function submit() {
  validationError.value = ''
  if (!doc.value.contact.name.trim()) validationError.value = 'Customer is required.'
  else if (!items.value.length) validationError.value = 'At least one product is required.'
  else if (items.value.some((item) => !item.name.trim() || item.qty < 1 || item.price < 0))
    validationError.value = 'Complete every product, quantity, and price.'
  else if (doc.value.taxRate > 0 && !doc.value.transactionCode)
    validationError.value = 'Transaction Code is required when tax is selected.'
  if (!validationError.value) emit('submit', payload())
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <p v-if="error || validationError" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
      {{ error || validationError }}
    </p>
    <fieldset :disabled="busy" class="min-w-0 space-y-6 disabled:opacity-60">
      <SalesOrderPartiesSection v-model:document="doc" @customer-selected="chooseCustomer(doc.contact)" />
      <SalesOrderItemsSection
        v-model="items"
        :products="products"
        :disabled="busy"
        @add="addItem"
        @remove="removeItem"
        @amount-change="legacyTax = null"
        @product-select="selectItemProduct"
      />
      <div class="grid gap-6 border-t border-gray-200 pt-6 lg:grid-cols-12 dark:border-gray-700">
        <SalesOrderAdjustmentsSection
          v-model:document="doc"
          v-model:delivery-fee="deliveryFee"
          v-model:direct-discount="directDiscount"
          class="lg:col-span-7"
          :voucher-message="voucherMessage"
          :disabled="busy"
          @apply-voucher="applyVoucher"
          @amount-change="legacyTax = null"
        />
        <SalesOrderSummary
          class="lg:col-span-5"
          :sub-total="subTotal"
          :voucher="voucherDiscount"
          :shipping-cost="deliveryFee"
          :discount="directDiscount"
          :total-before-tax="totalBeforeTax"
          :tax="tax"
          :grand-total="total"
        />
      </div>
      <div class="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('cancel')">Cancel</button>
        <button type="submit" :class="salesPrimaryButton" :disabled="busy || !items.length">
          {{ busy ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </fieldset>
  </form>
</template>
