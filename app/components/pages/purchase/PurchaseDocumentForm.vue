<script setup lang="ts">
import type { PurchaseFormData } from '#server/types/purchase'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formatNumber } from '~/composables/useFormatters'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  modelValue: PurchaseFormData
  supplierOptions?: string[]
  catalogItems?: { product: string; price: number; unit: string }[]
  busy?: boolean
  isEdit?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PurchaseFormData]
  submit: [formData: PurchaseFormData]
  cancel: []
}>()

const form = ref<PurchaseFormData>({ ...props.modelValue })
const errorMessage = ref('')
const unitOptions = ['Lembar', 'Kg', 'Botol', 'Roll', 'Pcs', 'Box', 'Ream', 'Meter']

watch(
  () => props.modelValue,
  (val) => {
    form.value = { ...val }
  },
  { deep: true }
)

function addItem() {
  if (!form.value.items) form.value.items = []
  form.value.items.push({
    name: '',
    qty: 1,
    unit: 'Pcs',
    price: 0,
  })
}

function removeItem(index: number) {
  if (form.value.items && form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

function onSelectCatalogItem(itemIndex: number, event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value
  const found = props.catalogItems?.find(c => c.product === selectedName)
  if (found && form.value.items?.[itemIndex]) {
    form.value.items[itemIndex].name = found.product
    form.value.items[itemIndex].price = found.price
    form.value.items[itemIndex].unit = found.unit
  }
}

const subTotal = computed(() => {
  return (form.value.items || []).reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0)
})

const taxAmount = computed(() => {
  return Math.round(subTotal.value * 0.11)
})

const grandTotal = computed(() => {
  return subTotal.value + taxAmount.value + Number(form.value.shippingCost || 0)
})

const dueAmount = computed(() => {
  return Math.max(0, grandTotal.value - Number(form.value.paid || 0))
})

function handleSubmit() {
  if (!form.value.supplier?.trim()) {
    errorMessage.value = 'Supplier is required'
    return
  }

  const validItems = (form.value.items || []).filter(i => i.name.trim() !== '')
  if (validItems.length === 0) {
    errorMessage.value = 'Please add at least one product with name'
    return
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    items: validItems,
    amount: grandTotal.value,
    due: dueAmount.value
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Error banner -->
    <div
      v-if="errorMessage"
      class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      {{ errorMessage }}
    </div>

    <!-- Top Form Controls -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Supplier -->
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Supplier <span class="text-rose-500">*</span>
        </label>
        <input
          v-if="!supplierOptions || supplierOptions.length === 0"
          v-model="form.supplier"
          type="text"
          placeholder="e.g. PT Kertas Jaya"
          :class="formControlClass"
          :disabled="busy"
          required
        />
        <select
          v-else
          v-model="form.supplier"
          :class="formControlClass"
          :disabled="busy"
          required
        >
          <option value="" disabled>Select Supplier</option>
          <option v-for="s in supplierOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>

      <!-- Date -->
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Purchase Date <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.date"
          type="text"
          placeholder="DD/MM/YYYY"
          :class="formControlClass"
          :disabled="busy"
          required
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Order Status <span class="text-rose-500">*</span>
        </label>
        <select
          v-model="form.status"
          :class="formControlClass"
          :disabled="busy"
        >
          <option value="Ordered">Ordered</option>
          <option value="Received">Received</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Product Line Items Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
        <h5 class="text-xs font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
          <FeatherIcon name="package" :size="13" class="text-primary" />
          <span>Product Line Items</span>
        </h5>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          :disabled="busy"
          @click="addItem"
        >
          <FeatherIcon name="plus" :size="13" />
          <span>Add Item</span>
        </button>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="p-2.5 min-w-[200px]">Product / Material</th>
              <th class="p-2.5 w-24 text-center">Qty</th>
              <th class="p-2.5 w-28 text-center">Unit</th>
              <th class="p-2.5 w-36 text-right">Price (IDR)</th>
              <th class="p-2.5 w-36 text-right">Subtotal</th>
              <th class="p-2.5 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(item, idx) in form.items" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
              <td class="p-2">
                <div class="space-y-1">
                  <input
                    v-model="item.name"
                    type="text"
                    placeholder="Enter product or raw material name"
                    :class="formControlClass"
                    :disabled="busy"
                    required
                  />
                  <select
                    v-if="catalogItems && catalogItems.length > 0"
                    class="text-[11px] text-gray-500 bg-transparent border-0 p-0 cursor-pointer focus:ring-0"
                    @change="onSelectCatalogItem(idx, $event)"
                  >
                    <option value="">-- Quick select from catalog --</option>
                    <option v-for="c in catalogItems" :key="c.product" :value="c.product">
                      {{ c.product }} (Rp {{ formatNumber(c.price) }}/{{ c.unit }})
                    </option>
                  </select>
                </div>
              </td>
              <td class="p-2">
                <input
                  v-model.number="item.qty"
                  type="number"
                  min="1"
                  step="any"
                  :class="[formControlClass, 'text-center']"
                  :disabled="busy"
                  required
                />
              </td>
              <td class="p-2">
                <select
                  v-model="item.unit"
                  :class="[formControlClass, 'text-center']"
                  :disabled="busy"
                >
                  <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
                </select>
              </td>
              <td class="p-2">
                <CurrencyInput
                  v-model="item.price"
                  placeholder="0"
                  align="right"
                />
              </td>
              <td class="p-2 text-right font-medium text-gray-800 dark:text-gray-200">
                Rp {{ formatNumber((Number(item.qty || 0)) * (Number(item.price || 0))) }}
              </td>
              <td class="p-2 text-center">
                <button
                  type="button"
                  class="text-gray-400 hover:text-rose-600 transition disabled:opacity-30"
                  :disabled="busy || (form.items && form.items.length <= 1)"
                  @click="removeItem(idx)"
                >
                  <FeatherIcon name="trash-2" :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Financial Summary Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <!-- Left side: Payment Status & Notes -->
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
            <select v-model="form.paymentStatus" :class="formControlClass" :disabled="busy">
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Already Paid</label>
            <CurrencyInput
              v-model="form.paid"
              placeholder="0"
              align="right"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes / Remarks</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Add internal notes or delivery terms..."
            :class="[formControlClass, 'h-auto py-1.5 resize-none']"
            :disabled="busy"
          ></textarea>
        </div>
      </div>

      <!-- Right side: Calculations Card -->
      <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/40 space-y-2 text-xs">
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal Products</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">Rp {{ formatNumber(subTotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>PPN 11% (Estimated)</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">Rp {{ formatNumber(taxAmount) }}</span>
        </div>
        <div class="flex items-center justify-between text-gray-600 dark:text-gray-400 pt-1">
          <span>Shipping / Delivery Cost</span>
          <div class="w-36">
            <CurrencyInput
              v-model="form.shippingCost"
              placeholder="0"
              align="right"
            />
          </div>
        </div>
        <div class="flex justify-between text-xs font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2 text-sm">
          <span>Grand Total</span>
          <span class="text-primary font-mono">Rp {{ formatNumber(grandTotal) }}</span>
        </div>
        <div class="flex justify-between text-xs text-rose-600 dark:text-rose-400 font-medium">
          <span>Remaining Due</span>
          <span>Rp {{ formatNumber(dueAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
      <button
        type="button"
        class="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        :disabled="busy"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-6 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
        :disabled="busy"
      >
        {{ busy ? 'Saving...' : isEdit ? 'Update Purchase' : 'Save Purchase' }}
      </button>
    </div>
  </form>
</template>

