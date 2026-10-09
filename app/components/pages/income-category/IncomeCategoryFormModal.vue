<script setup lang="ts">
import type { IncomeCategoryItem, IncomeCategoryFormData } from '#server/types/income-category'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: IncomeCategoryItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: IncomeCategoryFormData): void
}>()

const form = ref<IncomeCategoryFormData>({
  name: '',
  description: '',
  status: 'Active'
})

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        description: val.description,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        description: '',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? 'Edit Income Category' : 'Add Income Category'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Category Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. Penjualan Jasa Cetak"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Description</label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.description"
            rows="3"
            :class="formControlClass"
            placeholder="Keterangan kategori pemasukan..."
          ></textarea>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
          {{ busy ? 'Saving...' : item ? 'Update Category' : 'Save Category' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

