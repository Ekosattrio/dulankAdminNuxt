<script setup lang="ts">
import type { Sale, SaleFormData } from '#server/types/sale'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: Sale | null
}>()
const emit = defineEmits<{ close: []; submit: [form: SaleFormData] }>()
const {
  doc,
  items,
  deliveryFee,
  discount,
  voucherMessage,
  legacySubtotal,
  legacyTax,
  subTotal,
  tax,
  total,
  addItem,
  chooseCustomer,
  applyVoucher,
  payload,
} = useSalesEditor(props)
const { formatRupiah } = useFormatters()
const { products } = useProducts()
const productId = useId()
</script>
<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Sales' : 'Add Sales'"
    :busy="busy"
    document
    @close="emit('close')"
  >
    <form @submit.prevent="emit('submit', payload())">
      <p v-if="error" role="alert" class="mb-4 text-xs text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="min-w-0 space-y-5 disabled:opacity-60">
        <div class="grid gap-6 sm:grid-cols-2">
          <SalesCustomerField v-model="doc.contact" @select="chooseCustomer" /><SalesShippingFields
            v-model="doc.shipping"
          />
        </div>
        <label :class="salesLabel"
          >PO<input v-model="doc.po" :class="salesField" placeholder="Invoice No"
        /></label>
        <datalist :id="productId">
          <option v-for="product in products" :key="product.id" :value="product.name" />
        </datalist>
        <div v-for="(item, index) in items" :key="item.id" class="space-y-3 rounded-md bg-primary/5 p-3">
          <div class="grid grid-cols-2 items-end gap-3 lg:grid-cols-12">
            <label :class="salesLabel" class="col-span-2 lg:col-span-4"
              >Product Name<input
                v-model="item.name"
                :list="productId"
                :class="salesField"
                placeholder="Ketik minimal 3 huruf..."
                required
            /></label>
            <label :class="salesLabel" class="lg:col-span-2"
              >Qty
              <div class="flex items-center gap-1">
                <SalesActionButton
                  icon="plus-circle"
                  label="Increase quantity"
                  @click="
                    () => {
                      item.qty++
                      legacyTax = null
                    }
                  "
                /><input
                  v-model.number="item.qty"
                  aria-label="Qty"
                  type="number"
                  min="1"
                  step="1"
                  :class="salesField"
                  class="text-center"
                  required
                  @input="legacyTax = null"
                /><SalesActionButton
                  icon="minus-circle"
                  label="Decrease quantity"
                  :disabled="item.qty <= 1"
                  @click="
                    () => {
                      item.qty--
                      legacyTax = null
                    }
                  "
                /></div
            ></label>
            <label :class="salesLabel" class="lg:col-span-2"
              >Unit<select aria-label="Unit" v-model="item.unit" :class="salesField">
                <option>Ream</option>
                <option>Pcs</option>
                <option>Box</option>
                <option>Set</option>
              </select></label
            >
            <label :class="salesLabel" class="lg:col-span-2"
              >Price (IDR)<CurrencyInput
                v-model="item.price"
                thousand-separator="."
                :min="0"
                required
                @update:model-value="legacyTax = null"
            /></label>
            <label :class="salesLabel" class="lg:col-span-2"
              >Amount (IDR)<input :value="formatRupiah(item.qty * item.price)" :class="salesField" readonly
            /></label>
          </div>
          <div class="flex items-end gap-3">
            <label :class="salesLabel" class="flex-1"
              >Description:<textarea v-model="item.specs" :class="salesField" rows="2" /></label
            ><SalesActionButton icon="trash-2" label="Remove product" @click="items.splice(index, 1)" />
          </div>
        </div>
        <label v-if="!items.length && legacySubtotal" :class="salesLabel"
          >Sub Total<CurrencyInput v-model="legacySubtotal" thousand-separator="." :min="0"
        /></label>
        <button type="button" class="inline-flex items-center gap-2 text-xs text-primary" @click="addItem">
          <FeatherIcon name="plus-circle" :size="14" />add New blank
        </button>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="space-y-2">
            <label :class="salesLabel"
              >Voucher
              <div class="flex gap-2">
                <input v-model="doc.voucher" aria-label="Voucher" :class="salesField" /><button
                  type="button"
                  :class="salesPrimaryButton"
                  @click="applyVoucher"
                >
                  Apply
                </button>
              </div></label
            >
            <p v-if="voucherMessage" role="status" class="text-xs text-gray-500">{{ voucherMessage }}</p>
            <label v-if="discount" :class="salesLabel"
              >Discount (IDR)<input :value="discount" :class="salesField" readonly
            /></label>
          </div>
          <label :class="salesLabel"
            >Shipping Costs<CurrencyInput
              v-model="deliveryFee"
              thousand-separator="."
              :min="0"
              @update:model-value="legacyTax = null"
          /></label>
          <label :class="salesLabel"
            >Tax<select
              aria-label="Tax"
              v-model.number="doc.taxRate"
              :class="salesField"
              @change="legacyTax = null"
            >
              <option :value="0">No Tax</option>
              <option :value="11">Ppn 11% ({{ formatRupiah(tax) }})</option>
              <option :value="12">Ppn 12% ({{ formatRupiah(tax) }})</option>
            </select></label
          >
        </div>
        <label :class="salesLabel">Notes<textarea v-model="doc.notes" :class="salesField" rows="2" /></label>
        <div class="flex justify-end gap-6 text-sm font-semibold">
          <span>Grand Total (IDR)</span><span>{{ formatRupiah(total) }}</span>
        </div>
        <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button type="button" :class="salesSecondaryButton" @click="emit('close')">Cancel</button
          ><button type="submit" :class="salesPrimaryButton" :disabled="!isEdit && !items.length">
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
