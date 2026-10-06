<script setup lang="ts">
import type { PurchaseReturn, PurchaseReturnFormData, PurchaseReturnItem } from '#server/types/purchase-return'
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
  returnData?: PurchaseReturn | null
  supplierOptions: string[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [form: PurchaseReturnFormData]
}>()

const form = reactive<PurchaseReturnFormData>({
  supplier: '',
  noPurchase: '',
  noPR: '',
  date: '',
  created: 'Sales Staff',
  status: 'Pending',
  statusBy: 'Admin',
  notes: '',
  paid: 0,
  items: []
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.isEdit && props.returnData) {
        form.id = props.returnData.id
        form.noPR = props.returnData.noPR
        form.noPurchase = props.returnData.noPurchase
        form.supplier = props.returnData.supplier
        form.date = props.returnData.date
        form.created = props.returnData.created
        form.status = props.returnData.status
        form.statusBy = props.returnData.statusBy
        form.notes = props.returnData.notes || ''
        form.paid = props.returnData.paid || 0
        form.items = props.returnData.items ? JSON.parse(JSON.stringify(props.returnData.items)) : []
      } else {
        const today = new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        form.id = undefined
        form.noPR = ''
        form.noPurchase = ''
        form.supplier = props.supplierOptions[0] || 'PT Kertas Jaya'
        form.date = today
        form.created = 'Sales Staff'
        form.status = 'Pending'
        form.statusBy = 'Admin'
        form.notes = ''
        form.paid = 0
        form.items = [
          {
            name: 'Kertas Art Paper 150gsm',
            qty: 10,
            returnQty: 2,
            unit: 'Ream',
            price: 150000,
            amount: 300000,
            reason: 'Kertas cacat / sobek pada kemasan'
          }
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
    returnQty: 1,
    unit: 'Ream',
    price: 0,
    amount: 0,
    reason: ''
  })
}

function removeItem(idx: number) {
  form.items.splice(idx, 1)
}

function updateItemAmount(item: PurchaseReturnItem) {
  item.amount = (Number(item.returnQty) || 0) * (Number(item.price) || 0)
}

const totalReturnAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + (Number(item.amount) || (Number(item.returnQty || 0) * Number(item.price || 0))), 0)
})

const dueAmount = computed(() => {
  return Math.max(0, totalReturnAmount.value - (Number(form.paid) || 0))
})

function handleSubmit() {
  emit('submit', {
    ...form,
    items: form.items
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    document
    :title="isEdit ? 'Edit Purchase Return' : 'Add Purchase Return'"
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
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">No Purchase (Rujukan)</label>
          <input
            v-model="form.noPurchase"
            type="text"
            placeholder="PR-000001 (wajib)"
            :class="formControlClass"
            required
            :disabled="busy"
          />
        </div>

        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">No Return (PRT)</label>
          <input
            v-model="form.noPR"
            type="text"
            placeholder="PRT-0001 (auto)"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>

        <div>
          <label class="mb-1 block font-semibold text-gray-700 dark:text-gray-300">Tanggal Retur</label>
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
          <h4 class="font-bold text-gray-900 dark:text-gray-100">Rincian Barang yang Diretur</h4>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
            @click="addItem"
            :disabled="busy"
          >
            <FeatherIcon name="plus-circle" :size="14" />
            Tambah Barang
          </button>
        </div>

        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full text-left">
            <thead class="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th class="w-10 px-3 py-2.5 text-center">#</th>
                <th class="px-3 py-2.5 min-w-[200px]">Nama Barang</th>
                <th class="w-20 px-3 py-2.5 text-center">Beli</th>
                <th class="w-24 px-3 py-2.5 text-center">Qty Retur</th>
                <th class="w-36 px-3 py-2.5 text-center">Unit</th>
                <th class="w-36 px-3 py-2.5 text-right">Harga (IDR)</th>
                <th class="w-36 px-3 py-2.5 text-right">Sub Total</th>
                <th class="min-w-[180px] px-3 py-2.5">Alasan Retur</th>
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
                    placeholder="1"
                    :disabled="busy"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="item.returnQty"
                    type="number"
                    min="1"
                    :class="formControlClass"
                    class="text-center font-semibold text-rose-600"
                    required
                    :disabled="busy"
                    @input="updateItemAmount(item)"
                  />
                </td>
                <td class="px-3 py-2 w-32">
                  <select v-model="item.unit" :class="[formControlClass, 'min-w-[110px]']" :disabled="busy">
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
                    @update:model-value="updateItemAmount(item)"
                  />
                </td>
                <td class="px-3 py-2 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">
                  Rp {{ formatNumber(item.amount || (item.returnQty * item.price)) }}
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model="item.reason"
                    type="text"
                    placeholder="Alasan cacat/retur..."
                    :class="formControlClass"
                    :disabled="busy"
                  />
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

      <!-- Section 3: Notes & Totals -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/40 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <h4 class="font-bold text-gray-900 dark:text-gray-100">Catatan & Status Retur</h4>
          
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Status Retur</label>
            <div :class="modalFormInputColClass">
              <select v-model="form.status" :class="formControlClass" :disabled="busy">
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded (Dana Kembali)</option>
                <option value="Ordered">Ordered (Menunggu Ganti)</option>
                <option value="Received">Received</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>
          </div>

          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Status By</label>
            <div :class="modalFormInputColClass">
              <input v-model="form.statusBy" type="text" :class="formControlClass" :disabled="busy" />
            </div>
          </div>

          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Keterangan / Notes</label>
            <div :class="modalFormInputColClass">
              <textarea v-model="form.notes" rows="2" placeholder="Catatan kesepakatan retur..." :class="formControlClass" :disabled="busy"></textarea>
            </div>
          </div>
        </div>

        <!-- Totals Card -->
        <div class="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <h4 class="font-bold text-gray-900 dark:text-gray-100">Kalkulasi Pengembalian Dana</h4>
          
          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500">Total Nilai Retur</span>
            <span class="font-mono text-base font-bold text-gray-900 dark:text-gray-100">
              Rp {{ formatNumber(totalReturnAmount) }}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500">Dana Diterima (Refund / Paid)</span>
            <div class="w-40">
              <CurrencyInput
                v-model="form.paid"
                thousand-separator=","
                :disabled="busy"
              />
            </div>
          </div>

          <div class="border-t border-gray-100 pt-3 dark:border-gray-800 flex items-center justify-between text-sm">
            <span class="font-bold text-gray-900 dark:text-gray-100">Sisa Tagihan / Due</span>
            <span class="font-mono text-lg font-bold" :class="dueAmount > 0 ? 'text-amber-500' : 'text-emerald-600'">
              Rp {{ formatNumber(dueAmount) }}
            </span>
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
          {{ busy ? 'Saving...' : 'Submit Return' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
