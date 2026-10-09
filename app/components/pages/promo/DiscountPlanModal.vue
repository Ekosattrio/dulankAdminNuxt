<script setup lang="ts">
import type { DiscountPlan, DiscountPlanFormData } from '#server/types/promo'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  formControlClass
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  plan: DiscountPlan | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: DiscountPlanFormData]
}>()

const isEdit = computed(() => Boolean(props.plan?.id))
const title = computed(() => (isEdit.value ? 'Edit Discount Plan' : 'Add Discount Plan'))

const form = ref<DiscountPlanFormData>({
  planName: '',
  customers: 'All Customers',
  status: 'Active'
})

watch(
  () => props.plan,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        planName: val.planName,
        customers: val.customers,
        status: val.status
      }
    } else {
      form.value = {
        planName: '',
        customers: 'All Customers',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.planName.trim()) return
  emit('save', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="title"
    size="md"
    :busy="busy"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4 p-6">
      <!-- Plan Name -->
      <div :class="modalFormRowClass">
        <label for="plan-name" :class="modalFormLabelClass">
          Plan Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="plan-name"
            v-model="form.planName"
            type="text"
            required
            placeholder="e.g. Standard Plan"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Customers -->
      <div :class="modalFormRowClass">
        <label for="plan-customers" :class="modalFormLabelClass">
          Customer Scope <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="plan-customers"
            v-model="form.customers"
            :class="formControlClass"
          >
            <option value="All Customers">All Customers</option>
            <option value="Members Only">Members Only</option>
            <option value="High-Spending Customers">High-Spending Customers</option>
          </select>
        </div>
      </div>

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label for="plan-status" :class="modalFormLabelClass">
          Status <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="plan-status"
            v-model="form.status"
            :class="formControlClass"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Dialog Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          :disabled="busy"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : isEdit ? 'Update Plan' : 'Create Plan' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

