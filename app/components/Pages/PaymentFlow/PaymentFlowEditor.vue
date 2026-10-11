<script setup lang="ts">
import type { PaymentFlowFormData, PaymentFlowKind, PaymentFlowRecord, PaymentSplitEntry, PaymentTransactionDetail } from '#server/types/payment-flow'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import PaymentMethodFields from './PaymentMethodFields.vue'
import PaymentSplitEditor from './PaymentSplitEditor.vue'
import PaymentTransactionDetailsTable from './PaymentTransactionDetailsTable.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

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
function updateBankTransfer(value: NonNullable<PaymentFlowFormData['bankTransfer']>) {
  form.value.bankTransfer = value
}
const splitPayments = computed({
  get: () => form.value.splitPayments || [],
  set: (value: PaymentSplitEntry[]) => {
    form.value.splitPayments = value
  },
})

watch(
  () => [props.open, props.record, props.mode] as const,
  ([open]) => {
    if (!open) return
    form.value = props.record ? fromRecord(props.record) : blankForm()
    if (props.mode === 'payment' && props.record) {
      const paidAmount = props.record.payments?.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) || 0
      form.value.paymentAmount = props.record.status === 'Unpaid' ? props.record.amount : paidAmount || props.record.amount
    }
    showSplit.value = Boolean(form.value.splitPayments?.length)
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
    amount: defaultDetails(kind).reduce((sum, item) => sum + item.amount, 0),
    dueDate: new Date().toLocaleDateString('en-GB'),
    method: kind === 'inflow' ? 'Balance' : 'Cash',
    note: '',
    paymentDate: new Date().toLocaleDateString('en-GB'),
    paymentAmount: kind === 'inflow' ? 2000000 : 0,
    bankTransfer: {
      fromBankAccount: 'Cipta Kreasi PT / BRI / 1320009982282',
      toBankWallet: '',
      toAccountName: '',
      toAccountNumber: '',
      reference: '',
    },
    transactionDetails: defaultDetails(kind),
    splitPayments: [],
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
    paymentAmount: record.payments?.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) || record.amount,
    bankTransfer: {
      fromBankAccount: record.bankTransfer?.fromBankAccount || 'Cipta Kreasi PT / BRI / 1320009982282',
      toBankWallet: record.bankTransfer?.toBankWallet || '',
      toAccountName: record.bankTransfer?.toAccountName || '',
      toAccountNumber: record.bankTransfer?.toAccountNumber || '',
      reference: record.bankTransfer?.reference || record.refNo,
    },
    transactionDetails: record.transactionDetails ? JSON.parse(JSON.stringify(record.transactionDetails)) : [],
    splitPayments: record.splitPayments ? JSON.parse(JSON.stringify(record.splitPayments)) : [],
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
  const derivedAmount = transactionTotal.value
  const splitTotal = splitPayments.value.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
  emit('submit', {
    ...form.value,
    amount: derivedAmount,
    paymentAmount: showSplit.value ? splitTotal : paymentAmount.value,
    splitPayments: showSplit.value ? splitPayments.value : [],
  })
}

function openSplitPayments() {
  splitPayments.value = [
    { id: crypto.randomUUID(), method: 'Cash', amount: 0 },
    { id: crypto.randomUUID(), method: 'Cash', amount: 0 },
  ]
  showSplit.value = true
}

function cancelSplitPayments() {
  splitPayments.value = []
  showSplit.value = false
}
</script>

<template>
  <SalesDialog :open="open" :title="title" :busy="busy" medium @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="space-y-4 text-xs disabled:opacity-60">
        <div v-if="mode !== 'add'" :class="modalFormRowClass">
          <label :class="modalFormLabelClass">No Reff</label>
          <div :class="modalFormInputColClass">
            <input v-model="form.refNo" :class="formControlClass" disabled />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Name <span class="text-red-500">*</span></label>
          <div :class="modalFormInputColClass">
            <input v-model="form.name" :class="formControlClass" placeholder="Enter name" :disabled="mode !== 'add'" required />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Payment Date</label>
          <div :class="[modalFormInputColClass, 'relative']">
            <input v-model="form.paymentDate" :class="[formControlClass, 'ps-8']" placeholder="Choose Date" />
            <span class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
              <FeatherIcon name="calendar" :size="14" />
            </span>
          </div>
        </div>

        <PaymentSplitEditor
          v-if="kind === 'inflow'"
          v-model="splitPayments"
          :open="showSplit"
          @open="openSplitPayments"
          @cancel="cancelSplitPayments"
        />

        <PaymentMethodFields
          v-if="!showSplit"
          :kind="kind"
          :mode="mode"
          :method="form.method"
          :bank-transfer="bankTransfer"
          @update:method="form.method = $event"
          @update:bank-transfer="updateBankTransfer"
        />

        <div class="space-y-1">
          <div class="text-end text-xs font-semibold text-[#ff9f43]">
            Max Payment {{ formatNumber(maxPayment) }}
          </div>
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Payment Amount <span class="text-red-500">*</span></label>
            <div :class="modalFormInputColClass">
              <CurrencyInput
                :model-value="showSplit ? splitPayments.reduce((sum, entry) => sum + Number(entry.amount || 0), 0) : paymentAmount"
                :max="maxPayment"
                :disabled="showSplit"
                align="left"
                @update:model-value="paymentAmount = $event"
              />
            </div>
          </div>
        </div>

        <PaymentTransactionDetailsTable
          :details="form.transactionDetails || []"
          :payment-amount="showSplit ? splitPayments.reduce((sum, entry) => sum + Number(entry.amount || 0), 0) : paymentAmount"
        />

        <div class="grid grid-cols-12 items-start gap-3 sm:gap-4">
          <label :class="[modalFormLabelClass, 'pt-1']">Description</label>
          <div :class="modalFormInputColClass">
            <textarea v-model="form.note" class="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" rows="3" placeholder="Enter note here....." />
          </div>
        </div>

        <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button type="button" class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none">
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
