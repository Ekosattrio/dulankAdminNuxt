<script setup lang="ts">
import type { DiscountFormData, DiscountItem, DiscountType } from '#server/types/discount'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: DiscountItem | null
  plans: { label: string; value: string }[]
  busy?: boolean
}>()

const emit = defineEmits<{ close: []; submit: [payload: DiscountFormData] }>()

const form = reactive<DiscountFormData>({
  name: '',
  planId: null,
  value: 0,
  type: 'Fixed',
  validFrom: null,
  validTill: null,
  status: 'Active',
})

const errorMessage = ref('')

watch(
  () => [props.open, props.item] as const,
  ([open, item]) => {
    if (!open) return
    Object.assign(form, item
      ? { name: item.name, planId: item.planId, value: item.value, type: item.type, validFrom: item.validFrom, validTill: item.validTill, status: item.status }
      : { name: '', planId: null, value: 0, type: 'Fixed' as DiscountType, validFrom: null, validTill: null, status: 'Active' })
    errorMessage.value = ''
  },
  { immediate: true },
)

function submit() {
  if (!form.name.trim()) return void (errorMessage.value = 'Discount Name is required')
  if (!form.value || form.value <= 0) return void (errorMessage.value = 'Value harus lebih dari 0')
  errorMessage.value = ''
  emit('submit', { ...form, name: form.name.trim() })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Discount' : 'Add Discount'" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Discount Name<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.name" :class="formControlClass" required /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Discount Plan</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.planId" :class="formControlClass">
            <option :value="null">Tanpa Plan</option>
            <option v-for="plan in plans" :key="plan.value" :value="plan.value">{{ plan.label }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Type<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <div class="flex gap-3">
            <label class="flex min-h-9 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              <input v-model="form.type" type="radio" value="Fixed" class="accent-primary" /> Fixed (Rp)
            </label>
            <label class="flex min-h-9 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              <input v-model="form.type" type="radio" value="Percentage" class="accent-primary" /> Percentage (%)
            </label>
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Value<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <input v-model.number="form.value" :class="formControlClass" type="number" min="0" required :placeholder="form.type === 'Percentage' ? 'mis. 10' : 'mis. 50000'" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Valid From</label>
        <div :class="modalFormInputColClass"><input v-model="form.validFrom" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Valid Till</label>
        <div :class="modalFormInputColClass"><input v-model="form.validTill" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <label class="flex min-h-9 items-center gap-2 text-sm">
            <input v-model="form.status" type="checkbox" true-value="Active" false-value="Inactive" class="size-4 accent-primary" />{{ form.status }}
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button>
        <button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>