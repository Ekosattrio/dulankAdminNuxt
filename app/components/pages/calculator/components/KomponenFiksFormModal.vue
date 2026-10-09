<script setup lang="ts">
import type { KomponenFiksItem, KomponenFiksFormData } from '#server/types/calculator-components'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: KomponenFiksItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: KomponenFiksFormData): void
}>()

const form = ref<KomponenFiksFormData>({
  name: '',
  value: 5000,
  unit: 'Jam',
  status: 'Active'
})

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        value: val.value,
        unit: val.unit,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        value: 5000,
        unit: 'Jam',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name.trim() || !form.value.unit.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? 'Edit Fixed Component' : 'Add Fixed Component'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Component Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. Kapasitas Mesin Cetak"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Capacity Value <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.value"
            type="number"
            :class="formControlClass"
            required
            min="0"
            placeholder="5000"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Unit <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.unit"
            type="text"
            :class="formControlClass"
            required
            placeholder="Jam, lbr, pcs, kg"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-4 rounded-md text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-xs disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : item ? 'Update Component' : 'Save Component' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

