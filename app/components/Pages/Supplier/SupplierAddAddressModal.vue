<script setup lang="ts">
import type { Supplier } from '#server/types/supplier'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  supplier: Supplier | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  success: [message: string]
}>()

const form = ref({
  fullName: '',
  contact: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  otherDetail: '',
  status: 'Work',
})

const errorMessage = ref('')
const isSubmitting = ref(false)
const { saveAddress } = useAddress()

watch(
  () => [props.open, props.supplier],
  ([isOpen, supp]) => {
    if (isOpen && supp) {
      form.value = {
        fullName: (supp as Supplier).name || '',
        contact: (supp as Supplier).contact || '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        otherDetail: '',
        status: 'Work',
      }
      errorMessage.value = ''
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!props.supplier) return
  if (!form.value.fullName.trim()) {
    errorMessage.value = 'Supplier name is required'
    return
  }
  if (!form.value.detailAddress.trim()) {
    errorMessage.value = 'Detail address is required'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const payload = {
      customerId: props.supplier.supplierId || props.supplier.id,
      name: form.value.fullName,
      contact: form.value.contact,
      province: form.value.province,
      city: form.value.city,
      district: form.value.district,
      detailAddress: form.value.detailAddress,
      otherDetail: form.value.otherDetail,
      status: form.value.status,
    }

    const res = await saveAddress(payload, 'supplier')

    emit('success', res?.message || 'Supplier address added successfully')
    emit('close')
  } catch (err: unknown) {
    errorMessage.value = salesErrorMessage(err) || 'Failed to save address'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Add Address - Supplier"
    medium
    :busy="isSubmitting || busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
        {{ errorMessage }}
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Supplier ID</label>
        <div :class="modalFormInputColClass">
          <input
            type="text"
            :value="supplier?.supplierId || supplier?.id || ''"
            disabled
            :class="[formControlClass, 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed']"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Supplier / PIC Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Enter name"
            :class="formControlClass"
            required
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Contact Number</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.contact"
            type="text"
            placeholder="Enter contact number"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Province</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.province"
            type="text"
            placeholder="e.g. Jawa Barat, DKI Jakarta"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">City</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.city"
            type="text"
            placeholder="e.g. Kota Bandung, Jakarta Pusat"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">District</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.district"
            type="text"
            placeholder="e.g. Sukajadi, Gambir"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Detail Address <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.detailAddress"
            rows="3"
            placeholder="Enter complete street address, building, floor, etc."
            :class="formControlClass"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Other Detail</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.otherDetail"
            type="text"
            placeholder="e.g. Warehouse Gate 3, Samping kantor pos"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Address Type</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Work">Work / Warehouse / Factory</option>
            <option value="Home">Home / Office</option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="emit('close')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
        :disabled="isSubmitting || busy"
        @click="handleSubmit"
      >
        <span v-if="isSubmitting" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>Save Address</span>
      </button>
    </template>
  </SalesDialog>
</template>
