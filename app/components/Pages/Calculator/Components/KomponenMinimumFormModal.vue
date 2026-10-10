<script setup lang="ts">
import type { KomponenMinimumItem, KomponenMinimumFormData } from '#server/types/calculator-components'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: KomponenMinimumItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: KomponenMinimumFormData): void
}>()

const form = ref<KomponenMinimumFormData>({
  name: '',
  rate: 2000,
  minim: 30000,
  unit: 'Kg',
  status: 'Active'
})

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        rate: val.rate,
        minim: val.minim,
        unit: val.unit,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        rate: 2000,
        minim: 30000,
        unit: 'Kg',
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
    :title="item ? 'Edit Minimum Component' : 'Add Minimum Component'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Service / Finishing Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. Potong, Mobilisasi, Spiral"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tarif Satuan <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.rate"
            :class="formControlClass"
            placeholder="2000"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Minim Biaya (Floor) <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.minim"
            :class="formControlClass"
            placeholder="30000"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Satuan Ukur <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.unit"
            type="text"
            :class="formControlClass"
            required
            placeholder="Kg, Lembar, Cm, Buku"
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

