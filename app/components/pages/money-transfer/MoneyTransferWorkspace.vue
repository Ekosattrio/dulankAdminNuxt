<script setup lang="ts">
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { useMoneyTransferManager } from '~/composables/useMoneyTransferManager'
import { useTablePrint } from '~/composables/useTablePrint'
import MoneyTransferDetailModal from './MoneyTransferDetailModal.vue'
import MoneyTransferFormModal from './MoneyTransferFormModal.vue'
import MoneyTransferRecordsTable from './MoneyTransferRecordsTable.vue'

const manager = useMoneyTransferManager()
const print = useTablePrint()
const printColumns = [
  { key: 'date', label: 'Date' }, { key: 'no', label: 'No Transfer' },
  { key: 'fromAccount', label: 'From Account' }, { key: 'toAccount', label: 'To Account' },
  { key: 'amount', label: 'Amount', align: 'right' as const }, { key: 'description', label: 'Description' },
  { key: 'createdBy', label: 'Created By' },
]
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Money Transfer" subtitle="Manage Money Transfer List" add-label="Add New Transfer" :refreshing="manager.pending.value" @add="manager.openForm()" @refresh="manager.refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <SalesFeedback :pending="manager.pending.value" :error="manager.error.value ? 'Unable to load money transfers. Please try again.' : ''" :message="manager.message.value" skeleton="table" :skeleton-cols="8" @retry="manager.refresh" @dismiss="manager.message.value = ''" />
    <MoneyTransferRecordsTable v-if="!manager.pending.value && !manager.error.value" :items="manager.items.value" :search="manager.search.value" :date-range="manager.dateRange.value" @update:search="manager.search.value = $event" @update:date-range="manager.dateRange.value = $event" @update:current-page-items="manager.currentPageItems.value = $event" @view="manager.detailTarget.value = $event" @edit="manager.openForm" @delete="manager.deleteTarget.value = $event" />
    <MoneyTransferFormModal :open="manager.formOpen.value" :item="manager.formTarget.value" :accounts="manager.accounts.value" :busy="manager.busy.value" :error="manager.mutationError.value" @close="manager.formOpen.value = false" @submit="manager.save" />
    <MoneyTransferDetailModal :open="!!manager.detailTarget.value" :item="manager.detailTarget.value" @close="manager.detailTarget.value = null" />
    <SalesConfirmDelete :open="!!manager.deleteTarget.value" title="Delete Money Transfer" :message="`Delete transfer '${manager.deleteTarget.value?.no ?? ''}'? The linked ledger entries will also be removed.`" :busy="manager.busy.value" :error="manager.mutationError.value" @close="manager.deleteTarget.value = null" @confirm="manager.remove" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Money Transfer Report" :columns="printColumns" :items="manager.items.value" :current-page-items="manager.currentPageItems.value" :initial-date-range="manager.dateRange.value" :default-action="print.defaultPrintAction.value" date-field="occurredAt" @close="print.closePrintModal" />
  </div>
</template>

