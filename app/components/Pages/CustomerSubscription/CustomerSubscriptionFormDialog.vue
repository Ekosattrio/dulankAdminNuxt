<script setup lang="ts">
import type { CustomerSubscriptionItem, SubscribePayload } from '#server/types/customer-subscription'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: CustomerSubscriptionItem | null
  customers: { label: string; value: string }[]
  busy?: boolean
}>()

const emit = defineEmits<{ close: []; submit: [payload: SubscribePayload] }>()

const TIERS = ['Basic', 'Advanced', 'Enterprise']
const CYCLES = ['30 Days', '365 Days']
const METHODS = ['Credit Card', 'Debit Card', 'Paypal', 'Bank Transfer', 'Cash']

const form = reactive<SubscribePayload>({
  customerId: '',
  plan: 'Basic',
  planTier: 'Basic',
  billingCycle: '30 Days',
  paymentMethod: 'Credit Card',
  amount: 0,
  createdDate: new Date().toISOString().slice(0, 10),
  expiringOn: '',
  status: 'Paid',
})

const errorMessage = ref('')

watch(
  () => [props.open, props.item] as const,
  ([open, item]) => {
    if (!open) return
    Object.assign(form, item
      ? {
          customerId: item.customerId,
          plan: item.plan ?? 'Basic',
          planTier: (item.planTier as SubscribePayload['planTier']) ?? 'Basic',
          billingCycle: (item.billingCycle as SubscribePayload['billingCycle']) ?? '30 Days',
          paymentMethod: item.paymentMethod ?? 'Credit Card',
          amount: item.amount,
          createdDate: item.createdDate ?? new Date().toISOString().slice(0, 10),
          expiringOn: item.expiringOn ?? '',
          status: (item.status as SubscribePayload['status']) ?? 'Unpaid',
        }
      : {
          customerId: props.customers[0]?.value ?? '',
          plan: 'Basic',
          planTier: 'Basic',
          billingCycle: '30 Days',
          paymentMethod: 'Credit Card',
          amount: 0,
          createdDate: new Date().toISOString().slice(0, 10),
          expiringOn: '',
          status: 'Paid',
        })
    errorMessage.value = ''
  },
  { immediate: true },
)

function submit() {
  if (!form.customerId) return void (errorMessage.value = 'Pilih pelanggan terlebih dahulu')
  if (!form.amount || form.amount <= 0) return void (errorMessage.value = 'Nominal wajib lebih dari 0')
  if (form.status === 'Paid' && !form.expiringOn) return void (errorMessage.value = 'Tanggal kedaluwarsa wajib diisi untuk status Paid')
  errorMessage.value = ''
  emit('submit', { ...form })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Subscription' : 'Berlanggankan Pelanggan'" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Pelanggan<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.customerId" :class="formControlClass" :disabled="!!item" required>
            <option value="">Pilih Pelanggan</option>
            <option v-for="customer in customers" :key="customer.value" :value="customer.value">{{ customer.label }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Plan</label>
        <div :class="modalFormInputColClass"><input v-model="form.plan" :class="formControlClass" placeholder="mis. Advanced" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tier</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.planTier" :class="formControlClass">
            <option v-for="tier in TIERS" :key="tier" :value="tier">{{ tier }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Billing Cycle</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.billingCycle" :class="formControlClass">
            <option v-for="cycle in CYCLES" :key="cycle" :value="cycle">{{ cycle }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Metode Pembayaran</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.paymentMethod" :class="formControlClass">
            <option v-for="method in METHODS" :key="method" :value="method">{{ method }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nominal (Rp)<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model.number="form.amount" :class="formControlClass" type="number" min="1" required /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tanggal Mulai</label>
        <div :class="modalFormInputColClass"><input v-model="form.createdDate" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tanggal Kedaluwarsa</label>
        <div :class="modalFormInputColClass"><input v-model="form.expiringOn" :class="formControlClass" type="date" /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <label class="flex min-h-9 items-center gap-2 text-sm">
            <input v-model="form.status" type="checkbox" true-value="Paid" false-value="Unpaid" class="size-4 accent-primary" />{{ form.status }}
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