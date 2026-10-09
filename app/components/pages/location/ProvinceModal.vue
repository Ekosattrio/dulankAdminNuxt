<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Province, ProvinceFormData } from '#server/types/location'
import SalesDialog from '~/components/sales/SalesDialog.vue'

const props = defineProps<{
  open: boolean
  isEdit?: boolean
  provinceData?: Province | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: ProvinceFormData): void
}>()

const form = ref<ProvinceFormData>({
  id: '',
  name: '',
  code: '',
  status: 'Active'
})

const errors = ref<{ name?: string }>({})

watch(
  () => props.provinceData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        code: val.code || '',
        status: val.status || 'Active'
      }
    } else {
      form.value = {
        id: '',
        name: '',
        code: '',
        status: 'Active'
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

function handleSubmit() {
  errors.value = {}
  if (!form.value.name.trim()) {
    errors.value.name = 'Province name is required'
    return
  }

  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Province' : 'Add New Province'"
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Province Name -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Province Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="e.g. Jawa Barat, DKI Jakarta"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Province Code -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Code / ISO (Optional)
        </label>
        <input
          v-model="form.code"
          type="text"
          placeholder="e.g. JB, JKT, DIY"
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
        <span v-else>{{ isEdit ? 'Update Province' : 'Save Province' }}</span>
      </button>
    </template>
  </SalesDialog>
</template>
