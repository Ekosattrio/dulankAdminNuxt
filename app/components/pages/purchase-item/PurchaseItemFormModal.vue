<script setup lang="ts">
import type { PurchaseItem, PurchaseItemFormData } from '#server/types/purchase-item'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  itemData: PurchaseItem | null
  categoryOptions: string[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: PurchaseItemFormData]
}>()

const unitOptions = ['Lembar', 'Botol', 'Pcs', 'Roll', 'Ream', 'Kg', 'Pack', 'Box', 'Liter', 'Meter']

const form = ref<PurchaseItemFormData>({
  category: '',
  product: '',
  merk: '',
  price: 0,
  unit: 'Pcs',
  description: '',
})

const errorMessage = ref('')

watch(
  () => props.itemData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        category: val.category,
        product: val.product,
        merk: val.merk || '',
        price: val.price,
        unit: val.unit || 'Pcs',
        description: val.description || '',
      }
    } else {
      form.value = {
        category: props.categoryOptions[0] || 'Kertas & Bahan Baku Cetak',
        product: '',
        merk: '',
        price: 0,
        unit: 'Pcs',
        description: '',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true }
)

// Also set fallback category when options are available and category is empty
watch(
  () => props.categoryOptions,
  (opts) => {
    if (!form.value.category && opts.length > 0) {
      form.value.category = opts[0]
    }
  }
)

function handleSubmit() {
  if (!form.value.product?.trim()) {
    errorMessage.value = 'Item Name is required'
    return
  }
  if (!form.value.category) {
    errorMessage.value = 'Please select a Category'
    return
  }
  if (form.value.price < 0) {
    errorMessage.value = 'Price must be greater than or equal to 0'
    return
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    product: form.value.product.trim(),
    merk: form.value.merk?.trim() || '',
    description: form.value.description?.trim() || '',
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Purchase Item' : 'Add Purchase Item'"
    size="lg"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Error banner if validation fails -->
      <div
        v-if="errorMessage"
        class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
      >
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Category -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.category"
            :class="formControlClass"
            :disabled="busy"
            required
          >
            <option value="" disabled>Select category</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Product / Item Name -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Item Name <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.product"
            type="text"
            placeholder="e.g. Art Paper 150gr"
            :class="formControlClass"
            :disabled="busy"
            required
          />
        </div>

        <!-- Merk / Brand -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Merk / Brand
          </label>
          <input
            v-model="form.merk"
            type="text"
            placeholder="e.g. Paperline / Roland"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>

        <!-- Unit -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unit <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="form.unit"
            :class="formControlClass"
            :disabled="busy"
            required
          >
            <option v-for="u in unitOptions" :key="u" :value="u">
              {{ u }}
            </option>
          </select>
        </div>

        <!-- Price -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (IDR) <span class="text-rose-500">*</span>
          </label>
          <CurrencyInput
            v-model="form.price"
            prefix="Rp"
            thousand-separator="."
            align="left"
            placeholder="0"
            :disabled="busy"
          />
        </div>

        <!-- Description -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Additional specs or details..."
            :class="formControlClass"
            :disabled="busy"
          />
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
          {{ isEdit ? 'Update Item' : 'Save Item' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
