<script setup lang="ts">
import type { SupportTicket, SupportTicketFilterQuery } from '#server/types/support-ticket'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useSupportTickets } from '~/composables/useSupportTickets'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SupportTicketStatsWidgets from '~/components/pages/support-ticket/SupportTicketStatsWidgets.vue'
import SupportTicketRecordsTable from '~/components/pages/support-ticket/SupportTicketRecordsTable.vue'
import SupportTicketAddModal from '~/components/pages/support-ticket/SupportTicketAddModal.vue'
import SupportTicketDetailModal from '~/components/pages/support-ticket/SupportTicketDetailModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Support Ticket List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const filterPriority = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<SupportTicketFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  priority: filterPriority.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const {
  tickets,
  stats,
  pending,
  error,
  refresh,
  createTicket,
  updateTicket,
  deleteTicket
} = useSupportTickets(filterParams)

const showAddModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedTicket = ref<SupportTicket | null>(null)
const ticketToDelete = ref<SupportTicket | null>(null)
const isBusy = ref(false)

const openDetail = (ticket: SupportTicket) => {
  selectedTicket.value = ticket
  showDetailModal.value = true
}

const confirmDelete = (ticket: SupportTicket) => {
  ticketToDelete.value = ticket
  showDeleteConfirm.value = true
}

const handleDeleteTicket = async () => {
  if (!ticketToDelete.value) return
  isBusy.value = true
  try {
    await deleteTicket(ticketToDelete.value.id)
    showDeleteConfirm.value = false
    ticketToDelete.value = null
  } catch (err) {
    console.error('Failed to delete ticket', err)
  } finally {
    isBusy.value = false
  }
}

const handleAddTicket = async (formData: {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  descriptions: string
}) => {
  isBusy.value = true
  try {
    await createTicket(formData)
  } catch (err) {
    console.error('Failed to create ticket', err)
  } finally {
    isBusy.value = false
  }
}

const handleSendReply = async (ticketId: string, message: string) => {
  try {
    const res = await updateTicket(ticketId, { newMessage: message, senderName: 'Admin' })
    if (res.data && selectedTicket.value && selectedTicket.value.id === ticketId) {
      selectedTicket.value = res.data
    }
  } catch (err) {
    console.error('Failed to send reply', err)
  }
}

const handleUpdateStatus = async (ticketId: string, newStatus: 'Open' | 'Closed' | 'Pending') => {
  try {
    const res = await updateTicket(ticketId, { status: newStatus })
    if (res.data && selectedTicket.value && selectedTicket.value.id === ticketId) {
      selectedTicket.value = res.data
    }
  } catch (err) {
    console.error('Failed to update ticket status', err)
  }
}

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const supportTicketPrintColumns = [
  { key: 'ticketNo', label: 'ID' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'subject', label: 'Subject' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'priority', label: 'Priority', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'dueDate', label: 'Due Date' }
]
</script>

<template>
  <div class="dulank-page dulank-page-support-ticket max-w-7xl mx-auto px-4 py-6">
    <!-- Header with Add Ticket button and PDF/Print/Refresh icons -->
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

    <!-- KPI Widgets -->
    <SupportTicketStatsWidgets :stats="stats" />

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat tiket bantuan. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Support Ticket Records Table -->
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

    <!-- Add Ticket Modal -->
    <SupportTicketAddModal
      v-model:show="showAddModal"
      :busy="isBusy"
      @submit="handleAddTicket"
    />

    <!-- Ticket Detail & Chat Modal -->
    <SupportTicketDetailModal
      v-model:show="showDetailModal"
      :ticket="selectedTicket"
      :busy="isBusy"
      @send-reply="handleSendReply"
      @update-status="handleUpdateStatus"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="showDeleteConfirm"
      :busy="isBusy"
      @close="
        showDeleteConfirm = false;
        ticketToDelete = null
      "
      @confirm="handleDeleteTicket"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Tiket Bantuan (Support Ticket List)"
      :columns="supportTicketPrintColumns"
      :items="tickets"
      date-field="createdDate"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
