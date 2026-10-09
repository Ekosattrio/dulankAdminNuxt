<script setup lang="ts">
import type { Discount, DiscountFormData, DiscountPlan } from '#server/types/promo'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import {
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  formControlClass
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  discount: Discount | null
  plans?: DiscountPlan[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: DiscountFormData]
}>()

const isEdit = computed(() => Boolean(props.discount?.id))
const title = computed(() => (isEdit.value ? 'Edit Discount' : 'Add Discount'))

const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const form = ref<DiscountFormData>({
  name: '',
  value: 0,
  type: 'Percentage',
  discountPlanId: 'DP001',
  discountPlanName: 'Standard Plan',
  validFrom: new Date().toISOString().split('T')[0] || '',
  validTill: new Date().toISOString().split('T')[0] || '',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  products: 'All Products',
  status: 'Active'
})

watch(
  () => props.discount,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        value: val.value,
        type: val.type,
        discountPlanId: val.discountPlanId || 'DP001',
        discountPlanName: val.discountPlanName,
        validFrom: val.validFrom,
        validTill: val.validTill,
        days: [...(val.days || [])],
        products: val.products,
        used: val.used,
        status: val.status
      }
    } else {
      form.value = {
        name: '',
        value: 0,
        type: 'Percentage',
        discountPlanId: props.plans?.[0]?.id || 'DP001',
        discountPlanName: props.plans?.[0]?.planName || 'Standard Plan',
        validFrom: new Date().toISOString().split('T')[0] || '',
        validTill: new Date().toISOString().split('T')[0] || '',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        products: 'All Products',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function onPlanChange(event: Event) {
  const planId = (event.target as HTMLSelectElement).value
  form.value.discountPlanId = planId
  const found = props.plans?.find(p => p.id === planId)
  if (found) {
    form.value.discountPlanName = found.planName
  }
}

function toggleDay(day: string) {
  const current = form.value.days || []
  if (current.includes(day)) {
    form.value.days = current.filter(d => d !== day)
  } else {
    form.value.days = [...current, day]
  }
}

function handleSubmit() {
  if (!form.value.name.trim()) return
  emit('save', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="title"
    size="lg"
    :busy="busy"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4 p-6">
      <!-- Discount Name -->
      <div :class="modalFormRowClass">
        <label for="discount-name" :class="modalFormLabelClass">
          Discount Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="discount-name"
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Weekend Deal"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Discount Plan -->
      <div :class="modalFormRowClass">
        <label for="discount-plan" :class="modalFormLabelClass">
          Discount Plan <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="discount-plan"
            :value="form.discountPlanId"
            :class="formControlClass"
            @change="onPlanChange"
          >
            <option
              v-for="plan in (plans || [{ id: 'DP001', planName: 'Standard Plan' }, { id: 'DP002', planName: 'Membership' }])"
              :key="plan.id"
              :value="plan.id"
            >
              {{ plan.planName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Applicable For -->
      <div :class="modalFormRowClass">
        <label for="discount-products" :class="modalFormLabelClass">
          Applicable For <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="discount-products"
            v-model="form.products"
            :class="formControlClass"
          >
            <option value="All Products">All Products</option>
            <option value="Specific Products">Specific Products</option>
          </select>
        </div>
      </div>

      <!-- Valid Dates (Row with 2 cols in input area) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Validity Period <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="valid-from" class="mb-1 block text-[11px] text-gray-500">Valid From</label>
              <input
                id="valid-from"
                v-model="form.validFrom"
                type="date"
                required
                :class="formControlClass"
              />
            </div>
            <div>
              <label for="valid-till" class="mb-1 block text-[11px] text-gray-500">Valid Till</label>
              <input
                id="valid-till"
                v-model="form.validTill"
                type="date"
                required
                :class="formControlClass"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Discount Type & Value -->
      <div :class="modalFormRowClass">
        <label for="discount-type" :class="modalFormLabelClass">
          Discount Type & Value <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-3">
            <select
              id="discount-type"
              v-model="form.type"
              :class="formControlClass"
            >
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat Amount</option>
            </select>
            <div>
              <CurrencyInput
                v-if="form.type === 'Flat'"
                v-model="form.value"
                placeholder="0"
              />
              <div v-else class="relative">
                <input
                  id="discount-value"
                  v-model.number="form.value"
                  type="number"
                  min="1"
                  max="100"
                  required
                  placeholder="e.g. 15"
                  :class="formControlClass"
                />
                <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Valid on Following Days -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Valid on Days <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <div class="flex flex-wrap gap-2 pt-1">
            <button
              v-for="day in allDays"
              :key="day"
              type="button"
              class="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition"
              :class="
                form.days?.includes(day)
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
              "
              @click="toggleDay(day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label for="discount-status" :class="modalFormLabelClass">
          Status <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            id="discount-status"
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
          {{ busy ? 'Saving...' : isEdit ? 'Update Discount' : 'Create Discount' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

