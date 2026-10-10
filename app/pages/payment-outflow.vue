<script setup lang="ts">
import PaymentBalanceSummary from '~/components/Pages/PaymentFlow/PaymentBalanceSummary.vue'
import PaymentFlowDetails from '~/components/Pages/PaymentFlow/PaymentFlowDetails.vue'
import PaymentFlowEditor from '~/components/Pages/PaymentFlow/PaymentFlowEditor.vue'
import PaymentFlowRecordsTable from '~/components/Pages/PaymentFlow/PaymentFlowRecordsTable.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PaymentFlowFormData, PaymentFlowRecord } from '#server/types/payment-flow'

useLegacyPage({ title: 'Payment Outflow', sweetAlert: false })

const searchQuery = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const filterSource = ref('')
const filterStatus = ref('')
const modalMode = ref<'add' | 'edit' | 'payment' | null>(null)
const selectedRecord = ref<PaymentFlowRecord | null>(null)
const deleting = ref<PaymentFlowRecord | null>(null)
const busy = ref(false)
const actionError = ref('')
const filters = computed(() => ({
  search: searchQuery.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
  source: filterSource.value,
  status: filterStatus.value,
}))
const { records, balances, pending, error, refresh, saveRecord, deleteRecord } = usePaymentFlow('outflow', filters)

function openEditor(mode: 'add' | 'edit' | 'payment', record: PaymentFlowRecord | null = null) {
  actionError.value = ''
  modalMode.value = mode
  selectedRecord.value = record
}

async function submit(form: PaymentFlowFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveRecord(form)
    modalMode.value = null
    selectedRecord.value = null
  } catch (event) {
    actionError.value = salesErrorMessage(event)
  } finally {
    busy.value = false
  }
}

async function confirmDelete() {
  if (!deleting.value) return
  busy.value = true
  actionError.value = ''
  try {
    await deleteRecord(deleting.value.id)
    deleting.value = null
  } catch (event) {
    actionError.value = salesErrorMessage(event)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Payment Outflow',
    ['Date', 'Ref No', 'Name', 'Source', 'Amount (IDR)', 'Status', 'Payment Method', 'Note', 'Date'],
    records.value.map((item) => [
      item.date,
      item.refNo,
      item.name,
      item.source,
      item.amount.toLocaleString('id-ID'),
      item.status,
      item.method,
      item.note,
      item.paymentDate,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-payment-outflow">
    <SalesListHeader
      title="Payment Outflow"
      subtitle="Manage your Payment Outflow report"
      add-label="Add Payment Outflow"
      :refreshing="pending"
      @add="openEditor('add')"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :skeleton-rows="6"
      :error="error ? 'Unable to load payment outflow. Please try again.' : ''"
      @retry="refresh()"
    />
    <template v-if="!pending && !error">
      <PaymentBalanceSummary v-model:date-range="filterDateRange" :balances="balances" />
      <PaymentFlowRecordsTable
        kind="outflow"
        :records="records"
        :search-query="searchQuery"
        :filter-date-range="filterDateRange"
        :filter-source="filterSource"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-date-range="filterDateRange = $event"
        @update:filter-source="filterSource = $event"
        @update:filter-status="filterStatus = $event"
        @view="selectedRecord = $event"
        @payment="openEditor('payment', $event)"
        @edit="openEditor('edit', $event)"
        @delete="deleting = $event"
      />
    </template>
    <PaymentFlowEditor
      :open="!!modalMode"
      kind="outflow"
      :mode="modalMode || 'add'"
      :record="selectedRecord"
      :busy="busy"
      :error="actionError"
      @close="
        modalMode = null;
        selectedRecord = null
      "
      @submit="submit"
    />
    <PaymentFlowDetails kind="outflow" :record="!modalMode ? selectedRecord : null" @close="selectedRecord = null" />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
