<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserAdmin } from '#server/types/user-management'
import { useUserAdmins } from '~/composables/useUserAdmins'
import { useTablePrint } from '~/composables/useTablePrint'
import UserAdminRecordsTable from '~/components/pages/user-admin/UserAdminRecordsTable.vue'
import UserAdminFormModal from '~/components/pages/user-admin/UserAdminFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'

const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

const { userAdmins, pending, error, refresh, saveUserAdmin, deleteUserAdmin } = useUserAdmins()

// Smooth client-side filtering for user admins
const filteredUserAdmins = computed(() => {
  return userAdmins.value.filter((adm) => {
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const match =
        (adm.name && adm.name.toLowerCase().includes(q)) ||
        (adm.email && adm.email.toLowerCase().includes(q)) ||
        (adm.userId && adm.userId.toLowerCase().includes(q)) ||
        (adm.phone && adm.phone.toLowerCase().includes(q))
      if (!match) return false
    }
    if (selectedRole.value && adm.role !== selectedRole.value) return false
    if (selectedStatus.value && adm.status !== selectedStatus.value) return false
    return true
  })
})

// Modals
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeAdminForEdit = ref<UserAdmin | null>(null)
const adminToDelete = ref<UserAdmin | null>(null)
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
  activeAdminForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(user: UserAdmin) {
  isEditMode.value = true
  activeAdminForEdit.value = user
  isFormModalOpen.value = true
}

async function handleFormSubmit(payload: Partial<UserAdmin>) {
  isBusy.value = true
  try {
    await saveUserAdmin(payload)
    isFormModalOpen.value = false
    showToast(isEditMode.value ? 'User Admin updated successfully' : 'User Admin created successfully')
  } catch (err: any) {
    showToast(err?.message || 'Failed to save User Admin')
  } finally {
    isBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!adminToDelete.value) return
  isBusy.value = true
  try {
    await deleteUserAdmin(adminToDelete.value.id)
    showToast(`User Admin '${adminToDelete.value.name}' deleted successfully`)
    adminToDelete.value = null
  } catch (err: any) {
    showToast(err?.message || 'Failed to delete User Admin')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'userId', label: 'User ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'storesText', label: 'Stores' },
  { key: 'status', label: 'Status' },
]

const printableAdmins = computed(() =>
  filteredUserAdmins.value.map((a) => ({
    ...a,
    storesText: a.stores.join(', '),
  }))
)

function handleExportExcel() {
  const header = ['User ID', 'Name', 'Email', 'Role', 'Stores', 'Status', 'Phone']
  const rows = filteredUserAdmins.value.map((a) => [
    `"${a.userId}"`,
    `"${a.name.replace(/"/g, '""')}"`,
    `"${a.email}"`,
    `"${a.role}"`,
    `"${a.stores.join(', ')}"`,
    `"${a.status}"`,
    `"${a.phone || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `user_admins_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('User Admins exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <SalesListHeader
      title="User Admin"
      subtitle="Kelola User & Role Toko"
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
      :skeleton-cols="7"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load user admins. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Table -->
    <UserAdminRecordsTable
      v-if="!pending && !error"
      :user-admins="filteredUserAdmins"
      :search-query="searchQuery"
      :selected-role="selectedRole"
      :selected-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:selected-role="selectedRole = $event"
      @update:selected-status="selectedStatus = $event"
      @edit="handleEdit"
      @delete="adminToDelete = $event"
    />

    <!-- Add / Edit Modal -->
    <UserAdminFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :user="activeAdminForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation -->
    <SalesConfirmDelete
      :open="!!adminToDelete"
      :busy="isBusy"
      title="Delete User Admin"
      :description="`Are you sure you want to delete user admin '${adminToDelete?.name}'? This action cannot be undone.`"
      @close="adminToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <!-- Print Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Daftar Pengguna Administrator Toko"
      :columns="printColumns"
      :items="printableAdmins"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

