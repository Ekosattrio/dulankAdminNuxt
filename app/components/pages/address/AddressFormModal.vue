<script setup lang="ts">
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  addressData: any | null
  activeType: 'customer' | 'supplier'
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: any]
}>()

const form = ref({
  id: '',
  customerId: '',
  name: '',
  contact: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  otherDetail: '',
  status: 'Home',
})

const errorMessage = ref('')

watch(
  () => props.addressData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id || '',
        customerId: val.customerId || val.supplierId || '',
        name: val.name || val.user || '',
        contact: val.contact || val.phone || '',
        province: val.province || '',
        city: val.city || '',
        district: val.district || '',
        detailAddress: val.detailAddress || '',
        otherDetail: val.otherDetail || '',
        status: val.status || 'Home',
      }
    } else {
      form.value = {
        id: '',
        customerId: '',
        name: '',
        contact: '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        otherDetail: '',
        status: 'Home',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Name is required'
    return
  }
  if (!form.value.detailAddress.trim()) {
    errorMessage.value = 'Detail Address is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Address' : 'Add New Address'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Entity Reference ID -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">{{ activeType === 'customer' ? 'Customer ID' : 'Supplier ID' }}</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.customerId"
            type="text"
            placeholder="e.g. ID000001"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Full Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="Recipient / Company Name"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Contact -->
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

      <!-- Province & City -->
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

      <!-- District -->
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
            placeholder="Jalan, Nomor, RT/RW, Kelurahan"
            class="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
      </div>

      <!-- Other Detail -->
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

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status / Tipe</label>
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
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          :disabled="busy"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          :disabled="busy"
        >
          <span v-if="busy">Saving...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
