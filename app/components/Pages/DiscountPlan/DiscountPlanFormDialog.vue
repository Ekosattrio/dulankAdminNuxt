<script setup lang="ts">
import type { DiscountPlanCommand, DiscountPlanCustomerSegment, DiscountPlanStatus, DiscountPlanView } from '#server/types/discount-plan'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: DiscountPlanView | null; customers: DiscountPlanCustomerSegment[]; addedCustomerSegmentId?: string; busy?: boolean }>()
const emit = defineEmits<{ close: []; submit: [payload: DiscountPlanCommand]; addCustomer: [] }>()
const form = reactive({ name: '', customerSegmentId: '', status: 'Active' as DiscountPlanStatus })
const errorMessage = ref('')
watch(() => [props.open, props.item] as const, ([open, item]) => {
  if (!open) return
  Object.assign(form, item ? { name: item.name, customerSegmentId: item.customerSegmentId, status: item.status } : { name: '', customerSegmentId: props.customers[0]?.id || '', status: 'Active' })
  errorMessage.value = ''
}, { immediate: true })
watch(() => props.addedCustomerSegmentId, (id) => { if (id && props.open) form.customerSegmentId = id })
function submit() {
  if (!form.name.trim()) return void (errorMessage.value = 'Plan Name is required')
  if (!form.customerSegmentId) return void (errorMessage.value = 'Customer is required')
  errorMessage.value = ''
  emit('submit', { name: form.name.trim(), customerSegmentId: form.customerSegmentId, status: form.status })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Discount Plan' : 'Add Discount Plan'" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Plan Name<span class="ml-1 text-rose-600">*</span></label><div :class="modalFormInputColClass"><input v-model="form.name" :class="formControlClass" required /></div></div>
      <div :class="modalFormRowClass">
        <div :class="modalFormLabelClass" class="flex items-center justify-between gap-2"><label>Customer<span class="ml-1 text-rose-600">*</span></label><button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" @click="emit('addCustomer')"><FeatherIcon name="plus-circle" :size="14" />Add New</button></div>
        <div :class="modalFormInputColClass"><select v-model="form.customerSegmentId" :class="formControlClass" required><option value="">Select</option><option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.name }}</option></select></div>
      </div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Status</label><div :class="modalFormInputColClass"><label class="flex min-h-9 items-center gap-2 text-sm"><input v-model="form.status" type="checkbox" true-value="Active" false-value="Inactive" class="size-4 accent-primary" />{{ form.status }}</label></div></div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"><button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button><button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
    </form>
  </SalesDialog>
</template>
