<script setup lang="ts">
import type { VoucherCommand, VoucherOption, VoucherRecord, VoucherStatus, VoucherType } from '#server/types/voucher'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: VoucherRecord | null; products: VoucherOption[]; busy?: boolean }>()
const emit = defineEmits<{ close: []; submit: [payload: VoucherCommand] }>()
const form = reactive({ name: '', code: '', type: 'Fixed' as VoucherType, discount: 0, limit: 0, startDate: '', endDate: '', allProducts: true, oncePerCustomer: false, productId: '', status: 'Active' as VoucherStatus })
const errorMessage = ref('')
watch(() => [props.open, props.item] as const, ([open, item]) => {
  if (!open) return
  Object.assign(form, item ? { name: item.name, code: item.code, type: item.type, discount: item.discount, limit: item.limit, startDate: item.startDate, endDate: item.endDate, allProducts: item.allProducts, oncePerCustomer: item.oncePerCustomer, productId: item.productIds[0] || '', status: item.status } : { name: '', code: '', type: 'Fixed', discount: 0, limit: 0, startDate: '', endDate: '', allProducts: true, oncePerCustomer: false, productId: '', status: 'Active' })
  errorMessage.value = ''
}, { immediate: true })
function submit() {
  if (!form.name.trim() || !form.code.trim()) return void (errorMessage.value = 'Name and code are required')
  if (form.discount <= 0 || (form.type === 'Percentage' && form.discount > 100)) return void (errorMessage.value = 'Enter a valid discount')
  if (form.limit < 0 || !Number.isInteger(form.limit)) return void (errorMessage.value = 'Limit must be a non-negative integer')
  if (form.startDate && form.endDate && form.endDate < form.startDate) return void (errorMessage.value = 'End Date cannot be earlier than Start Date')
  if (!form.allProducts && !form.productId) return void (errorMessage.value = 'Choose a product')
  errorMessage.value = ''
  emit('submit', { name: form.name.trim(), code: form.code.trim(), type: form.type, discount: form.discount, limit: form.limit, startDate: form.startDate, endDate: form.endDate, allProducts: form.allProducts, oncePerCustomer: form.oncePerCustomer, productIds: form.allProducts ? [] : [form.productId], status: form.status })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Coupons' : 'Add Coupons'" medium :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Name</label><div :class="modalFormInputColClass"><input v-model="form.name" :class="formControlClass" required /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Code</label><div :class="modalFormInputColClass"><input v-model="form.code" :class="formControlClass" required /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Type</label><div :class="modalFormInputColClass"><select v-model="form.type" :class="formControlClass"><option>Fixed</option><option>Percentage</option></select></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Discount</label><div :class="modalFormInputColClass"><CurrencyInput v-if="form.type === 'Fixed'" v-model="form.discount" prefix="Rp" :min="0" /><input v-else v-model.number="form.discount" type="number" min="1" max="100" :class="formControlClass" /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Limit</label><div :class="modalFormInputColClass"><QuantityStepper v-model="form.limit" :min="0" /><p class="mt-1 text-xs text-gray-500">0 for Unlimited</p></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Start Date</label><div :class="modalFormInputColClass"><input v-model="form.startDate" type="date" :class="formControlClass" /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">End Date</label><div :class="modalFormInputColClass"><input v-model="form.endDate" type="date" :class="formControlClass" /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">All Products</label><div :class="modalFormInputColClass"><label class="flex min-h-9 items-center gap-2 text-sm"><input v-model="form.allProducts" type="checkbox" class="size-4 accent-primary" />All Products</label></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Once Per Customer</label><div :class="modalFormInputColClass"><label class="flex min-h-9 items-center gap-2 text-sm"><input v-model="form.oncePerCustomer" type="checkbox" class="size-4 accent-primary" />Once Per Customer</label></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Product</label><div :class="modalFormInputColClass"><select v-model="form.productId" :class="formControlClass" :disabled="form.allProducts"><option value="">Choose</option><option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option></select></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Status</label><div :class="modalFormInputColClass"><label class="flex min-h-9 items-center gap-2 text-sm"><input v-model="form.status" type="checkbox" true-value="Active" false-value="Inactive" class="size-4 accent-primary" />{{ form.status }}</label></div></div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"><button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button><button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
    </form>
  </SalesDialog>
</template>
