<script setup lang="ts">
import { useSupportTicketPage } from '~/composables/useSupportTicketPage'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SupportTicketStatsWidgets from '~/components/pages/support-ticket/SupportTicketStatsWidgets.vue'
import SupportTicketRecordsTable from '~/components/pages/support-ticket/SupportTicketRecordsTable.vue'
import SupportTicketAddModal from '~/components/pages/support-ticket/SupportTicketAddModal.vue'
import SupportTicketDetailModal from '~/components/pages/support-ticket/SupportTicketDetailModal.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default',
  alias: ['/ticket-list.html'],
})
useLegacyPage({ title: 'Support Ticket List - Dulank Admin', sweetAlert: false })

const {
  tickets,
  stats,
  pending,
  error,
  refresh,
  searchQuery,
  filterPriority,
  filterStatus,
  filterDateRange,
  showAddModal,
  showDetailModal,
  showDeleteConfirm,
  selectedTicket,
  ticketToDelete,
  isBusy,
  openDetail,
  confirmDelete,
  handleDeleteTicket,
  handleAddTicket,
  handleSendReply,
  handleUpdateStatus,
} = useSupportTicketPage()

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const supportTicketPrintColumns = [
  { key: 'ticketNo', label: 'ID' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'subject', label: 'Subject' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'priority', label: 'Priority', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'dueDate', label: 'Due Date' },
]
</script>

<template>
  <div class="dulank-page dulank-page-ticket-list max-w-7xl mx-auto px-4 py-6 space-y-4">
    <SalesListHeader
      title="Support Ticket List"
      subtitle="Manage your Support Ticket"
      has-action
      action-label="Add Ticket"
      @action="showAddModal = true"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SupportTicketStatsWidgets :stats="stats" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat tiket bantuan. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <SupportTicketRecordsTable
      v-if="!pending && !error"
      :tickets="tickets"
      v-model:search-query="searchQuery"
      v-model:filter-priority="filterPriority"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
      @view-detail="openDetail"
      @delete-ticket="confirmDelete"
    />

    <SupportTicketAddModal
      v-model:show="showAddModal"
      :busy="isBusy"
      @submit="handleAddTicket"
    />

    <SupportTicketDetailModal
      v-model:show="showDetailModal"
      :ticket="selectedTicket"
      :busy="isBusy"
      @send-reply="handleSendReply"
      @update-status="handleUpdateStatus"
    />

    <SalesConfirmDelete
      :open="showDeleteConfirm"
      title="Hapus Tiket Bantuan"
      :message="`Apakah Anda yakin ingin menghapus tiket '${ticketToDelete?.ticketNo}'? Tindakan ini tidak dapat dibatalkan.`"
      :busy="isBusy"
      @cancel="showDeleteConfirm = false"
      @confirm="handleDeleteTicket"
    />

    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Daftar Tiket Bantuan (Support Ticket List)"
      :columns="supportTicketPrintColumns"
      :items="tickets"
      date-field="createdDate"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
