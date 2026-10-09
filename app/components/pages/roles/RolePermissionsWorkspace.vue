<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SystemRole } from '#server/types/user-management'
import { useRoles } from '~/composables/useRoles'
import { useTablePrint } from '~/composables/useTablePrint'
import RoleRecordsTable from '~/components/pages/roles/RoleRecordsTable.vue'
import RoleFormModal from '~/components/pages/roles/RoleFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'

const searchQuery = ref('')
const sortOrder = ref('newest')

const { roles, pending, error, refresh, saveRole, deleteRole } = useRoles()

// Smooth client-side filtering and sorting for roles
const filteredRoles = computed(() => {
  let list = [...roles.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((r) =>
      r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))
    )
  }
  list.sort((a, b) => {
    const diff = (a.createdOn || '').localeCompare(b.createdOn || '')
    return sortOrder.value === 'newest' ? -diff : diff
  })
  return list
})

// Modals
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeRoleForEdit = ref<SystemRole | null>(null)
const roleToDelete = ref<SystemRole | null>(null)
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
  activeRoleForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(role: SystemRole) {
  isEditMode.value = true
  activeRoleForEdit.value = role
  isFormModalOpen.value = true
}

async function handleFormSubmit(payload: Partial<SystemRole>) {
  isBusy.value = true
  try {
    await saveRole(payload)
    await refresh()
    isFormModalOpen.value = false
    activeRoleForEdit.value = null
    showToast(isEditMode.value ? 'Role updated successfully' : 'Role created successfully')
  } catch (err: any) {
    showToast(err?.message || 'Failed to save Role')
  } finally {
    isBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!roleToDelete.value) return
  isBusy.value = true
  try {
    await deleteRole(roleToDelete.value.id)
    showToast(`Role '${roleToDelete.value.name}' deleted successfully`)
    roleToDelete.value = null
  } catch (err: any) {
    showToast(err?.message || 'Failed to delete Role')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'name', label: 'Role Name' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'description', label: 'Description' },
]

function handleExportExcel() {
  const header = ['Role Name', 'Created On', 'Description']
  const rows = filteredRoles.value.map((r) => [
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.createdOn}"`,
    `"${(r.description || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `roles_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Roles exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <SalesListHeader
      title="Roles & Permission"
      subtitle="Manage your roles"
      add-label="Add New Role"
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
      :skeleton-cols="3"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load roles. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Table -->
    <RoleRecordsTable
      v-if="!pending && !error"
      :roles="filteredRoles"
      :search-query="searchQuery"
      :sort-order="sortOrder"
      @update:search-query="searchQuery = $event"
      @update:sort-order="sortOrder = $event"
      @edit="handleEdit"
      @delete="roleToDelete = $event"
    />

    <!-- Add / Edit Modal -->
    <RoleFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :role="activeRoleForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation -->
    <SalesConfirmDelete
      :open="!!roleToDelete"
      :busy="isBusy"
      title="Delete Role"
      :description="`Are you sure you want to delete role '${roleToDelete?.name}'? This action cannot be undone.`"
      @close="roleToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <!-- Print Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Daftar Peran Pengguna (System Roles)"
      :columns="printColumns"
      :items="roles"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

