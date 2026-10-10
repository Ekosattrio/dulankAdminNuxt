<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '#server/types/paper-shop'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
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

watch(
  () => props.size,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        length: val.length,
        width: val.width,
        unit: val.unit,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        length: 21,
        width: 29.7,
        unit: 'cm',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name.trim()) return
  const dimension = `${form.value.length} x ${form.value.width}`
  emit('submit', { ...form.value, dimension })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="size ? 'Edit Paper Size' : 'Add Paper Size'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Size Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. A4, F4 (Folio), Plano"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Panjang (Length) <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.length"
            type="number"
            step="0.1"
            min="0"
            :class="formControlClass"
            required
            placeholder="e.g. 21"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Lebar (Width) <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.width"
            type="number"
            step="0.1"
            min="0"
            :class="formControlClass"
            required
            placeholder="e.g. 29.7"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Satuan Unit</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.unit" :class="formControlClass">
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="inch">inch</option>
          </select>
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

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-4 rounded-md bg-primary text-sm font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : size ? 'Update Size' : 'Save Size' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

