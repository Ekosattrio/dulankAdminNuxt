<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DeleteAccountRequest } from '#server/types/user-management'
import { useDeleteAccounts } from '~/composables/useDeleteAccounts'
import { useTablePrint } from '~/composables/useTablePrint'
import DeleteAccountRecordsTable from '~/components/Pages/DeleteAccount/DeleteAccountRecordsTable.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

const searchQuery = ref('')
const sortOrder = ref('newest')

const { requests, pending, error, refresh, deleteRequest } = useDeleteAccounts()

// Smooth client-side filtering and sorting for delete requests
const filteredRequests = computed(() => {
  let list = [...requests.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((r) =>
      r.userName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    )
  }
  list.sort((a, b) => {
    const diff = (a.requisitionDate || '').localeCompare(b.requisitionDate || '')
    return sortOrder.value === 'newest' ? -diff : diff
  })
  return list
})

const activeRequestToDelete = ref<DeleteAccountRequest | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

async function handleConfirmDelete() {
  if (!activeRequestToDelete.value) return
  isBusy.value = true
  try {
    await deleteRequest(activeRequestToDelete.value.id)
    showToast(`Account deletion for '${activeRequestToDelete.value.userName}' processed successfully`)
    activeRequestToDelete.value = null
  } catch (err: any) {
    showToast(err?.message || 'Failed to process account deletion')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'userName', label: 'User Name' },
  { key: 'email', label: 'Email' },
  { key: 'requisitionDate', label: 'Requisition Date' },
  { key: 'deleteRequestDate', label: 'Delete Request Date' },
]

function handleExportExcel() {
  const header = ['User Name', 'Email', 'Requisition Date', 'Delete Request Date']
  const rows = filteredRequests.value.map((r) => [
    `"${r.userName.replace(/"/g, '""')}"`,
    `"${r.email}"`,
    `"${r.requisitionDate}"`,
    `"${r.deleteRequestDate}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `delete_account_requests_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Requests exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <SalesListHeader
      title="Delete Account Request"
      subtitle="Review and process user account deletion requests"
      :show-add="false"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton Loader & Error -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="5"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load delete requests. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Table -->
    <DeleteAccountRecordsTable
      v-if="!pending && !error"
      :requests="filteredRequests"
      :search-query="searchQuery"
      :sort-order="sortOrder"
      @update:search-query="searchQuery = $event"
      @update:sort-order="sortOrder = $event"
      @process="activeRequestToDelete = $event"
    />

    <!-- Delete Confirmation -->
    <SalesConfirmDelete
      :open="!!activeRequestToDelete"
      :busy="isBusy"
      title="Approve Account Deletion"
      :description="`Permanently delete user account '${activeRequestToDelete?.userName}' (${activeRequestToDelete?.email})? All data associated with this user will be removed.`"
      @close="activeRequestToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <!-- Print Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Daftar Permohonan Penghapusan Akun Pengguna"
      :columns="printColumns"
      :items="requests"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

