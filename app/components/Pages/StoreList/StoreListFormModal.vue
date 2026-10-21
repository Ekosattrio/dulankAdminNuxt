<script setup lang="ts">
import type { Store, StoreFormData } from '#server/types/store'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  storeData: Store | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: StoreFormData]
}>()

const { managers } = useMasterOptions()

const statusOptions = ['Active', 'Inactive']

const form = ref<StoreFormData>({
  id: '',
  photo: null,
  storeName: '',
  userName: '',
  managerId: '',
  phone: '',
  email: '',
  address: '',
  status: 'Active',
})

const errorMessage = ref('')

watch(
  () => [props.open, props.storeData] as const,
  ([open, val]) => {
    if (!open) return
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        photo: val.photo || null,
        storeName: val.storeName,
        userName: val.userName,
        managerId: val.managerId || '',
        phone: val.phone || '',
        email: val.email || '',
        address: val.address || '',
        status: val.status || 'Active',
      }
    } else {
      form.value = {
        id: '',
        photo: null,
        storeName: '',
        userName: '',
        managerId: '',
        phone: '',
        email: '',
        address: '',
        status: 'Active',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (props.busy) return
  if (!form.value.storeName.trim()) {
    errorMessage.value = 'Store name is required'
    return
  }
  if (!form.value.managerId) {
    errorMessage.value = 'Manager / Username is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Store Branch' : 'Add New Store Branch'"
    medium
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
        {{ errorMessage }}
      </div>

      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Photo</label><div :class="modalFormInputColClass"><EntityPhotoField v-model="form.photo" :disabled="busy" /></div></div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Store Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.storeName"
            type="text"
            placeholder="e.g. Workshop Karawang Barat"
            :class="formControlClass"
            required
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Manager / User <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.managerId" :class="formControlClass" required>
            <option disabled value="">Pilih penanggung jawab</option>
            <option v-if="form.managerId && !managers.some(manager => String(manager.id) === form.managerId)" :value="form.managerId">{{ storeData?.userName || 'Manager tersimpan' }} (tersimpan)</option>
            <option v-for="manager in managers" :key="manager.id" :value="String(manager.id)">{{ manager.name }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Phone</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.phone"
            type="text"
            placeholder="+62 812..."
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Email</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.email"
            type="email"
            placeholder="branch@example.com"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Address</label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.address"
            rows="2"
            placeholder="Provinsi, Kota, Kecamatan, Jl..."
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
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
        :disabled="busy"
        @click="handleSubmit"
      >
        <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>{{ isEdit ? 'Update Store' : 'Save Store' }}</span>
      </button>
    </template>
  </SalesDialog>
</template>
