<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { District, DistrictFormData, Province, Regency } from '#server/types/location'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

const props = defineProps<{
  open: boolean
  isEdit?: boolean
  districtData?: District | null
  provinces: Province[]
  regencies: Regency[]
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: DistrictFormData): void
}>()

const form = ref<DistrictFormData>({
  id: '',
  provinceId: '',
  province: '',
  regencyId: '',
  regency: '',
  name: '',
  postalCode: '',
  status: 'Active'
})

const errors = ref<{ name?: string; province?: string; regency?: string }>({})

// Filter available regencies based on selected province with flexible matching
const availableRegencies = computed(() => {
  if (!form.value.province) return props.regencies
  const pName = form.value.province.trim().toLowerCase()
  const pId = form.value.provinceId

  return props.regencies.filter((r) => {
    if (pId && r.provinceId === pId) return true
    if (!r.province) return false
    const rProv = r.province.trim().toLowerCase()
    if (rProv === pName) return true
    // Flexible matching for DKI Jakarta and DI Yogyakarta aliases
    if (pName.includes('jakarta') && rProv.includes('jakarta')) return true
    if (pName.includes('yogyakarta') && rProv.includes('yogyakarta')) return true
    return false
  })
})

watch(
  () => props.districtData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        provinceId: val.provinceId,
        province: val.province,
        regencyId: val.regencyId,
        regency: val.regency,
        name: val.name,
        postalCode: val.postalCode || '',
        status: val.status || 'Active'
      }
    } else {
      const defaultProv = props.provinces[0]
      const defaultReg = props.regencies.find(
        (r) => defaultProv && (r.provinceId === defaultProv.id || r.province === defaultProv.name)
      ) || props.regencies[0]

      form.value = {
        id: '',
        provinceId: defaultProv?.id || '',
        province: defaultProv?.name || '',
        regencyId: defaultReg?.id || '',
        regency: defaultReg?.name || '',
        name: '',
        postalCode: '',
        status: 'Active'
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

function onProvinceChange(event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value
  const foundProv = props.provinces.find((p) => p.name === selectedName)
  form.value.province = selectedName
  form.value.provinceId = foundProv ? foundProv.id : ''

  // Reset or adjust regency to first match under this province
  const pName = selectedName.trim().toLowerCase()
  const matchingRegs = props.regencies.filter((r) => {
    if (foundProv && r.provinceId === foundProv.id) return true
    if (!r.province) return false
    const rProv = r.province.trim().toLowerCase()
    if (rProv === pName) return true
    if (pName.includes('jakarta') && rProv.includes('jakarta')) return true
    if (pName.includes('yogyakarta') && rProv.includes('yogyakarta')) return true
    return false
  })

  const firstMatch = matchingRegs[0]
  if (firstMatch) {
    form.value.regency = firstMatch.name
    form.value.regencyId = firstMatch.id
  } else {
    form.value.regency = ''
    form.value.regencyId = ''
  }
}

function onRegencyChange(event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value
  const foundReg = props.regencies.find((r) => r.name === selectedName)
  form.value.regency = selectedName
  form.value.regencyId = foundReg ? foundReg.id : ''

  // If province was not set or mismatched, sync with regency's province
  if (foundReg && (!form.value.province || form.value.province !== foundReg.province)) {
    form.value.province = foundReg.province
    form.value.provinceId = foundReg.provinceId
  }
}

function handleSubmit() {
  errors.value = {}
  if (!form.value.province.trim()) {
    errors.value.province = 'Please select a province'
    return
  }
  if (!form.value.regency.trim()) {
    errors.value.regency = 'Please select or enter a regency/city'
    return
  }
  if (!form.value.name.trim()) {
    errors.value.name = 'District name is required'
    return
  }

  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit District / Kecamatan' : 'Add New District / Kecamatan'"
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Province Select -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Province <span class="text-red-500">*</span>
        </label>
        <select
          :value="form.province"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          :class="{ 'border-red-500': errors.province }"
          @change="onProvinceChange"
        >
          <option value="" disabled>Select Province</option>
          <option v-for="prov in provinces" :key="prov.id" :value="prov.name">
            {{ prov.name }}
          </option>
        </select>
        <p v-if="errors.province" class="mt-1 text-xs text-red-500">{{ errors.province }}</p>
      </div>

      <!-- Regency / City Cascading Select -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Regency / City <span class="text-red-500">*</span>
          </label>
          <span v-if="availableRegencies.length > 0" class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            {{ availableRegencies.length }} kota/kabupaten tersedia
          </span>
        </div>

        <select
          v-if="availableRegencies.length > 0"
          :value="form.regency"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          :class="{ 'border-red-500': errors.regency }"
          @change="onRegencyChange"
        >
          <option value="" disabled>Select Regency / City</option>
          <option v-for="reg in availableRegencies" :key="reg.id" :value="reg.name">
            {{ reg.name }} ({{ reg.type || 'Kota' }})
          </option>
        </select>

        <!-- Fallback if no regency registered yet for this province -->
        <div v-else class="space-y-1.5">
          <input
            v-model="form.regency"
            type="text"
            placeholder="Type Regency / City name manually (e.g. Padang, Bukittinggi)"
            class="w-full rounded-md border border-amber-300 bg-amber-50/50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-amber-700/60 dark:bg-amber-950/20 dark:text-white"
            :class="{ 'border-red-500': errors.regency }"
          />
          <p class="text-[11px] text-amber-600 dark:text-amber-400">
            ℹ️ Belum ada daftar master kota untuk provinsi ini di database. Anda dapat mengetik manual di sini atau menambahkannya di menu <strong>Locations > Regency</strong>.
          </p>
        </div>
        <p v-if="errors.regency" class="mt-1 text-xs text-red-500">{{ errors.regency }}</p>
      </div>

      <!-- District Name -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          District Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="e.g. Kebayoran Baru, Lengkong, Sukajadi"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Postal Code -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Postal Code (Optional)
        </label>
        <input
          v-model="form.postalCode"
          type="text"
          placeholder="e.g. 40261, 12110"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          v-model="form.status"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        :disabled="busy"
        class="rounded-md border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        @click="emit('close')"
      >
        Cancel
      </button>
      <button
        type="button"
        :disabled="busy"
        class="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        @click="handleSubmit"
      >
        <span v-if="busy">{{ isEdit ? 'Updating…' : 'Saving…' }}</span>
        <span v-else>{{ isEdit ? 'Update District' : 'Save District' }}</span>
      </button>
    </template>
  </SalesDialog>
</template>
