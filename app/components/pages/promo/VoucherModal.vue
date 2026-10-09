<script setup lang="ts">
import type { Voucher, VoucherFormData } from '#server/types/promo'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import {
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  formControlClass
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  voucher: Voucher | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: VoucherFormData]
}>()

const isEdit = computed(() => Boolean(props.voucher?.id))
const title = computed(() => (isEdit.value ? 'Edit Voucher' : 'Add New Voucher'))

const form = ref<VoucherFormData>({
  name: '',
  code: '',
  type: 'Fixed',
  discount: 0,
  limit: 50,
  valid: new Date().toISOString().split('T')[0] || '',
  status: 'Active'
})

watch(
  () => props.voucher,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        code: val.code,
        type: val.type,
        discount: val.discount,
        limit: val.limit,
        used: val.used,
        valid: val.valid,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        code: '',
        type: 'Fixed',
        discount: 0,
        limit: 50,
        valid: new Date().toISOString().split('T')[0] || '',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name.trim() || !form.value.code.trim()) return
  emit('save', {
    ...form.value,
    code: form.value.code.trim().toUpperCase()
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="title"
    size="md"
    :busy="busy"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4 p-6">
      <!-- Name -->
      <div :class="modalFormRowClass">
        <label for="voucher-name" :class="modalFormLabelClass">
          Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="voucher-name"
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. New Year Special"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Code -->
      <div :class="modalFormRowClass">
        <label for="voucher-code" :class="modalFormLabelClass">
          Voucher Code <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="voucher-code"
            v-model="form.code"
            type="text"
            required
            placeholder="e.g. NY2026"
            class="uppercase"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Type -->
      <div :class="modalFormRowClass">
        <label for="voucher-type" :class="modalFormLabelClass">
          Type <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="voucher-type"
            v-model="form.type"
            :class="formControlClass"
          >
            <option value="Fixed">Fixed Amount</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>
      </div>

      <!-- Discount Value -->
      <div :class="modalFormRowClass">
        <label for="voucher-discount" :class="modalFormLabelClass">
          Discount Value <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-if="form.type === 'Fixed'"
            v-model="form.discount"
            placeholder="0"
          />
          <div v-else class="relative">
            <input
              id="voucher-discount"
              v-model.number="form.discount"
              type="number"
              min="1"
              max="100"
              required
              placeholder="e.g. 10"
              :class="formControlClass"
            />
            <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">%</span>
          </div>
        </div>
      </div>

      <!-- Limit -->
      <div :class="modalFormRowClass">
        <label for="voucher-limit" :class="modalFormLabelClass">
          Usage Limit <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="voucher-limit"
            v-model.number="form.limit"
            type="number"
            min="1"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Valid Until Date -->
      <div :class="modalFormRowClass">
        <label for="voucher-valid" :class="modalFormLabelClass">
          Valid Until <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="voucher-valid"
            v-model="form.valid"
            type="date"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label for="voucher-status" :class="modalFormLabelClass">
          Status <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="voucher-status"
            v-model="form.status"
            :class="formControlClass"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Dialog Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          :disabled="busy"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : isEdit ? 'Update Voucher' : 'Create Voucher' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

