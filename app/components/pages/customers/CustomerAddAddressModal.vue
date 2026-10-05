<script setup lang="ts">
import type { Customer } from '#server/types/customer'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  customer: Customer | null
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
  status: 'Home',
})

const errorMessage = ref('')
const isSubmitting = ref(false)

watch(
  () => [props.open, props.customer],
  ([isOpen, cust]) => {
    if (isOpen && cust) {
      form.value = {
        fullName: (cust as Customer).name || '',
        contact: (cust as Customer).phone || '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        otherDetail: '',
        status: 'Home',
      }
      errorMessage.value = ''
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!props.customer) return
  if (!form.value.fullName.trim()) {
    errorMessage.value = 'Full name is required'
    return
  }
  if (!form.value.detailAddress.trim()) {
    errorMessage.value = 'Address details are required'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const payload = {
      customerId: props.customer.customerId || props.customer.id,
      name: form.value.fullName,
      contact: form.value.contact,
      province: form.value.province,
      city: form.value.city,
      district: form.value.district,
      detailAddress: form.value.detailAddress,
      otherDetail: form.value.otherDetail,
      status: form.value.status,
    }

    const res = await $fetch<any>('/api/address', {
      method: 'POST',
      body: payload,
    })

    emit('success', res?.message || 'Address successfully added')
    emit('close')
  } catch (err: any) {
    errorMessage.value = err?.data?.message || err?.message || 'Failed to save address'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Add New Address"
    medium
    :busy="busy || isSubmitting"
    @close="$emit('close')"
  >
    <form v-if="customer" class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Customer Reference Info (Disabled) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Customer Info</label>
        <div :class="modalFormInputColClass">
          <input
            :value="`${customer.customerId} / ${customer.name} / ${customer.phone}`"
            type="text"
            disabled
            :class="[formControlClass, 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400']"
          />
        </div>
      </div>

      <!-- Full Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Full Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.fullName"
            type="text"
            required
            placeholder="Recipient / Contact name"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Contact Number -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Contact Number</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.contact"
            type="text"
            placeholder="e.g. +6281234567890"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Location: Province & City & District -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Provinsi / Kota</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="form.province"
              type="text"
              placeholder="Provinsi (e.g. DKI Jakarta)"
              :class="formControlClass"
            />
            <input
              v-model="form.city"
              type="text"
              placeholder="Kota (e.g. Jakarta Timur)"
              :class="formControlClass"
            />
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Kecamatan</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.district"
            type="text"
            placeholder="Kecamatan (e.g. Kramat Jati)"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Detail Address -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Alamat Lengkap <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.detailAddress"
            rows="2"
            required
            placeholder="Jalan, No. Rumah, RT/RW, Kelurahan"
            class="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
      </div>

      <!-- Other Detail / Patokan -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Catatan / Patokan</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.otherDetail"
            type="text"
            placeholder="e.g. Pagar hitam, depan masjid"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Address Type / Status -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tipe Alamat</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Home">Home (Rumah)</option>
            <option value="Work">Work / Office (Kantor)</option>
            <option value="Warehouse">Warehouse (Gudang)</option>
            <option value="Other">Other (Lainnya)</option>
          </select>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          :disabled="isSubmitting"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
