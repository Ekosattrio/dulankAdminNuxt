<script setup lang="ts">
import type { Sale } from '#server/types/sale'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
const props = defineProps<{ record: Sale | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const { formatRupiah } = useFormatters()
const adding = ref(false)
const busy = ref(false)
const error = ref('')
const method = ref('Cash')
const amount = ref(0)
const notes = ref('')
const { addPayment } = useSalesPayments()
const due = computed(() =>
  props.record?.status === 'Paid'
    ? 0
    : (props.record?.total || 0) - (props.record?.payments || []).reduce((sum, p) => sum + p.amount, 0),
)
watch(
  () => props.record,
  () => {
    adding.value = false
    error.value = ''
    amount.value = due.value
    notes.value = ''
  },
)
const columns = [
  { key: 'id', label: '#Payment IN' },
  { key: 'date', label: 'Dated' },
  { key: 'created', label: 'Created' },
  { key: 'amount', label: 'Amount', align: 'end' as const },
  { key: 'method', label: 'Method' },
]
async function save() {
  if (busy.value || !props.record) return
  busy.value = true
  error.value = ''
  try {
    await addPayment(props.record.id, { amount: amount.value, method: method.value, notes: notes.value })
    emit('saved')
    emit('close')
  } catch (e) {
    error.value = salesErrorMessage(e)
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <SalesDialog
    :open="!!record"
    :title="adding ? 'Payment-IN' : 'Show Payments-IN'"
    :busy="busy"
    wide
    @close="$emit('close')"
  >
    <p v-if="error" role="alert" class="mb-4 text-xs text-red-600">{{ error }}</p>
    <template v-if="!adding"
      ><SalesDataTable :columns="columns" :items="record?.payments || []"
        ><template #cell(amount)="{ item }">{{ formatRupiah(item.amount) }}</template></SalesDataTable
      >
      <p v-if="record?.status === 'Paid' && !record.payments?.length" class="mt-3 text-xs text-gray-500">
        Transaksi tercatat Paid; rincian pembayaran belum tersimpan.
      </p>
      <div class="mt-5 flex justify-end gap-3">
        <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Cancel</button
        ><button v-if="due > 0" type="button" :class="salesPrimaryButton" @click="adding = true">
          Payment-IN
        </button>
      </div></template
    >
    <form v-else @submit.prevent="save">
      <fieldset :disabled="busy" class="space-y-4">
        <label :class="salesLabel"
          >Payment-IN Type *<select aria-label="Payment-IN Type *" v-model="method" :class="salesField">
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Debit Card</option>
          </select></label
        ><label :class="salesLabel"
          >Paying Amount *<CurrencyInput
            v-model="amount"
            thousand-separator="."
            :min="1"
            :max="due"
            required
        /></label>
        <p class="text-xs">Total Due: {{ formatRupiah(due) }}</p>
        <label :class="salesLabel">Notes<textarea v-model="notes" :class="salesField" /></label>
        <div class="flex justify-end gap-3">
          <button type="button" :class="salesSecondaryButton" @click="adding = false">Cancel</button
          ><button type="submit" :class="salesPrimaryButton">{{ busy ? 'Saving...' : 'Submit' }}</button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
