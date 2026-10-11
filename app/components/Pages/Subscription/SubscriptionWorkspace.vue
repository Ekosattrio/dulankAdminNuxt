<script setup lang="ts">
import type { SubscriptionFilterQuery, SubscriptionRecord, SubscriptionUpdateCommand } from '#server/types/subscription'
import type { DateRangeValue } from '~/composables/useDateRange'
import { formatSubscriptionDate } from '~/utils/subscription'

const search = ref('')
const plan = ref('')
const paymentMethod = ref('')
const status = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const filters = computed<SubscriptionFilterQuery>(() => ({
  search: search.value || undefined,
  plan: plan.value || undefined,
  paymentMethod: paymentMethod.value || undefined,
  status: status.value || undefined,
  startDate: dateRange.value?.start,
  endDate: dateRange.value?.end,
}))
const { subscriptions, summary, pending, error, refresh, updateSubscription, deleteSubscription } = useSubscriptions(filters)
const selected = ref<SubscriptionRecord | null>(null)
const editing = ref<SubscriptionRecord | null>(null)
const deleting = ref<SubscriptionRecord | null>(null)
const currentPageItems = ref<SubscriptionRecord[]>([])
const busy = ref(false)
const message = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printableItems = computed(() => subscriptions.value.map(item => ({
  ...item,
  amountLabel: `Rp ${item.amount.toLocaleString('id-ID')}`,
  createdDateLabel: formatSubscriptionDate(item.createdDate),
  expiringOnLabel: formatSubscriptionDate(item.expiringOn),
})))
const printColumns = [
  { key: 'subscriber', label: 'Subscriber' }, { key: 'plan', label: 'Plan' },
  { key: 'billingCycle', label: 'Billing Cycle' }, { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'amountLabel', label: 'Amount', align: 'right' as const }, { key: 'createdDateLabel', label: 'Created Date' },
  { key: 'expiringOnLabel', label: 'Expiring On' }, { key: 'status', label: 'Status' },
]

function startEdit(item: SubscriptionRecord) {
  selected.value = null
  editing.value = item
}

async function save(payload: SubscriptionUpdateCommand) {
  if (!editing.value) return
  busy.value = true
  try {
    const response = await updateSubscription(editing.value.id, payload)
    editing.value = null
    message.value = response.message
  } catch (cause: any) {
    message.value = cause?.data?.message || cause?.message || 'Unable to update subscription'
  } finally { busy.value = false }
}

async function remove() {
  if (!deleting.value) return
  busy.value = true
  try {
    const response = await deleteSubscription(deleting.value.id)
    deleting.value = null
    message.value = response.message
  } catch (cause: any) {
    message.value = cause?.data?.message || cause?.message || 'Unable to delete subscription'
  } finally { busy.value = false }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Subscription List" subtitle="Manage your Subscriptions" :refreshing="pending" @refresh="refresh()" @print="openPrintModal('print')" @pdf="openPrintModal('pdf')" />
    <SalesFeedback :message="message" @dismiss="message = ''" />
    <CardSkeleton v-if="pending" :count="4" />
    <SubscriptionStats v-else :summary="summary" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="9" :error="error ? 'Unable to load subscriptions. Please try again.' : ''" @retry="refresh()" />
    <SubscriptionRecordsTable
      v-if="!pending && !error"
      :items="subscriptions" :search="search" :plan="plan" :payment-method="paymentMethod" :status="status" :date-range="dateRange"
      @update:search="search = $event" @update:plan="plan = $event" @update:payment-method="paymentMethod = $event"
      @update:status="status = $event" @update:date-range="dateRange = $event" @update:current-page-items="currentPageItems = $event"
      @view="selected = $event" @edit="startEdit" @delete="deleting = $event"
    />
    <SubscriptionDetailDialog :open="!!selected" :item="selected" @close="selected = null" @edit="startEdit" />
    <SubscriptionFormDialog :open="!!editing" :item="editing" :busy="busy" @close="editing = null" @submit="save" />
    <SalesConfirmDelete :open="!!deleting" title="Delete Subscription" :message="`Are you sure you want to delete '${deleting?.subscriber}'?`" :busy="busy" @close="deleting = null" @confirm="remove" />
    <DocumentPrintModal :open="isPrintModalOpen" title="Subscription Report" subtitle="Daftar langganan dan status pembayaran" :columns="printColumns" :items="printableItems" :current-page-items="currentPageItems" date-field="createdDate" :initial-date-range="dateRange" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
