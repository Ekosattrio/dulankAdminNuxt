<script setup lang="ts">
import type {
  PaymentFlowFormData,
  PaymentFlowKind,
  PaymentFlowMethod,
  PaymentFlowRecord,
  PaymentTransactionDetail,
} from '#server/types/payment-flow'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  kind: PaymentFlowKind
  mode: 'add' | 'edit' | 'payment'
  record?: PaymentFlowRecord | null
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ close: []; submit: [form: PaymentFlowFormData] }>()
const { formatNumber } = useFormatters()
const showSplit = ref(false)
const form = ref<PaymentFlowFormData>(blankForm())
const title = computed(() => `${props.mode === 'add' ? 'Add' : 'Edit'} Payment ${props.kind === 'inflow' ? 'Inflow' : 'Outflow'}`)
const transactionTotal = computed(() => form.value.transactionDetails?.reduce((sum, item) => sum + Number(item.amount || 0), 0) || form.value.amount)
const maxPayment = computed(() => Math.max(0, transactionTotal.value || form.value.amount || 0))
const paymentAmount = computed({
  get: () => Number(form.value.paymentAmount ?? form.value.amount ?? 0),
  set: (value: number) => {
    form.value.paymentAmount = Math.min(Math.max(Number(value) || 0, 0), maxPayment.value)
  },
})
const paymentMethods = computed<PaymentFlowMethod[]>(() =>
  props.kind === 'inflow' ? ['Cash', 'Transfer', 'Balance'] : ['Cash', 'Transfer'],
)
const bankTransfer = computed(() => {
  form.value.bankTransfer ||= {
    fromBankAccount: 'Cipta Kreasi PT / BRI / 1320009982282',
    toBankWallet: '',
    toAccountName: '',
    toAccountNumber: '',
    reference: '',
  }
  return form.value.bankTransfer
})

watch(
  () => [props.open, props.record, props.mode] as const,
  ([open]) => {
    if (!open) return
    form.value = props.record ? fromRecord(props.record) : blankForm()
    if (props.mode === 'payment' && props.record) {
      form.value.paymentAmount = props.record.status === 'Unpaid' ? props.record.amount : props.record.payments?.[0]?.amount || props.record.amount
    }
    showSplit.value = false
  },
  { immediate: true },
)

watch(maxPayment, (value) => {
  if (paymentAmount.value > value) form.value.paymentAmount = value
})

function blankForm(): PaymentFlowFormData {
  const kind = props?.kind || 'inflow'
  return {
    date: new Date().toLocaleDateString('en-GB'),
    name: '',
    source: kind === 'inflow' ? 'Sales' : 'Expense',
    amount: 0,
    dueDate: new Date().toLocaleDateString('en-GB'),
    method: 'Cash',
    note: '',
    paymentDate: new Date().toLocaleDateString('en-GB'),
    paymentAmount: 0,
    bankTransfer: {
      fromBankAccount: 'Cipta Kreasi PT / BRI / 1320009982282',
      toBankWallet: '',
      toAccountName: '',
      toAccountNumber: '',
      reference: '',
    },
    transactionDetails: defaultDetails(kind),
  }
}

function fromRecord(record: PaymentFlowRecord): PaymentFlowFormData {
  return {
    id: record.id,
    date: record.date,
    refNo: record.refNo,
    name: record.name,
    source: record.source,
    amount: record.amount,
    dueDate: record.dueDate || record.date,
    status: record.status,
    method: record.method === '-' ? 'Cash' : record.method,
    note: record.note,
    paymentDate: record.paymentDate || record.date,
    paymentAmount: record.payments?.[0]?.amount || record.amount,
    bankTransfer: {
      fromBankAccount: record.bankTransfer?.fromBankAccount || 'Cipta Kreasi PT / BRI / 1320009982282',
      toBankWallet: record.bankTransfer?.toBankWallet || '',
      toAccountName: record.bankTransfer?.toAccountName || '',
      toAccountNumber: record.bankTransfer?.toAccountNumber || '',
      reference: record.bankTransfer?.reference || record.refNo,
    },
    transactionDetails: record.transactionDetails ? JSON.parse(JSON.stringify(record.transactionDetails)) : defaultDetails(props.kind),
  }
}

function defaultDetails(kind: PaymentFlowKind): PaymentTransactionDetail[] {
  return kind === 'inflow'
    ? [
        { refNo: 'INC-00002', source: 'Purchase', amount: 750000, status: 'Paid' },
        { refNo: 'INV-00524', source: 'Purchase', amount: 1250000, status: 'Paid' },
        { refNo: 'INV-00789', source: 'Purchase', amount: 250000, status: 'Partial' },
      ]
    : [
        { refNo: 'INC-00002', source: 'Purchase', amount: 3250000, status: 'Paid' },
        { refNo: 'INV-00524', source: 'Purchase', amount: 1250000, status: 'Paid' },
        { refNo: 'INV-00789', source: 'Purchase', amount: 750000, status: 'Partial' },
      ]
}

function submit() {
  emit('submit', {
    ...form.value,
    amount: Number(form.value.amount) || 0,
    paymentAmount: paymentAmount.value,
  })
}
</script>

<template>
  <SalesDialog :open="open" :title="title" :busy="busy" medium @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="space-y-4 text-xs disabled:opacity-60">
        <!-- No Reff (only in edit/payment) -->
        <div v-if="mode !== 'add'" :class="modalFormRowClass">
          <label :class="modalFormLabelClass">No Reff</label>
          <div :class="modalFormInputColClass">
            <input v-model="form.refNo" :class="formControlClass" disabled />
          </div>
        </div>

        <!-- Name -->
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Name <span class="text-red-500">*</span></label>
          <div :class="modalFormInputColClass">
            <input v-model="form.name" :class="formControlClass" placeholder="Enter name" required />
          </div>
        </div>

        <!-- Payment Date -->
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Payment Date</label>
          <div :class="[modalFormInputColClass, 'relative']">
            <input v-model="form.paymentDate" :class="[formControlClass, 'ps-8']" placeholder="Choose Date" />
            <span class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
              <FeatherIcon name="calendar" :size="14" />
            </span>
          </div>
        </div>

        <!-- Split Payment (Inflow only) -->
        <div v-if="kind === 'inflow'" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div class="mb-2 text-end">
            <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline" @click="showSplit = !showSplit">
              Add Split Payment
            </button>
          </div>
          <div v-if="showSplit" class="space-y-3 rounded-md border border-dashed border-[#ff9f43]/40 bg-amber-50/30 p-3 dark:bg-amber-950/20">
            <div v-for="index in 2" :key="index" class="grid gap-2 sm:grid-cols-2">
              <h4 class="text-xs font-semibold text-gray-800 sm:col-span-2 dark:text-gray-200">Payment {{ index }}</h4>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Payment Method</label>
                <select :class="formControlClass">
                  <option>Cash</option>
                  <option>Balance</option>
                  <option>Transfer</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-[11px] text-gray-500">Amount</label>
                <input :class="formControlClass" inputmode="numeric" />
              </div>
            </div>
            <div class="flex justify-between pt-1">
              <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline" @click="showSplit = false">Cancel</button>
              <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline">Add Payment</button>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Payment Method</label>
          <div :class="[modalFormInputColClass, 'flex flex-wrap items-center gap-4']">
            <label v-for="method in paymentMethods" :key="method" class="inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
              <input v-model="form.method" class="size-4 accent-primary" type="radio" :value="method" />
              <span>{{ method === 'Balance' ? 'Balanced' : method }}</span>
            </label>
          </div>
        </div>

        <!-- Bank Details if Transfer -->
        <div v-if="form.method === 'Transfer'" class="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">From Bank Account</label>
            <div :class="modalFormInputColClass">
              <select v-model="bankTransfer.fromBankAccount" :class="formControlClass">
                <option>Cipta Kreasi PT / BRI / 1320009982282</option>
                <option>Dulank Semesta Cida PT / BCA / 1092993242</option>
              </select>
            </div>
          </div>
          <template v-if="kind === 'outflow'">
            <div :class="modalFormRowClass">
              <label :class="modalFormLabelClass">Bank / Wallet</label>
              <div :class="modalFormInputColClass"><input v-model="bankTransfer.toBankWallet" :class="formControlClass" /></div>
            </div>
            <div :class="modalFormRowClass">
              <label :class="modalFormLabelClass">Account Name</label>
              <div :class="modalFormInputColClass"><input v-model="bankTransfer.toAccountName" :class="formControlClass" /></div>
            </div>
            <div :class="modalFormRowClass">
              <label :class="modalFormLabelClass">Account Number</label>
              <div :class="modalFormInputColClass"><input v-model="bankTransfer.toAccountNumber" :class="formControlClass" /></div>
            </div>
            <div :class="modalFormRowClass">
              <label :class="modalFormLabelClass">Reference</label>
              <div :class="modalFormInputColClass"><input v-model="bankTransfer.reference" :class="formControlClass" /></div>
            </div>
          </template>
        </div>

        <!-- Balance display if Balance -->
        <div v-if="form.method === 'Balance'" :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Balance</label>
          <div :class="modalFormInputColClass" class="text-xs font-semibold text-gray-900 dark:text-gray-100">
            1.500.000
          </div>
        </div>

        <!-- Max Payment & Payment Amount -->
        <div class="space-y-1">
          <div class="text-end text-xs font-semibold text-[#ff9f43]">
            Max Payment {{ formatNumber(maxPayment) }}
          </div>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Payment Amount <span class="text-red-500">*</span></label>
            <div :class="modalFormInputColClass">
              <input v-model.number="paymentAmount" :class="formControlClass" inputmode="numeric" />
            </div>
          </div>
        </div>

        <!-- Transaction Details Table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table :class="salesDocumentTable">
            <thead>
              <tr>
                <th>No Reff</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in form.transactionDetails" :key="`${detail.refNo}-${detail.amount}`">
                <td>{{ detail.refNo }}</td>
                <td>{{ detail.source }}</td>
                <td>{{ formatNumber(detail.amount) }}</td>
                <td><SalesStatusBadge :status="detail.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Description -->
        <div class="grid grid-cols-12 items-start gap-3 sm:gap-4">
          <label :class="[modalFormLabelClass, 'pt-1']">Description</label>
          <div :class="modalFormInputColClass">
            <textarea v-model="form.note" class="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" rows="3" placeholder="Enter note here....." />
          </div>
        </div>

        <!-- Footer Buttons (Netlify style: Cancel is dark, Submit is warning) -->
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
            class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
          >
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
