<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Support Ticket List" subtitle="Manage your Support Ticket">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Tickets" value="307,144" icon="ticket" tone="primary" />
      <CommonStatCard label="Total Pending Tickets" value="4,385" icon="clock" tone="warning" />
      <CommonStatCard label="Total Closed Tickets" value="385,656" icon="check-circle" tone="success" />
      <CommonStatCard label="Total Deleted Tickets" value="4,000" icon="trash-2" tone="danger" />
    </div>

    <!-- Ticket List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search ticket id, requester, subject..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterPriority"
            allLabel="All Priorities"
            :options="[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Open', label: 'Open' },
              { value: 'Closed', label: 'Closed' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">ID</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Requested By</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Subject</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Assignee</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Priority</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Due Date</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredTickets" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ item.ticketId }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <NuxtLink to="/support-ticket-detail" class="font-medium text-gray-900 hover:text-primary dark:text-gray-100">{{ item.requestedBy }}</NuxtLink>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.subject }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.assignee }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.priority" :tone="item.priority === 'High' ? 'rose' : item.priority === 'Medium' ? 'indigo' : 'slate'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" :tone="item.status === 'Open' ? 'emerald' : 'slate'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.createdDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.dueDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @delete="deleteItem(item.id)">
                  <template #extra>
                    <NuxtLink
                      to="/support-ticket-detail"
                      title="View Detail"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                    >
                      <CommonFeatherIcon name="eye" size="16" />
                    </NuxtLink>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredTickets.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No support tickets found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Support Ticket List - Kacetak System",
});

const { data: supportTicketData } = await useFetch<TicketItem[]>('/api/support-ticket')
const tickets = ref<TicketItem[]>(supportTicketData.value ?? [])
useMockSync('support-ticket', tickets);

const searchQuery = ref("");
const filterPriority = ref("");
const filterStatus = ref("");

const filteredTickets = computed(() => {
  return tickets.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q ||
      item.ticketId.toLowerCase().includes(q) ||
      item.requestedBy.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q);
    const matchPri = !filterPriority.value || item.priority === filterPriority.value;
    const matchSt = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchPri && matchSt;
  });
});

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this support ticket?")) {
    tickets.value = tickets.value.filter((t) => t.id !== id);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterPriority.value = "";
  filterStatus.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
=======
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

definePageMeta({ layout: 'default' })
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
  handleUpdateStatus
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
>>>>>>> origin/eko
