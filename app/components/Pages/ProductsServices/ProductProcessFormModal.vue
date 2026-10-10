<script setup lang="ts">
import type { ProductProcessItem, ProductProcessFormData } from '#server/types/product-process'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: ProductProcessItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: ProductProcessFormData): void
}>()

const { products } = useProducts()

const form = ref<ProductProcessFormData>({
  productId: '1',
  processName: 'Printing',
  status: 'Active'
})

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        productId: val.productId || '1',
        processName: val.processName,
        status: val.status
      }
    } else {
      form.value = {
        productId: products.value[0]?.id || '1',
        processName: 'Printing',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.productId || !form.value.processName.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? 'Edit Product Process' : 'Add New Product Process'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Catalog Product <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.productId" :class="formControlClass" required>
            <option v-for="p in products" :key="p.id" :value="p.id">
              {{ p.name }} ({{ p.code }})
            </option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Name of Process <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.processName" :class="formControlClass" required>
            <option value="Printing">Printing</option>
            <option value="Cutting">Cutting</option>
            <option value="Laminating">Laminating</option>
            <option value="Die-Cut">Die-Cut</option>
            <option value="Packaging">Packaging</option>
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
          {{ busy ? 'Saving...' : item ? 'Update Process' : 'Save Process' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

