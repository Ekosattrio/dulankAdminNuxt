<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Regency, RegencyFormData, Province } from '#server/types/location'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

const props = defineProps<{
  open: boolean
  isEdit?: boolean
  regencyData?: Regency | null
  provinces: Province[]
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: RegencyFormData): void
}>()

const form = ref<RegencyFormData>({
  id: '',
  provinceId: '',
  province: '',
  name: '',
  type: 'Kota',
  status: 'Active'
})

const errors = ref<{ name?: string; province?: string }>({})

watch(
  () => props.regencyData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        provinceId: val.provinceId,
        province: val.province,
        name: val.name,
        type: val.type || 'Kota',
        status: val.status || 'Active'
      }
    } else {
      const defaultProv = props.provinces[0]
      form.value = {
        id: '',
        provinceId: defaultProv?.id || '',
        province: defaultProv?.name || '',
        name: '',
        type: 'Kota',
        status: 'Active'
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

function onProvinceChange(event: Event) {
  const selectedName = (event.target as HTMLSelectElement).value
  const found = props.provinces.find((p) => p.name === selectedName)
  form.value.province = selectedName
  form.value.provinceId = found ? found.id : ''
}

function handleSubmit() {
  errors.value = {}
  if (!form.value.province.trim()) {
    errors.value.province = 'Please select a province'
    return
  }
  if (!form.value.name.trim()) {
    errors.value.name = 'Regency / City name is required'
    return
  }

  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Regency / City' : 'Add New Regency / City'"
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

      <!-- Regency / City Name -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Regency / City Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="e.g. Bandung, Bogor, Jakarta Selatan"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Type (Kota / Kabupaten) -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Type
        </label>
        <div class="flex items-center gap-4 mt-1">
          <label class="inline-flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            <input v-model="form.type" type="radio" value="Kota" class="text-primary focus:ring-primary" />
            <span>Kota</span>
          </label>
          <label class="inline-flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            <input v-model="form.type" type="radio" value="Kabupaten" class="text-primary focus:ring-primary" />
            <span>Kabupaten</span>
          </label>
        </div>
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
        <span v-else>{{ isEdit ? 'Update Regency' : 'Save Regency' }}</span>
      </button>
    </template>
  </SalesDialog>
</template>
