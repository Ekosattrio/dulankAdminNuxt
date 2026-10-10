<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ClientItem, ClientFormData } from '#server/types/client'
import { useClients } from '~/composables/useClients'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import ClientFormModal from '~/components/Pages/OurClient/ClientFormModal.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const { clients, pending, error, refresh, saveClient, deleteClient, reorderClients } = useClients()

// Local reactive list for instant zero-latency drag reordering
const clientList = ref<ClientItem[]>([])

watch(
  clients,
  (newClients) => {
    if (newClients && newClients.length > 0) {
      // Sort by order ascending
      clientList.value = [...newClients].sort((a, b) => (a.order || 0) - (b.order || 0))
    }
  },
  { immediate: true },
)

// Drag and drop state
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const isDragging = ref(false)

function onDragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  if (dragOverIndex.value !== index) {
    dragOverIndex.value = index
  }
}

function onDragLeave(index: number) {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

async function onDrop(targetIndex: number) {
  if (dragIndex.value === null || dragIndex.value === targetIndex) {
    onDragEnd()
    return
  }

  const fromIndex = dragIndex.value
  const updatedList = [...clientList.value]
  const [movedItem] = updatedList.splice(fromIndex, 1)
  if (!movedItem) {
    onDragEnd()
    return
  }
  updatedList.splice(targetIndex, 0, movedItem)

  // Update order property
  updatedList.forEach((item, idx) => {
    item.order = idx + 1
  })

  clientList.value = updatedList
  onDragEnd()

  // Persist new order to server
  try {
    const ids = updatedList.map(c => c.id)
    await reorderClients(ids)
    showToast(`Order updated: ${movedItem.name} moved to position #${targetIndex + 1}`)
  } catch (err: any) {
    showToast('Failed to save order on server')
  }
}

function onDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
  isDragging.value = false
}

// Modal management
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeClientForEdit = ref<ClientItem | null>(null)
const clientToDelete = ref<ClientItem | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')
let toastTimer: any = null

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
        @click="refresh()"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Draggable Grid matching screenshot (6 columns on md+) -->
    <div
      v-else
      id="client-grid"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-4 select-none"
    >
      <div
        v-for="(client, index) in clientList"
        :key="client.id"
        draggable="true"
        :data-id="client.id"
        :data-order="index + 1"
        @dragstart="onDragStart(index, $event)"
        @dragover="onDragOver(index, $event)"
        @dragleave="onDragLeave(index)"
        @drop="onDrop(index)"
        @dragend="onDragEnd"
        :class="[
          'group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 min-h-[130px]',
          'border cursor-grab active:cursor-grabbing',
          dragIndex === index
            ? 'opacity-40 scale-95 border-dashed border-2 border-primary bg-primary/5 shadow-inner'
            : dragOverIndex === index
              ? 'scale-105 border-2 border-primary bg-white shadow-2xl ring-4 ring-primary/20 dark:bg-gray-800 z-10'
              : 'bg-white border-transparent hover:border-gray-200 hover:shadow-xl hover:-translate-y-0.5 dark:bg-gray-850 dark:border-transparent dark:hover:border-gray-700'
        ]"
      >
        <!-- Floating Drag Handle & Quick Actions on Hover -->
        <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            type="button"
            title="Edit Client"
            class="size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-primary hover:text-white text-gray-500 transition dark:bg-gray-800 dark:text-gray-400"
            @click.stop="handleEdit(client)"
          >
            <FeatherIcon name="edit-2" size="11" />
          </button>
          <button
            type="button"
            title="Delete Client"
            class="size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-rose-600 hover:text-white text-rose-500 transition dark:bg-gray-800"
            @click.stop="handleDelete(client)"
          >
            <FeatherIcon name="trash" size="11" />
          </button>
        </div>

        <!-- Position Badge on Hover -->
        <div class="absolute top-2 left-2 text-[10px] font-mono text-gray-400 group-hover:text-primary transition">
          #{{ index + 1 }}
        </div>

        <!-- Vector SVG Logo or Image Fallback -->
        <div class="w-full flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors px-2 py-3">
          <!-- Native Inline SVG from JSON/HTML -->
          <svg
            v-if="client.svgPath"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="65"
            fill="currentColor"
            :viewBox="client.viewBox || '0 0 284 65'"
            class="max-h-[65px] w-full object-contain pointer-events-none"
          >
            <path
              :d="client.svgPath"
              :fill-rule="client.fillRule || 'nonzero'"
            />
          </svg>

          <!-- Fallback Image Logo -->
          <img
            v-else-if="client.logoUrl"
            :src="client.logoUrl"
            :alt="client.name"
            class="max-h-14 max-w-full object-contain pointer-events-none"
          />

          <!-- Fallback Text if logo missing -->
          <span v-else class="text-sm font-bold tracking-wide">
            {{ client.name }}
          </span>
        </div>

        <!-- Tooltip/Company Name Label on Hover -->
        <span class="mt-2 text-[11px] font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center truncate max-w-full">
          {{ client.name }}
        </span>
      </div>
    </div>

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

<style scoped>
#client-grid [draggable="true"] {
  cursor: grab;
}
#client-grid [draggable="true"]:active {
  cursor: grabbing;
}
</style>

