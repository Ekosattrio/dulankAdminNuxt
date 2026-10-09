<script setup lang="ts">
import type { Purchase, PurchaseFormData, PurchaseOrderItem } from '#server/types/purchase'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formatNumber } from '~/composables/useFormatters'
import {
  formControlClass,
  modalFormLabelClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  purchaseData: Purchase | null
  supplierOptions?: string[]
  catalogItems?: { product: string; price: number; unit: string }[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: PurchaseFormData]
}>()

const form = ref<PurchaseFormData>({
  supplier: '',
  date: '',
  status: 'Ordered',
  paymentStatus: 'Unpaid',
  shippingCost: 0,
  paid: 0,
  notes: '',
  items: [],
})

const errorMessage = ref('')

const unitOptions = ['Lembar', 'Kg', 'Botol', 'Roll', 'Pcs', 'Box', 'Ream', 'Meter']

watch(
  () => props.purchaseData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        noPurchase: val.noPurchase,
        date: val.date,
        supplier: val.supplier,
        status: val.status,
        paymentStatus: val.paymentStatus,
        shippingCost: val.shippingCost || 0,
        paid: val.paid || 0,
        notes: val.notes || '',
        items: val.items && val.items.length > 0
          ? val.items.map(i => ({ ...i }))
          : [{ name: val.product || '', qty: 1, unit: 'Pcs', price: val.amount || 0 }],
      }
    } else {
      const today = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      form.value = {
        supplier: props.supplierOptions?.[0] || 'PT Kertas Jaya',
        date: today,
        status: 'Ordered',
        paymentStatus: 'Unpaid',
        shippingCost: 0,
        paid: 0,
        notes: '',
        items: [
          { name: '', qty: 1, unit: 'Pcs', price: 0 }
        ],
      }
    }
    errorMessage.value = ''
  },
  { immediate: true }
)

function addItem() {
  form.value.items.push({
    name: '',
    qty: 1,
    unit: 'Pcs',
    price: 0,
  })
}

function removeItem(index: number) {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

function onSelectCatalogItem(itemIndex: number, event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value
  const found = props.catalogItems?.find(c => c.product === selectedName)
  if (found) {
    form.value.items[itemIndex].name = found.product
    form.value.items[itemIndex].price = found.price
    form.value.items[itemIndex].unit = found.unit
  }
}

const subTotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0)
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

  const validItems = form.value.items.filter(i => i.name.trim() !== '')
  if (validItems.length === 0) {
    errorMessage.value = 'Please add at least one product with name'
    return
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    items: validItems,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Purchase Order' : 'Add New Purchase'"
    wide
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
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

      <!-- Items Table -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Products / Order Items
          </label>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-300"
            @click="addItem"
          >
            <FeatherIcon name="plus" size="12" />
            Add Item
          </button>
        </div>

        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 min-w-[240px]">Product Name</th>
                <th class="px-3 py-2 text-center font-semibold text-gray-600 dark:text-gray-300 w-24">Qty</th>
                <th class="px-3 py-2 text-center font-semibold text-gray-600 dark:text-gray-300 w-36">Unit</th>
                <th class="px-3 py-2 text-right font-semibold text-gray-600 dark:text-gray-300 w-48">Price (IDR)</th>
                <th class="px-2 py-2 text-center w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              <tr v-for="(item, idx) in form.items" :key="idx">
                <td class="p-2">
                  <div class="space-y-1">
                    <input
                      v-model="item.name"
                      type="text"
                      placeholder="e.g. Kertas Art Paper 150gr"
                      :class="[formControlClass, 'py-1.5 text-xs']"
                      required
                    />
                    <!-- Quick pick from catalog items if available -->
                    <select
                      v-if="catalogItems && catalogItems.length > 0"
                      class="text-[11px] text-gray-500 bg-transparent border-0 underline cursor-pointer p-0"
                      @change="onSelectCatalogItem(idx, $event)"
                    >
                      <option value="">Or select from catalog...</option>
                      <option v-for="c in catalogItems" :key="c.product" :value="c.product">
                        {{ c.product }} (Rp {{ formatNumber(c.price) }})
                      </option>
                    </select>
                  </div>
                </td>
                <td class="p-2 w-24">
                  <input
                    v-model.number="item.qty"
                    type="number"
                    min="1"
                    :class="[formControlClass, 'py-1.5 text-xs text-center font-medium']"
                    required
                  />
                </td>
                <td class="p-2 w-36">
                  <select
                    v-model="item.unit"
                    :class="[formControlClass, 'py-1.5 text-xs min-w-[110px]']"
                  >
                    <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
                  </select>
                </td>
                <td class="p-2 w-48">
                  <CurrencyInput
                    v-model="item.price"
                    thousand-separator="."
                    align="right"
                    size="sm"
                    input-class="py-1 text-xs text-right font-medium min-w-[140px]"
                    :disabled="busy"
                  />
                </td>
                <td class="p-2 text-center w-12">
                  <button
                    v-if="form.items.length > 1"
                    type="button"
                    class="text-rose-500 hover:text-rose-700 p-1"
                    @click="removeItem(idx)"
                  >
                    <FeatherIcon name="trash-2" size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Calculations & Notes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes / Catatan
          </label>
          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="Catatan pembelian, syarat pengiriman, dll..."
            :class="formControlClass"
            :disabled="busy"
          />
        </div>

        <div class="space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700 text-xs">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Sub Total:</span>
            <span class="font-semibold">Rp {{ formatNumber(subTotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tax (PPN 11%):</span>
            <span class="font-semibold">Rp {{ formatNumber(taxAmount) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-400">Biaya Kirim (Shipping):</span>
            <div class="w-36">
              <CurrencyInput
                v-model="form.shippingCost"
                thousand-separator="."
                align="right"
                size="sm"
                input-class="py-1 text-right text-xs"
                :disabled="busy"
              />
            </div>
          </div>
          <div class="flex justify-between text-sm font-bold border-t pt-2 dark:border-gray-700 text-gray-900 dark:text-white">
            <span>Grand Total:</span>
            <span>Rp {{ formatNumber(grandTotal) }}</span>
          </div>
          <div class="flex items-center justify-between border-t pt-2 dark:border-gray-700">
            <span class="font-medium text-emerald-600">Nominal Bayar (Paid):</span>
            <div class="w-36">
              <CurrencyInput
                v-model="form.paid"
                thousand-separator="."
                align="right"
                size="sm"
                input-class="py-1 text-right text-xs font-bold text-emerald-600"
                :disabled="busy"
              />
            </div>
          </div>
          <div class="flex justify-between font-bold" :class="dueAmount > 0 ? 'text-rose-600' : 'text-gray-500'">
            <span>Sisa Hutang (Due):</span>
            <span>Rp {{ formatNumber(dueAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          :disabled="busy"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/90 focus:outline-hidden disabled:opacity-50"
          :disabled="busy"
        >
          <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          {{ isEdit ? 'Update Purchase' : 'Save Purchase' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
