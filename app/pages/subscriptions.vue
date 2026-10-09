<script setup lang="ts">
import type { SubscriptionItem } from '#server/types/subscription'
import { useSubscriptions } from '~/composables/useSubscriptions'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SubscriptionStatsWidgets from '~/components/pages/subscriptions/SubscriptionStatsWidgets.vue'
import SubscriptionRecordsTable from '~/components/pages/subscriptions/SubscriptionRecordsTable.vue'
import SubscriptionDetailModal from '~/components/pages/subscriptions/SubscriptionDetailModal.vue'
import SubscriptionEditModal from '~/components/pages/subscriptions/SubscriptionEditModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/subscriptions.html'],
})
useLegacyPage({ title: 'Subscriptions', sweetAlert: false })

const { subscriptions, stats, pending, error, refresh, saveSubscription, deleteSubscription } = useSubscriptions()

const searchQuery = ref(''), filterPlan = ref(''), filterPayment = ref(''), filterStatus = ref('')
const isDetailModalOpen = ref(false), isEditModalOpen = ref(false), isDeleteConfirmOpen = ref(false)
const selectedItem = ref<SubscriptionItem | null>(null)
const itemToDelete = ref<SubscriptionItem | null>(null)
const isBusy = ref(false), feedbackMsg = ref('')

const print = useTablePrint()
const printColumns = [
  { key: 'subscriber', label: 'Subscriber' },
  { key: 'plan', label: 'Plan' },
  { key: 'billingCycle', label: 'Billing Cycle' },
  { key: 'method', label: 'Payment Method' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'expiringOn', label: 'Expiring On' },
  { key: 'status', label: 'Status' }
]

function handleAdd() {
  selectedItem.value = null
  isEditModalOpen.value = true
}

function handleView(item: SubscriptionItem) {
  selectedItem.value = item
  isDetailModalOpen.value = true
}

function handleEdit(item: SubscriptionItem) {
  selectedItem.value = item
  isEditModalOpen.value = true
}

function handleDelete(item: SubscriptionItem) {
  itemToDelete.value = item
  isDeleteConfirmOpen.value = true
}

async function handleSave(data: Partial<SubscriptionItem>) {
  if (!data.subscriber) return
  isBusy.value = true
  try {
    const res = await saveSubscription(data as any)
    feedbackMsg.value = res.message || 'Subscription saved successfully'
    isEditModalOpen.value = false
  } catch (err: any) {
    feedbackMsg.value = err?.data?.message || err?.message || 'Failed to save subscription'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteSubscription(itemToDelete.value.id)
    feedbackMsg.value = res.message || 'Subscription deleted successfully'
    isDeleteConfirmOpen.value = false
    itemToDelete.value = null
  } catch (err: any) {
    feedbackMsg.value = err?.data?.message || err?.message || 'Failed to delete subscription'
  } finally {
    isBusy.value = false
  }
}

function openPrintModal(action: 'print' | 'pdf', rows?: SubscriptionItem[]) {
  const targetRows = rows ?? subscriptions.value
  print.openPrintModal({
    title: 'Subscription Report',
    subtitle: 'Daftar langganan dan status pembayaran',
    columns: printColumns,
    rows: targetRows,
    action
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-subscriptions space-y-5 p-4 md:p-6">
    <SalesListHeader
      title="Subscription List"
      subtitle="Manage your Subscriptions"
      add-label="Add Subscription"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SubscriptionStatsWidgets :stats="stats" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load subscriptions') : ''"
      :message="feedbackMsg"
      @retry="refresh"
      @dismiss="feedbackMsg = ''"
    />

    <SubscriptionRecordsTable
      v-if="!pending"
      :subscriptions="subscriptions"
      :search-query="searchQuery"
      :filter-plan="filterPlan"
      :filter-payment="filterPayment"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-plan="filterPlan = $event"
      @update:filter-payment="filterPayment = $event"
      @update:filter-status="filterStatus = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <SubscriptionDetailModal :open="isDetailModalOpen" :subscription="selectedItem" @close="isDetailModalOpen = false" @print="openPrintModal('print', [$event])" />
    <SubscriptionEditModal :open="isEditModalOpen" :subscription="selectedItem" :busy="isBusy" @close="isEditModalOpen = false" @save="handleSave" />
    <SalesConfirmDelete :open="isDeleteConfirmOpen" title="Delete Subscription" :message="`Are you sure you want to delete subscription for '${itemToDelete?.subscriber}'?`" :busy="isBusy" @cancel="isDeleteConfirmOpen = false" @confirm="confirmDelete" />
    <DocumentPrintModal v-if="print.isPrintModalOpen.value" :open="print.isPrintModalOpen.value" :title="print.printTitle.value" :subtitle="print.printSubtitle.value" :columns="print.printColumns.value" :rows="print.printRows.value" :default-action="print.defaultPrintAction.value" date-field="createdDate" @close="print.closePrintModal" />
  </div>
</template>
