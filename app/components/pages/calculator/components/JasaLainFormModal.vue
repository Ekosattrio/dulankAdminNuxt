<script setup lang="ts">
import type { JasaLainItem, JasaLainFormData } from '#server/types/calculator-components'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: JasaLainItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: JasaLainFormData): void
}>()

const form = ref<JasaLainFormData>({
  name: '',
  harga: 0,
  minimHarga: 0,
  satuan: 'Kg',
  status: 'Active'
})

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        harga: val.harga,
        minimHarga: val.minimHarga,
        satuan: val.satuan,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        harga: 0,
        minimHarga: 0,
        satuan: 'Kg',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name.trim() || !form.value.satuan.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? 'Edit Komponen Cetak' : 'Add New Komponen Cetak'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama Jasa <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. Potong, Spiral, Mobilisasi"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Harga Satuan <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.harga"
            :class="formControlClass"
            placeholder="0"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Minim Harga (Floor) <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.minimHarga"
            :class="formControlClass"
            placeholder="0"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Satuan <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.satuan" :class="formControlClass" required>
            <option value="Kg">Kg</option>
            <option value="Lembar">Lembar</option>
            <option value="Cm">Cm</option>
            <option value="Pcs">Pcs</option>
            <option value="Roll">Roll</option>
            <option value="Set">Set</option>
            <option value="Buku">Buku</option>
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
          {{ busy ? 'Saving...' : item ? 'Update Jasa' : 'Save Jasa' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

