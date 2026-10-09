<script setup lang="ts">
import type { PaperItem, PaperItemFormData } from '#server/types/paper-shop'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  item: PaperItem
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PaperItemFormData): void
}>()

const activeEditTab = ref<'detail' | 'advance'>('detail')

const name = ref(props.item.name || '')
const merk = ref(props.item.merk || '')
const price = ref(props.item.price || 6500)
const unitPrice = ref(props.item.unitPrice || 'Pcs')
const gramature = ref(props.item.gsm || 180)

const editPaperWidth = ref(props.item.paperWidth || 75)
const editPaperHeight = ref(props.item.paperHeight || 108)
const currentStock = ref(props.item.stock ?? 150)
const addStockVal = ref<number | undefined>(undefined)
const minOrderVal = ref(props.item.minOrder || '')
const stepOrderVal = ref(props.item.stepOrder || '')
const minTransactionVal = ref<number | undefined>(props.item.minTransaction ?? 10000)
const isActiveStatus = ref(props.item.status === 'Active')

// Parse dimensions if not explicit
if (!props.item.paperWidth && props.item.paperSize && props.item.paperSize.includes('x')) {
  const cleaned = props.item.paperSize.replace(/[^0-9x.]/gi, '')
  const parts = cleaned.split('x')
  editPaperWidth.value = parseFloat(parts[0] || '75') || 75
  editPaperHeight.value = parseFloat(parts[1] || '108') || 108
}

function handleSubmit() {
  if (!name.value.trim()) return

  const paperSize = `${editPaperWidth.value}x${editPaperHeight.value} cm`
  emit('submit', {
    id: props.item.id,
    groupId: props.item.groupId,
    name: name.value.trim(),
    merk: merk.value.trim(),
    price: price.value,
    priceType: props.item.priceType,
    unitPrice: unitPrice.value,
    gsm: gramature.value,
    paperSize,
    paperWidth: editPaperWidth.value,
    paperHeight: editPaperHeight.value,
    stock: currentStock.value,
    addStock: addStockVal.value,
    unitStock: unitPrice.value === 'Kilogram' ? 'Kg' : 'Lembar',
    minOrder: minOrderVal.value,
    stepOrder: stepOrderVal.value,
    minTransaction: minTransactionVal.value,
    status: isActiveStatus.value ? 'Active' : 'Deactive'
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Tabs Header -->
    <div class="flex border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        class="px-5 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer"
        :class="
          activeEditTab === 'detail'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
        "
        @click="activeEditTab = 'detail'"
      >
        Paper Detail
      </button>
      <button
        type="button"
        class="px-5 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer"
        :class="
          activeEditTab === 'advance'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
        "
        @click="activeEditTab = 'advance'"
      >
        Advance Setting
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 pt-2">
      <!-- Tab 1: Detail -->
      <div v-show="activeEditTab === 'detail'" class="space-y-3">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Paper Name <span class="text-rose-500">*</span></label>
          <div :class="modalFormInputColClass">
            <input v-model="name" type="text" :class="formControlClass" required />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Merk <span class="text-rose-500">*</span></label>
          <div :class="modalFormInputColClass">
            <input v-model="merk" type="text" :class="formControlClass" required />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Price <span class="text-rose-500">*</span></label>
          <div :class="modalFormInputColClass">
            <CurrencyInput v-model="price" placeholder="6.500" />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Price Unit</label>
          <div :class="modalFormInputColClass">
            <select v-model="unitPrice" :class="formControlClass">
              <option value="Pcs">Pcs</option>
              <option value="Kilogram">Kilogram</option>
              <option value="Lembar">Lembar</option>
              <option value="Rim">Rim</option>
            </select>
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Gramature</label>
          <div :class="modalFormInputColClass">
            <input v-model.number="gramature" type="number" :class="formControlClass" />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Paper Width</label>
          <div :class="modalFormInputColClass">
            <input v-model.number="editPaperWidth" type="number" step="0.1" :class="formControlClass" />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Paper Height</label>
          <div :class="modalFormInputColClass">
            <input v-model.number="editPaperHeight" type="number" step="0.1" :class="formControlClass" />
          </div>
        </div>
      </div>

      <!-- Tab 2: Advance Setting -->
      <div v-show="activeEditTab === 'advance'" class="space-y-4">
        <!-- Update Stock Box -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 p-4 space-y-3">
          <h6 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Update Stock</h6>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Current Stock</label>
            <div :class="modalFormInputColClass">
              <input :value="currentStock" type="text" class="bg-gray-100 dark:bg-gray-800" :class="formControlClass" readonly />
            </div>
          </div>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Add Stock</label>
            <div :class="modalFormInputColClass">
              <input v-model.number="addStockVal" type="number" :class="formControlClass" placeholder="e.g. 100 or -50" />
              <small class="text-xs text-gray-500 mt-1 block">Gunakan tanda minus (-) untuk mengurangi stok</small>
            </div>
          </div>
        </div>

        <!-- Order Setting Box -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 p-4 space-y-3">
          <h6 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Settings</h6>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Minimum Order</label>
            <div :class="modalFormInputColClass">
              <input v-model="minOrderVal" type="text" :class="formControlClass" placeholder="e.g. 1 rim or 10 lembar" />
            </div>
          </div>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Step Order</label>
            <div :class="modalFormInputColClass">
              <input v-model="stepOrderVal" type="text" :class="formControlClass" placeholder="e.g. 1 rim or 10 lembar" />
            </div>
          </div>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Minimum Transaction</label>
            <div :class="modalFormInputColClass">
              <CurrencyInput v-model="minTransactionVal" placeholder="10.000" />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-5 rounded-md bg-amber-500 hover:bg-amber-600 text-sm font-semibold text-white shadow disabled:opacity-50 cursor-pointer"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

