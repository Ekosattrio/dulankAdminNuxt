<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ClientItem, ClientFormData } from '#server/types/client'
import { useClients } from '~/composables/useClients'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import ClientFormModal from '~/components/pages/our-client/ClientFormModal.vue'
import ClientDraggableGrid from '~/components/pages/our-client/ClientDraggableGrid.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { clients, pending, error, refresh, saveClient, deleteClient, reorderClients } = useClients()

// Local reactive list for instant zero-latency drag reordering
const clientList = ref<ClientItem[]>([])

watch(
  clients,
  (newClients) => {
    if (newClients && newClients.length > 0) {
      clientList.value = [...newClients].sort((a, b) => (a.order || 0) - (b.order || 0))
    }
  },
  { immediate: true },
)

// Modal management
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeClientForEdit = ref<ClientItem | null>(null)
const clientToDelete = ref<ClientItem | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'order', label: 'Order', align: 'center' as const },
  { key: 'name', label: 'Client Name' },
  { key: 'category', label: 'Category' },
  { key: 'website', label: 'Website' },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'createdDate', label: 'Created Date', align: 'center' as const },
]

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

function handleAdd() {
  isEditMode.value = false
  activeClientForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(client: ClientItem) {
  isEditMode.value = true
  activeClientForEdit.value = client
  isFormModalOpen.value = true
}

function handleDelete(client: ClientItem) {
  clientToDelete.value = client
}

async function handleReorder(updatedList: ClientItem[]) {
  clientList.value = updatedList
  try {
    const ids = updatedList.map(c => c.id)
    await reorderClients(ids)
    showToast('Client order updated successfully')
  } catch (err: any) {
    showToast('Failed to save order on server')
  }
}

async function handleFormSubmit(formData: ClientFormData) {
  isBusy.value = true
  try {
    const res = await saveClient(formData)
    isFormModalOpen.value = false
    showToast(res?.message || (isEditMode.value ? 'Client updated successfully' : 'Client created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save client')
  } finally {
    isBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!clientToDelete.value) return
  isBusy.value = true
  try {
    await deleteClient(clientToDelete.value.id)
    showToast(`Client '${clientToDelete.value.name}' deleted successfully`)
    clientToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete client')
  } finally {
    isBusy.value = false
  }
}

async function resetDefaultOrder() {
  isBusy.value = true
  try {
    const sorted = [...clientList.value].sort((a, b) => a.name.localeCompare(b.name))
    clientList.value = sorted
    await reorderClients(sorted.map(c => c.id))
    showToast('Client order reset alphabetically')
  } catch (err: any) {
    showToast('Failed to reset order')
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <SalesListHeader
      title="Our Client"
      subtitle="List Our Client"
      add-label="Add Client"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Reset to Alphabetical Order"
          class="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          :disabled="isBusy"
          @click="resetDefaultOrder"
        >
          <FeatherIcon name="refresh-cw" size="13" />
          <span>Reset Order</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-4">
      <div
        v-for="i in 12"
        :key="i"
        class="h-28 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-800"
      />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400">
      <p class="font-semibold mb-2">Gagal memuat logo klien</p>
      <button
        type="button"
        class="rounded-md bg-rose-600 px-3 py-1.5 text-xs text-white hover:bg-rose-700"
        @click="refresh"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Draggable Grid Component -->
    <ClientDraggableGrid
      v-else
      :clients="clientList"
      :is-busy="isBusy"
      @edit="handleEdit"
      @delete="handleDelete"
      @reorder="handleReorder"
    />

    <!-- Add / Edit Modal -->
    <ClientFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :client-data="activeClientForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!clientToDelete"
      :busy="isBusy"
      title="Delete Client Logo"
      :message="`Are you sure you want to delete client '${clientToDelete?.name}'?`"
      @close="clientToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Our Client Report"
      subtitle="Client directory and publication status"
      :columns="printColumns"
      :items="clientList"
      date-field="createdDate"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
