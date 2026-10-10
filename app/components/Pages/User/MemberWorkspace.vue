<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MemberUser } from '#server/types/user-management'
import { isDateInRange, type DateRangeValue } from '~/composables/useDateRange'
import { useMembers } from '~/composables/useMembers'
import { useTablePrint } from '~/composables/useTablePrint'
import MemberRecordsTable from '~/components/Pages/User/MemberRecordsTable.vue'
import MemberFormModal from '~/components/Pages/User/MemberFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

const searchQuery = ref('')
const selectedStatus = ref('')
const dateRange = ref<DateRangeValue | null>(null)

const { members, pending, error, refresh, saveMember, deleteMember } = useMembers()

// Smooth client-side filtering for status and date range
const filteredMembers = computed(() => {
  return members.value.filter((m) => {
    // Status filter
    if (selectedStatus.value && selectedStatus.value !== 'All Statuses' && selectedStatus.value !== 'All') {
      if (m.status !== selectedStatus.value) return false
    }

    // Date range filter
    if (dateRange.value) {
      if (!isDateInRange(m.createdAt || '', dateRange.value)) return false
    }

    return true
  })
})

// Modals
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeMemberForEdit = ref<MemberUser | null>(null)
const memberToDelete = ref<MemberUser | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

function handleAdd() {
  isEditMode.value = false
  activeMemberForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(member: MemberUser) {
  isEditMode.value = true
  activeMemberForEdit.value = member
  isFormModalOpen.value = true
}

async function handleStatusChange(member: MemberUser, newStatus: 'Active Member' | 'Suspended') {
  try {
    await saveMember({ id: member.id, name: member.name, email: member.email, status: newStatus })
    showToast(`Status member ${member.name} berhasil diubah ke ${newStatus}`)
  } catch (err: any) {
    showToast(err?.message || 'Gagal mengubah status member')
  }
}

async function handleFormSubmit(payload: Partial<MemberUser>) {
  isBusy.value = true
  try {
    await saveMember(payload)
    isFormModalOpen.value = false
    showToast(isEditMode.value ? 'Member updated successfully' : 'Member created successfully')
  } catch (err: any) {
    showToast(err?.message || 'Failed to save member')
  } finally {
    isBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!memberToDelete.value) return
  isBusy.value = true
  try {
    await deleteMember(memberToDelete.value.id)
    showToast(`Member '${memberToDelete.value.name}' deleted successfully`)
    memberToDelete.value = null
  } catch (err: any) {
    showToast(err?.message || 'Failed to delete member')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'customerId', label: 'Customer Id' },
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Customer Name' },
  { key: 'verifiedEmailText', label: 'Verified Email', align: 'center' as const },
  { key: 'subscriptionText', label: 'Subscription', align: 'center' as const },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Join Date' },
]

const printableMembers = computed(() => {
  let list = filteredMembers.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((m) =>
      Object.values(m).some((val) => val != null && String(val).toLowerCase().includes(q))
    )
  }
  return list.map((m) => ({
    ...m,
    verifiedEmailText: m.verifiedEmail ? 'Active' : 'No',
    subscriptionText: m.subscription ? 'Yes' : 'No',
  }))
})

function handleExportExcel() {
  const header = ['Customer Id', 'Email', 'Customer Name', 'Verified Email', 'Subscription', 'Status', 'Phone', 'Join Date']
  let list = filteredMembers.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((m) =>
      Object.values(m).some((val) => val != null && String(val).toLowerCase().includes(q))
    )
  }
  const rows = list.map((m) => [
    `"${m.customerId}"`,
    `"${m.email}"`,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.verifiedEmail ? 'Active' : 'No'}"`,
    `"${m.subscription ? 'Yes' : 'No'}"`,
    `"${m.status}"`,
    `"${m.phone || ''}"`,
    `"${m.createdAt || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `members_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Members exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <SalesListHeader
      title="User List"
      subtitle="Manage Your Users"
      add-label="Add New User"
      @add="handleAdd"
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
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load user members. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Table -->
    <MemberRecordsTable
      v-if="!pending && !error"
      :members="filteredMembers"
      :search-query="searchQuery"
      :selected-status="selectedStatus"
      :date-range="dateRange"
      @update:search-query="searchQuery = $event"
      @update:selected-status="selectedStatus = $event"
      @update:date-range="dateRange = $event"
      @status-change="handleStatusChange"
      @edit="handleEdit"
      @delete="memberToDelete = $event"
    />

    <!-- Add / Edit Modal -->
    <MemberFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :member="activeMemberForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation -->
    <SalesConfirmDelete
      :open="!!memberToDelete"
      :busy="isBusy"
      title="Delete Member"
      :description="`Are you sure you want to delete member '${memberToDelete?.name}'? This action cannot be undone.`"
      @close="memberToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <!-- Print Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Daftar Anggota / User Member Toko"
      :columns="printColumns"
      :items="printableMembers"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

