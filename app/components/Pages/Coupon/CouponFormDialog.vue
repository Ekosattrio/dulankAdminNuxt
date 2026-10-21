<script setup lang="ts">
import type { CouponFormData, CouponItem, CouponType, CouponStatus } from '#server/types/coupon'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: CouponItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: CouponFormData]
}>()

const form = reactive<CouponFormData>({
  id: undefined,
  name: '',
  code: '',
  type: 'Fixed',
  discount: 0,
  limit: 0,
  validFrom: '',
  validUntil: '',
  status: 'Active',
})

const isEditing = computed(() => Boolean(props.item))
const title = computed(() => (isEditing.value ? 'Edit Coupons' : 'Add Coupons'))

watch(
  () => props.open,
  (val) => {
    if (!val) return
    if (props.item) {
      form.id = props.item.id
      form.name = props.item.name
      form.code = props.item.code
      form.type = props.item.type
      form.discount = props.item.discount
      form.limit = props.item.limit
      form.validFrom = props.item.validFrom || ''
      form.validUntil = props.item.validUntil || ''
      form.status = props.item.status
    } else {
      form.id = undefined
      form.name = ''
      form.code = ''
      form.type = 'Fixed'
      form.discount = 0
      form.limit = 0
      form.validFrom = new Date().toISOString().slice(0, 10)
      form.validUntil = ''
      form.status = 'Active'
    }
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.name.trim() || !form.code.trim()) return
  emit('submit', { ...form, code: form.code.trim().toUpperCase() })
}
</script>

<template>
  <SalesDialog :open="open" :title="title" :busy="busy" max-width="max-w-xl" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label for="coupon-name" :class="modalFormLabelClass">Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            id="coupon-name"
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Coupons 21"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-code" :class="modalFormLabelClass">Code <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            id="coupon-code"
            v-model="form.code"
            type="text"
            required
            placeholder="e.g. Christmas"
            :class="[formControlClass, 'uppercase']"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-type" :class="modalFormLabelClass">Type</label>
        <div :class="modalFormInputColClass">
          <select id="coupon-type" v-model="form.type" :class="formControlClass">
            <option value="Fixed">Fixed</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-discount" :class="modalFormLabelClass">
          Discount {{ form.type === 'Percentage' ? '(%)' : '(Rp)' }} <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="coupon-discount"
            v-model.number="form.discount"
            type="number"
            min="0"
            required
            placeholder="e.g. 20000"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-limit" :class="modalFormLabelClass">Limit</label>
        <div :class="modalFormInputColClass">
          <input
            id="coupon-limit"
            v-model.number="form.limit"
            type="number"
            min="0"
            placeholder="0"
            :class="formControlClass"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">0 for Unlimited</p>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-start" :class="modalFormLabelClass">Start Date</label>
        <div :class="modalFormInputColClass">
          <input
            id="coupon-start"
            v-model="form.validFrom"
            type="date"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-end" :class="modalFormLabelClass">End Date</label>
        <div :class="modalFormInputColClass">
          <input
            id="coupon-end"
            v-model="form.validUntil"
            type="date"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="coupon-status" :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select id="coupon-status" v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 text-sm font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="h-9 px-4 text-sm font-medium rounded bg-amber-500 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

