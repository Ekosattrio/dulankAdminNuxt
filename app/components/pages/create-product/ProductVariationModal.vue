<script setup lang="ts">
import type { ProductVariant } from '#server/types/product'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  variant?: ProductVariant | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: {
    quantity: number
    price: number
    quantityAlert?: number
    taxType?: string
    discountType?: string
    discountValue?: number
  }]
}>()

const form = reactive({
  quantity: 1,
  price: 0,
  quantityAlert: 10,
  taxType: 'Direct',
  discountType: 'Percentage',
  discountValue: 0,
})

watch(
  () => props.variant,
  (v) => {
    if (v) {
      form.quantity = v.quantity || 1
      form.price = v.price || 0
    }
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit', {
    quantity: form.quantity,
    price: form.price,
    quantityAlert: form.quantityAlert,
    taxType: form.taxType,
    discountType: form.discountType,
    discountValue: form.discountValue,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Add / Edit Variation"
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Quantity</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.quantity"
            type="number"
            min="0"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Price (IDR)</label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.price"
            thousand-separator=","
            required
            :disabled="busy"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Quantity Alert</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.quantityAlert"
            type="number"
            min="0"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tax Type</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.taxType" :class="formControlClass">
            <option value="Direct">Direct</option>
            <option value="Indirect">Indirect</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Discount Type</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.discountType" :class="formControlClass">
            <option value="Percentage">Percentage</option>
            <option value="Fixed">Fixed Amount</option>
            <option value="Early Payment">Early Payment</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Discount Value</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.discountValue"
            type="number"
            min="0"
            :class="formControlClass"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
        >
          Submit
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
