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

const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const form = reactive({
  name: '',
  planId: '' as string | null,
  applicableFor: 'All Products',
  validFrom: '',
  validTill: '',
  type: 'Percentage' as DiscountType,
  value: 0,
  days: ['Monday'] as string[],
  status: 'Active' as 'Active' | 'Inactive'
})

const errorMessage = ref('')

watch(
  () => [props.open, props.item] as const,
  ([open, item]) => {
    if (!open) return
    if (item) {
      let initialDays: string[] = ['Monday']
      if (Array.isArray(item.days)) {
        initialDays = item.days
      } else if (typeof item.days === 'string' && item.days !== '—') {
        const parsed = item.days.split(',').map(s => s.trim())
        const matched = daysList.filter(d => parsed.some(p => d.toLowerCase().startsWith(p.toLowerCase())))
        if (matched.length > 0) initialDays = matched
      }

      let appFor = 'All Products'
      if (typeof item.products === 'string' && item.products.includes('Specific')) {
        appFor = 'Specific Products'
      }

      Object.assign(form, {
        name: item.name,
        planId: item.planId || (props.plans[0]?.value ?? null),
        applicableFor: appFor,
        validFrom: item.validFrom || '',
        validTill: item.validTill || '',
        type: item.type || 'Percentage',
        value: item.value || 0,
        days: initialDays,
        status: item.status || 'Active'
      })
    } else {
      Object.assign(form, {
        name: '',
        planId: props.plans[0]?.value ?? null,
        applicableFor: 'All Products',
        validFrom: '',
        validTill: '',
        type: 'Percentage',
        value: 0,
        days: ['Monday'],
        status: 'Active'
      })
    }
    errorMessage.value = ''
  },
  { immediate: true }
)

function toggleDay(day: string) {
  const idx = form.days.indexOf(day)
  if (idx > -1) {
    if (form.days.length > 1) form.days.splice(idx, 1)
  } else {
    form.days.push(day)
  }
}

function submit() {
  if (!form.name.trim()) return void (errorMessage.value = 'Discount Name is required')
  if (form.value === undefined || form.value === null || form.value < 0) return void (errorMessage.value = 'Value is required')
  errorMessage.value = ''
  emit('submit', {
    name: form.name.trim(),
    planId: form.planId,
    applicableFor: form.applicableFor,
    validFrom: form.validFrom || null,
    validTill: form.validTill || null,
    type: form.type,
    value: Number(form.value) || 0,
    days: form.days,
    products: [form.applicableFor],
    status: form.status
  })
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
        <label :class="modalFormLabelClass">Discount Plan<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.planId" :class="formControlClass">
            <option :value="null">Select</option>
            <option v-for="plan in plans" :key="plan.value" :value="plan.value">{{ plan.label }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Applicable For<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.applicableFor" :class="formControlClass">
            <option value="All Products">All Products</option>
            <option value="Specific Products">Specific Products</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Valid From<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.validFrom" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Valid Till<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.validTill" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Discount Type<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.type" :class="formControlClass">
            <option value="Percentage">Percentage</option>
            <option value="Fixed">Flat</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Value<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <input v-model.number="form.value" :class="formControlClass" type="number" min="0" required :placeholder="form.type === 'Percentage' ? 'e.g. 10' : 'e.g. 50000'" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Valid on Following Days<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <div class="flex flex-wrap gap-2 pt-1">
            <label
              v-for="day in daysList"
              :key="day"
              class="flex cursor-pointer items-center gap-1.5 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              :class="{ 'border-primary bg-primary/10 font-semibold text-primary dark:border-primary dark:bg-primary/20': form.days.includes(day) }"
            >
              <input
                type="checkbox"
                :checked="form.days.includes(day)"
                class="size-3.5 accent-primary"
                @change="toggleDay(day)"
              />
              {{ day.slice(0, 3) }}
            </label>
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <label class="flex min-h-9 items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="form.status" type="checkbox" true-value="Active" false-value="Inactive" class="size-4 accent-primary" />{{ form.status }}
          </label>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button>
        <button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>