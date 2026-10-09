<script setup lang="ts">
import type { Order, OrderStatus } from '#server/types/order'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  order: Order | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [status: OrderStatus]
}>()

const statusOptions: OrderStatus[] = ['Complete', 'Waiting', 'Processing', 'Cancel']
const selectedStatus = ref<OrderStatus>('Waiting')

watch(
  () => props.order,
  (val) => {
    if (val) {
      selectedStatus.value = val.status || 'Waiting'
    }
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit', selectedStatus.value)
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Update Order Status"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Order Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="selectedStatus" :class="formControlClass">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none disabled:opacity-50"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
