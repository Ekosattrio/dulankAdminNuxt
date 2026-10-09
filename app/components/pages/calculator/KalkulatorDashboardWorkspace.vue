<script setup lang="ts">
import type { CalculatorDashboardUser } from '#server/types/calculator-dashboard'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import CalculatorDashboardTelemetry from './dashboard/CalculatorDashboardTelemetry.vue'
import CalculatorDashboardTable from './dashboard/CalculatorDashboardTable.vue'
import CalculatorDashboardViewModal from './dashboard/CalculatorDashboardViewModal.vue'
import CalculatorDashboardEditModal from './dashboard/CalculatorDashboardEditModal.vue'

const { telemetry, users, pending, error, refresh, updateUser, deleteUser } = useCalculatorDashboard()

const isHeaderCollapsed = ref(false)
const viewingUser = ref<CalculatorDashboardUser | null>(null)
const isViewModalOpen = ref(false)

const editingUser = ref<CalculatorDashboardUser | null>(null)
const isEditModalOpen = ref(false)
const isSaving = ref(false)

const deletingUser = ref<CalculatorDashboardUser | null>(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

function handleView(item: CalculatorDashboardUser) {
  viewingUser.value = item
  isViewModalOpen.value = true
}

function handleEdit(item: CalculatorDashboardUser) {
  editingUser.value = item
  isEditModalOpen.value = true
}

function handleDelete(item: CalculatorDashboardUser) {
  deletingUser.value = item
  isDeleteModalOpen.value = true
}

async function confirmSaveEdit(payload: Partial<CalculatorDashboardUser>) {
  if (!editingUser.value) return
  isSaving.value = true
  try {
    await updateUser(editingUser.value.id, payload)
    isEditModalOpen.value = false
    editingUser.value = null
  } catch (err) {
    console.error('Failed to update calculator user:', err)
  } finally {
    isSaving.value = false
  }
}

async function confirmDeleteUser() {
  if (!deletingUser.value) return
  isDeleting.value = true
  try {
    await deleteUser(deletingUser.value.id)
    isDeleteModalOpen.value = false
    deletingUser.value = null
  } catch (err) {
    console.error('Failed to delete calculator user:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Kalkulator Dashboard"
      subtitle="Manage and monitor printing calculator utilization & estimators"
      :refreshing="pending"
      @refresh="refresh"
    />

    <SalesFeedback
      v-if="pending && !users.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data kalkulator dashboard'"
      @retry="refresh"
    />

    <template v-else>
      <!-- Telemetry Sparklines Card -->
      <CalculatorDashboardTelemetry
        v-if="!isHeaderCollapsed"
        :telemetry="telemetry"
      />

      <!-- Standard Table -->
      <CalculatorDashboardTable
        :users="users"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </template>

    <!-- Modals -->
    <CalculatorDashboardViewModal
      :open="isViewModalOpen"
      :user="viewingUser"
      @close="isViewModalOpen = false"
    />

    <CalculatorDashboardEditModal
      :open="isEditModalOpen"
      :user="editingUser"
      :busy="isSaving"
      @close="isEditModalOpen = false"
      @submit="confirmSaveEdit"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Rekor Estimator"
      message="Apakah Anda yakin ingin menghapus data rekor estimator ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDeleteUser"
    />
  </div>
</template>
