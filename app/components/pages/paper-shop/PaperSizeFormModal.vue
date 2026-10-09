<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '#server/types/paper-shop'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  size: PaperSize | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PaperSizeFormData): void
}>()

const form = ref<PaperSizeFormData>({
  name: '',
  length: 21,
  width: 29.7,
  unit: 'cm',
  status: 'Active'
})

const isActiveStatus = ref<boolean>(true)

watch(
  () => props.size,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        length: val.length,
        width: val.width,
        unit: val.unit || 'cm',
        status: val.status || 'Active'
      }
      isActiveStatus.value = val.status === 'Active'
    } else {
      form.value = {
        name: '',
        length: 21,
        width: 29.7,
        unit: 'cm',
        status: 'Active'
      }
      isActiveStatus.value = true
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name.trim()) return
  const dimension = `${form.value.length}x${form.value.width}`
  emit('submit', {
    ...form.value,
    dimension,
    status: isActiveStatus.value ? 'Active' : 'Deactive'
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="size ? 'Edit Paper Size' : 'Add New Paper Size'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Choose Unit (Centimeter / Milimeter Radio Pills) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Choose Unit <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
              :class="
                form.unit === 'cm'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-primary'
              "
              @click="form.unit = 'cm'"
            >
              Centimeter
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
              :class="
                form.unit === 'mm'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-primary'
              "
              @click="form.unit = 'mm'"
            >
              Milimeter
            </button>
          </div>
        </div>
      </div>

      <!-- Size Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Size Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. A4, F4 (Folio), A3, Plano"
          />
        </div>
      </div>

      <!-- Paper Size (W and H with prefix input-groups) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Paper Size <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-3">
            <!-- Width -->
            <div class="flex rounded-md shadow-xs">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                W
              </span>
              <input
                v-model.number="form.length"
                type="number"
                step="0.1"
                min="0"
                class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900 focus:border-primary focus:ring-primary h-9"
                required
                placeholder="Length"
              />
            </div>

            <!-- Height -->
            <div class="flex rounded-md shadow-xs">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                H
              </span>
              <input
                v-model.number="form.width"
                type="number"
                step="0.1"
                min="0"
                class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900 focus:border-primary focus:ring-primary h-9"
                required
                placeholder="Width"
              />
            </div>
          </div>
          <span class="text-xs text-gray-500 mt-1 block">Satuan aktif: {{ form.unit }}</span>
        </div>
      </div>

      <!-- Status Toggle -->
      <div class="flex items-center justify-between py-2 border-y border-gray-100 dark:border-gray-800">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
        <label class="inline-flex items-center gap-2 cursor-pointer">
          <input
            v-model="isActiveStatus"
            type="checkbox"
            class="sr-only peer"
          />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
            {{ isActiveStatus ? 'Active' : 'Deactive' }}
          </span>
        </label>
      </div>

      <!-- Footer Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-5 rounded-md bg-amber-500 hover:bg-amber-600 text-sm font-semibold text-white shadow disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
