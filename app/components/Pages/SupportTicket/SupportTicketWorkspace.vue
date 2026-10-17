<script setup lang="ts">
import type { SupportTicket, SupportTicketCommand } from '#server/types/support-ticket'
import type { DateRangeValue } from '~/composables/useDateRange'

const searchQuery = ref('')
const filterPriority = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const collapsed = ref(false)

const filterParams = computed(() => ({
  search: searchQuery.value || undefined,
  priority: filterPriority.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined,
}))

const { tickets, stats, pending, error, refresh, createTicket, updateTicket, deleteTicket } = useSupportTickets(filterParams)

const isAddModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const ticketForDetail = ref<SupportTicket | null>(null)
const ticketToDelete = ref<SupportTicket | null>(null)
const busy = ref(false)
const toastMessage = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'ticketNo', label: 'ID' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'subject', label: 'Subject' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'dueDate', label: 'Due Date' },
]

function handleAdd() {
  isAddModalOpen.value = true
}

function handleViewDetail(ticket: SupportTicket) {
  ticketForDetail.value = ticket
  isDetailModalOpen.value = true
}

function handleDeleteRequest(ticket: SupportTicket) {
  ticketToDelete.value = ticket
}

async function handleCreateTicket(payload: SupportTicketCommand) {
  busy.value = true
  actionError.value = ''
  try {
    const res = await createTicket(payload)
    isAddModalOpen.value = false
    toastMessage.value = res.message || 'Support ticket created successfully.'
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to create support ticket'
  } finally {
    busy.value = false
  }
}

async function handleUpdateStatus(ticketId: string, newStatus: 'Open' | 'Closed' | 'Pending') {
  busy.value = true
  actionError.value = ''
  try {
    const res = await updateTicket(ticketId, { status: newStatus })
    toastMessage.value = res.message || 'Status updated successfully.'
    if (ticketForDetail.value && ticketForDetail.value.id === ticketId) {
      ticketForDetail.value = { ...ticketForDetail.value, status: newStatus }
    }
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to update ticket status'
  } finally {
    busy.value = false
  }
}

async function confirmDelete() {
  if (!ticketToDelete.value) return
  busy.value = true
  actionError.value = ''
  try {
    const res = await deleteTicket(ticketToDelete.value.id)
    toastMessage.value = res.message || 'Ticket deleted successfully.'
    ticketToDelete.value = null
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to delete ticket'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Support Ticket List"
      subtitle="Manage your Support Ticket"
      add-label="Add New Support Ticket"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Collapse"
          aria-label="Collapse"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="collapsed = !collapsed"
        >
          <FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" />
        </button>
      </template>
    </SalesListHeader>

    <SupportTicketStatsWidgets v-if="!collapsed && stats" :stats="stats" />

    <SalesFeedback :message="toastMessage" :error="actionError" @dismiss="toastMessage = ''" @retry="actionError = ''" />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="error ? 'Unable to load tickets. Please try again.' : ''"
      @retry="refresh"
    />

    <SupportTicketRecordsTable
      v-if="!collapsed && !pending && !error"
      :tickets="tickets"
      :search-query="searchQuery"
      :filter-priority="filterPriority"
      :filter-status="filterStatus"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-priority="filterPriority = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-date-range="filterDateRange = $event"
      @view-detail="handleViewDetail"
      @delete-ticket="handleDeleteRequest"
    />

    <SupportTicketAddModal
      :show="isAddModalOpen"
      :busy="busy"
      @update:show="isAddModalOpen = $event"
      @submit="handleCreateTicket"
    />

    <SupportTicketDetailModal
      :show="isDetailModalOpen"
      :ticket="ticketForDetail"
      :busy="busy"
      @update:show="isDetailModalOpen = $event"
      @update-status="handleUpdateStatus"
    />

    <SalesConfirmDelete
      :open="!!ticketToDelete"
      title="Delete Support Ticket"
      :message="`Are you sure you want to delete ticket '${ticketToDelete?.ticketNo}'? This action cannot be undone.`"
      :busy="busy"
      :error="actionError"
      @close="ticketToDelete = null"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Support Tickets Report"
      subtitle="Daftar tiket bantuan pelanggan"
      :columns="printColumns"
      :items="tickets"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

