<script setup lang="ts">
import type { CalculatorDashboardUser, CalculatorDashboardUserUpdate } from '#server/types/calculator-dashboard'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import CalculatorDashboardTelemetry from './Dashboard/CalculatorDashboardTelemetry.vue'
import CalculatorDashboardTable from './Dashboard/CalculatorDashboardTable.vue'
import CalculatorDashboardViewModal from './Dashboard/CalculatorDashboardViewModal.vue'
import CalculatorDashboardEditModal from './Dashboard/CalculatorDashboardEditModal.vue'

const { telemetry, users, pending, error, refresh, updateUser, deleteUser } = useCalculatorDashboard()

const isHeaderCollapsed = ref(false)
const search = ref('')
const category = ref('')
const currentPageItems = ref<CalculatorDashboardUser[]>([])
const message = ref('')
const actionError = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
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

async function confirmSaveEdit(payload: CalculatorDashboardUserUpdate) {
  if (!editingUser.value) return
  isSaving.value = true
  try {
    await updateUser(editingUser.value.id, payload)
    isEditModalOpen.value = false
    editingUser.value = null
    actionError.value = ''
    message.value = 'User record updated successfully'
  } catch (err) {
    actionError.value = (err as any)?.data?.message || (err as Error)?.message || 'Failed to update calculator user'
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
    actionError.value = ''
    message.value = 'User record deleted successfully'
  } catch (err) {
    actionError.value = (err as any)?.data?.message || (err as Error)?.message || 'Failed to delete calculator user'
  } finally {
    isDeleting.value = false
  }
}

const printColumns = [
  { key: 'user', label: 'User' },
  { key: 'calculate', label: 'Calculate', align: 'right' as const },
  { key: 'request', label: 'Request', align: 'right' as const },
  { key: 'usageLabel', label: 'Usage', align: 'right' as const },
  { key: 'status', label: 'Status' },
]
const printableUsers = computed(() => users.value.map(user => ({ ...user, usageLabel: `${user.usage}%` })))
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Kalkulator Dashboard"
      subtitle="Manage kalkulator"
      :refreshing="pending"
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
          @click="isHeaderCollapsed = !isHeaderCollapsed"
        ><FeatherIcon :name="isHeaderCollapsed ? 'chevron-down' : 'chevron-up'" :size="14" /></button>
      </template>
    </SalesListHeader>

    <SalesFeedback :message="message" :error="actionError" @dismiss="message = ''" @retry="actionError = ''" />

    <SalesFeedback
      v-if="pending && !users.length"
      pending
      skeleton="table"
      :skeleton-cols="6"
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
        :search="search"
        :category="category"
        @update:search="search = $event"
        @update:category="category = $event"
        @update:current-page-items="currentPageItems = $event"
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
      @close="isDeleteModalOpen = false"
      @confirm="confirmDeleteUser"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Kalkulator Dashboard Report"
      subtitle="Manage kalkulator"
      :columns="printColumns"
      :items="printableUsers"
      :current-page-items="currentPageItems"
      :default-action="defaultPrintAction"
      :show-date-range="false"
      @close="closePrintModal"
    />
  </div>
</template>
