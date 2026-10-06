<script setup lang="ts">
import type { PurchaseOrder, PurchaseOrderFormData, PurchaseOrderItem } from '#server/types/purchase-order'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatNumber } from '~/composables/useFormatters'
import {
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  formControlClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  orderData?: PurchaseOrder | null
  supplierOptions: string[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [form: PurchaseOrderFormData]
}>()

const form = reactive<PurchaseOrderFormData>({
  supplier: '',
  noPurchase: '',
  noPO: '',
  date: '',
  created: 'Sales Staff',
  poStatus: 'Sent',
  goodsStatus: 'Pending',
  goodsDate: '',
  goodsBy: 'Admin',
  termOfPayment: '30 Days',
  deliveryDate: '',
  deliveryAddress: 'Gudang Percetakan Dulank, Karawang',
  vendorReff: '',
  taxRate: 0.11,
  items: []
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.isEdit && props.orderData) {
        form.id = props.orderData.id
        form.noPO = props.orderData.noPO
        form.noPurchase = props.orderData.noPurchase
        form.supplier = props.orderData.supplier
        form.date = props.orderData.date
        form.created = props.orderData.created
        form.poStatus = props.orderData.poStatus
        form.goodsStatus = props.orderData.goodsStatus
        form.goodsDate = props.orderData.goodsDate
        form.goodsBy = props.orderData.goodsBy
        form.termOfPayment = props.orderData.termOfPayment || '30 Days'
        form.deliveryDate = props.orderData.deliveryDate || props.orderData.date
        form.deliveryAddress = props.orderData.deliveryAddress || 'Gudang Percetakan Dulank, Karawang'
        form.vendorReff = props.orderData.vendorReff || ''
        form.taxRate = props.orderData.taxRate ?? 0.11
        form.items = props.orderData.items ? JSON.parse(JSON.stringify(props.orderData.items)) : []
      } else {
        const today = new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        form.id = undefined
        form.noPO = ''
        form.noPurchase = ''
        form.supplier = props.supplierOptions[0] || 'PT Kertas Jaya'
        form.date = today
        form.created = 'Sales Staff'
        form.poStatus = 'Sent'
        form.goodsStatus = 'Pending'
        form.goodsDate = ''
        form.goodsBy = 'Admin'
        form.termOfPayment = '30 Days'
        form.deliveryDate = today
        form.deliveryAddress = 'Gudang Percetakan Dulank, Karawang'
        form.vendorReff = ''
        form.taxRate = 0.11
        form.items = [
          { name: 'Kertas Art Paper 150gsm', qty: 10, unit: 'Ream', price: 150000 }
        ]
      }
    }
  },
  { immediate: true }
)

function addItem() {
  form.items.push({
    name: '',
    qty: 1,
    unit: 'Ream',
    price: 0
  })
}

function removeItem(idx: number) {
  form.items.splice(idx, 1)
}

const subTotal = computed(() => {
  return form.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0)
})

const taxAmount = computed(() => {
  return Math.round(subTotal.value * (form.taxRate || 0))
})

const totalAmount = computed(() => {
  return subTotal.value + taxAmount.value
})

function handleSubmit() {
  emit('submit', {
    ...form,
    amount: totalAmount.value,
    taxRate: Number(form.taxRate ?? 0),
    items: form.items
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    wide
    :title="isEdit ? 'Edit Purchase Order' : 'Add New Purchase Order'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6 text-xs">
      <!-- Section 1: Header Details -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">Supplier <span class="text-rose-500">*</span></label>
          <select v-model="form.supplier" :class="formControlClass" required :disabled="busy">
            <option v-for="s in supplierOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">No Purchase (PR)</label>
          <input
            v-model="form.noPurchase"
            type="text"
            placeholder="PR-000001 (auto jika kosong)"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>

        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">PO Number</label>
          <input
            v-model="form.noPO"
            type="text"
            placeholder="PO-000001 (auto)"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>

        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">PO Date</label>
          <input
            v-model="form.date"
            type="text"
            placeholder="DD/MM/YYYY"
            :class="formControlClass"
            required
            :disabled="busy"
          />
        </div>
      </div>

      <!-- Section 2: Items Table -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <h4 class="font-bold text-gray-900 dark:text-gray-100">Order Items</h4>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
            @click="addItem"
            :disabled="busy"
          >
            <FeatherIcon name="plus-circle" :size="14" />
            Add New Item
          </button>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full text-left">
            <thead class="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th class="w-10 px-3 py-2.5 text-center">#</th>
                <th class="px-3 py-2.5 min-w-[200px]">Product Name</th>
                <th class="w-24 px-3 py-2.5 text-center">Qty</th>
                <th class="w-28 px-3 py-2.5 text-center">Unit</th>
                <th class="w-36 px-3 py-2.5 text-right">Price (IDR)</th>
                <th class="w-36 px-3 py-2.5 text-right">Sub Total</th>
                <th class="w-12 px-3 py-2.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in form.items" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-3 py-2 text-center text-gray-400 font-mono">{{ idx + 1 }}</td>
                <td class="px-3 py-2">
                  <input
                    v-model="item.name"
                    type="text"
                    placeholder="Nama barang..."
                    :class="formControlClass"
                    required
                    :disabled="busy"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="item.qty"
                    type="number"
                    min="1"
                    :class="formControlClass"
                    class="text-center"
                    required
                    :disabled="busy"
                  />
                </td>
                <td class="px-3 py-2">
                  <select v-model="item.unit" :class="formControlClass" :disabled="busy">
                    <option value="Ream">Ream</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Box">Box</option>
                    <option value="Kg">Kg</option>
                    <option value="Set">Set</option>
                    <option value="Sak">Sak</option>
                  </select>
                </td>
                <td class="px-3 py-2">
                  <CurrencyInput
                    v-model="item.price"
                    thousand-separator=","
                    required
                    :disabled="busy"
                  />
                </td>
                <td class="px-3 py-2 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">
                  Rp {{ formatNumber(item.qty * item.price) }}
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    v-if="form.items.length > 1"
                    type="button"
                    title="Hapus baris barang ini"
                    class="inline-flex size-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 transition-colors"
                    @click="removeItem(idx)"
                    :disabled="busy"
                  >
                    <FeatherIcon name="trash-2" :size="15" />
                  </button>
                  <span v-else class="text-xs text-gray-300 dark:text-gray-600">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: PO Detail & Summary Calculation -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/40 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <h4 class="font-bold text-gray-900 dark:text-gray-100">PO Specifications</h4>
          
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Vendor Reference</label>
            <div :class="modalFormInputColClass">
              <input v-model="form.vendorReff" type="text" placeholder="No Reff Vendor..." :class="formControlClass" :disabled="busy" />
            </div>
          </div>

          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Term of Payment</label>
            <div :class="modalFormInputColClass">
              <select v-model="form.termOfPayment" :class="formControlClass" :disabled="busy">
                <option value="Cash">Cash</option>
                <option value="14 Days">14 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="45 Days">45 Days</option>
              </select>
            </div>
          </div>

          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Delivery Date</label>
            <div :class="modalFormInputColClass">
              <input v-model="form.deliveryDate" type="text" placeholder="DD/MM/YYYY" :class="formControlClass" :disabled="busy" />
            </div>
          </div>

          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Delivery Address</label>
            <div :class="modalFormInputColClass">
              <textarea v-model="form.deliveryAddress" rows="2" :class="formControlClass" :disabled="busy"></textarea>
            </div>
          </div>
        </div>

        <!-- Totals Card -->
        <div class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <h4 class="font-bold text-gray-900 dark:text-gray-100">Calculation Summary</h4>
          
          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500">Sub Total</span>
            <span class="font-mono font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(subTotal) }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500">Tax</span>
            <div class="flex items-center gap-2">
              <select v-model="form.taxRate" :class="formControlClass" class="w-32 py-1 text-xs" :disabled="busy">
                <option :value="0.11">PPN 11%</option>
                <option :value="0">Tanpa Pajak (0%)</option>
              </select>
              <span class="font-mono font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(taxAmount) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-3 dark:border-gray-800 flex items-center justify-between text-sm">
            <span class="font-bold text-gray-900 dark:text-gray-100">Total (IDR)</span>
            <span class="font-mono text-lg font-bold text-primary">Rp {{ formatNumber(totalAmount) }}</span>
          </div>

          <!-- Goods Receive Info -->
          <div class="mt-4 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800 space-y-3">
            <h5 class="font-bold text-gray-800 dark:text-gray-200">Goods Receiving Info</h5>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block font-medium text-gray-600 dark:text-gray-400">Document Status</label>
                <select v-model="form.poStatus" :class="formControlClass" :disabled="busy">
                  <option value="Sent">Sent</option>
                  <option value="Draft">Draft</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>

              <div>
                <label class="mb-1 block font-medium text-gray-600 dark:text-gray-400">Receiving Status</label>
                <select v-model="form.goodsStatus" :class="formControlClass" :disabled="busy">
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
          :disabled="busy"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : 'Submit Order' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
