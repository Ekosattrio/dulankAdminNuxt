<script setup lang="ts">
import type { EmployeeItem, EmployeeFormData } from '#server/types/employee'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  employeeData: EmployeeItem | null
  departments: string[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: EmployeeFormData]
}>()

const statusOptions = ['Active', 'Resign', 'Inactive']
const genderOptions = ['Male', 'Female']
const joinChannelOptions = ['Offline', 'Online', 'Referral', 'Walk-in']

const profilePhotoInput = ref<HTMLInputElement | null>(null)
const idPhotoInput = ref<HTMLInputElement | null>(null)

const form = ref<EmployeeFormData>({
  id: '',
  name: '',
  department: 'Produksi',
  address: '',
  detailAddress: '',
  phone: '',
  status: 'Active',
  gender: 'Male',
  dob: '',
  joinDate: '',
  joinChannel: 'Offline',
  contact1Name: '',
  contact1Phone: '',
  contact2Name: '',
  contact2Phone: '',
  email: '',
  avatar: '',
  photoId: '',
})

const errorMessage = ref('')

watch(
  () => props.employeeData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        department: val.department || (props.departments[0] || 'Produksi'),
        address: val.address || '',
        detailAddress: val.detailAddress || '',
        phone: val.phone || '',
        status: val.status || 'Active',
        gender: val.gender || 'Male',
        dob: val.dob || '',
        joinDate: val.joinDate || '',
        joinChannel: val.joinChannel || 'Offline',
        contact1Name: val.contact1Name || '',
        contact1Phone: val.contact1Phone || '',
        contact2Name: val.contact2Name || '',
        contact2Phone: val.contact2Phone || '',
        email: val.email || '',
        avatar: val.avatar || '',
        photoId: val.photoId || '',
      }
    } else {
      const today = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      form.value = {
        id: '',
        name: '',
        department: props.departments[0] || 'Produksi',
        address: '',
        detailAddress: '',
        phone: '',
        status: 'Active',
        gender: 'Male',
        dob: '',
        joinDate: today,
        joinChannel: 'Offline',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        email: '',
        avatar: '',
        photoId: '',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleIdPhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.photoId = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  form.value.avatar = ''
  if (profilePhotoInput.value) profilePhotoInput.value.value = ''
}

function removePhotoId() {
  form.value.photoId = ''
  if (idPhotoInput.value) idPhotoInput.value.value = ''
}

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Employee full name is required'
    return
  }
  if (!form.value.phone.trim()) {
    errorMessage.value = 'Phone number is required'
    return
  }
  if (!form.value.department) {
    errorMessage.value = 'Department is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Employee' : 'Add New Employee'"
    large
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4 max-h-[72vh] overflow-y-auto px-1 pr-2" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
        {{ errorMessage }}
      </div>

      <!-- Photo Upload Section (Matching legacy add-employee.html) -->
      <div class="border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Employee Photos & Verification
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Profile Photo -->
        <div class="flex flex-col gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4 text-center dark:border-gray-700 dark:bg-gray-800/40">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Profile Photo</span>
          
          <div class="flex flex-col items-center justify-center gap-3">
            <div v-if="form.avatar" class="relative">
              <img
                :src="form.avatar"
                alt="Profile Preview"
                class="h-24 w-24 rounded-full border-2 border-primary/30 object-cover shadow-sm"
              >
              <button
                type="button"
                class="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow hover:bg-rose-700"
                title="Remove photo"
                @click="removeAvatar"
              >
                <FeatherIcon name="x" size="14" />
              </button>
            </div>
            <div
              v-else
              class="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white text-gray-400 hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800"
              @click="profilePhotoInput?.click()"
            >
              <FeatherIcon name="user" size="28" />
              <span class="text-[10px] mt-1">Upload Photo</span>
            </div>

            <input
              ref="profilePhotoInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            >

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              @click="profilePhotoInput?.click()"
            >
              <FeatherIcon name="camera" size="13" />
              <span>{{ form.avatar ? 'Change Photo' : 'Choose Photo' }}</span>
            </button>
          </div>
        </div>

        <!-- Photo ID / KTP -->
        <div class="flex flex-col gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-4 text-center dark:border-gray-700 dark:bg-gray-800/40">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Photo ID / KTP</span>
          
          <div class="flex flex-col items-center justify-center gap-3">
            <div v-if="form.photoId" class="relative">
              <img
                :src="form.photoId"
                alt="Photo ID Preview"
                class="h-24 w-36 rounded-lg border-2 border-primary/30 object-cover shadow-sm"
              >
              <button
                type="button"
                class="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow hover:bg-rose-700"
                title="Remove photo ID"
                @click="removePhotoId"
              >
                <FeatherIcon name="x" size="14" />
              </button>
            </div>
            <div
              v-else
              class="flex h-24 w-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-400 hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800"
              @click="idPhotoInput?.click()"
            >
              <FeatherIcon name="file-text" size="28" />
              <span class="text-[10px] mt-1">Upload ID / KTP</span>
            </div>

            <input
              ref="idPhotoInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleIdPhotoUpload"
            >

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              @click="idPhotoInput?.click()"
            >
              <FeatherIcon name="upload" size="13" />
              <span>{{ form.photoId ? 'Change Photo ID' : 'Choose Photo ID' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- General Information Section -->
      <div class="border-b border-gray-200 pb-2 pt-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
        General Information
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Employee ID</label>
        <div :class="modalFormInputColClass">
          <input
            type="text"
            :value="form.id || 'Auto Generated (ST0xx)'"
            disabled
            :class="[formControlClass, 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed']"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Full Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter employee full name"
            :class="formControlClass"
            required
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Email</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.email"
            type="email"
            placeholder="employee@example.com"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Phone Number <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.phone"
            type="text"
            placeholder="+62 812..."
            :class="formControlClass"
            required
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Department <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.department" :class="formControlClass" required>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Gender</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.gender" :class="formControlClass">
            <option v-for="g in genderOptions" :key="g" :value="g">
              {{ g }}
            </option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Date of Birth</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.dob"
            type="text"
            placeholder="DD/MM/YYYY"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Joining Date</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.joinDate"
            type="text"
            placeholder="DD/MM/YYYY"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Join Channel</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.joinChannel" :class="formControlClass">
            <option v-for="ch in joinChannelOptions" :key="ch" :value="ch">
              {{ ch }}
            </option>
          </select>
        </div>
      </div>

      <!-- Address Section -->
      <div class="border-b border-gray-200 pb-2 pt-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Address Information
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Region / Area</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.address"
            type="text"
            placeholder="Provinsi, Kota, Kecamatan"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Detail Address</label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.detailAddress"
            rows="2"
            placeholder="Jalan, RT/RW, No Rumah, Kelurahan"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Emergency Contact Section -->
      <div class="border-b border-gray-200 pb-2 pt-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Emergency Contacts
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Contact Person 1</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              v-model="form.contact1Name"
              type="text"
              placeholder="Name"
              :class="formControlClass"
            >
            <input
              v-model="form.contact1Phone"
              type="text"
              placeholder="Phone"
              :class="formControlClass"
            >
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Contact Person 2</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              v-model="form.contact2Name"
              type="text"
              placeholder="Name"
              :class="formControlClass"
            >
            <input
              v-model="form.contact2Phone"
              type="text"
              placeholder="Phone"
              :class="formControlClass"
            >
          </div>
        </div>
      </div>

      <!-- Status Section -->
      <div class="border-b border-gray-200 pb-2 pt-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Status
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Employment Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option v-for="s in statusOptions" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          :disabled="busy"
          @click="handleSubmit"
        >
          <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>{{ isEdit ? 'Update Employee' : 'Save Employee' }}</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
