<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Internal Paper Sizes" subtitle="Manage your workshop's own paper size standards">
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
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add New Paper Size</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search size name or unit..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Nama Ukuran</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Dimensi</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="s in filteredSizes" :key="s.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ s.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-mono">{{ s.dimension }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ s.unit }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ s.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="s.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="s" @edit="openEditModal(s)" @delete="deleteSize(s.id)" />
              </td>
            </tr>
            <tr v-if="filteredSizes.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No paper sizes found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Paper Size' : 'Add New Paper Size'" maxWidth="md">
      <form @submit.prevent="saveSize" class="space-y-4">
        <CommonFormField label="Size Name / Code" required>
          <input
            v-model="form.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Plano 65x100, A4, F4"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Panjang (Length)" required>
            <input
              v-model.number="form.length"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Lebar (Width)" required>
            <input
              v-model.number="form.width"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Unit">
            <select
              v-model="form.unit"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="inch">inch</option>
            </select>
          </CommonFormField>
          <CommonToggleSwitch v-model="formActive" label="Status Active" />
        </div>
        <CommonModalFooter :submit-label="isEdit ? 'Update' : 'Submit'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasUkuranSelfData } = await useFetch<SelfPaperSize[]>('/api/kertas-ukuran-self')
const sizes = ref<SelfPaperSize[]>(kertasUkuranSelfData.value ?? [])
useMockSync('kertas-ukuran-self', sizes)

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const filteredSizes = computed(() => {
  return sizes.value.filter(s => {
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.dimension.includes(searchQuery.value)
    return matchStatus && matchSearch
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  name: '',
  length: 65,
  width: 100,
  unit: 'cm',
  status: 'Active' as 'Active' | 'Inactive'
})

const formActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Inactive'
  }
})

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    length: 65,
    width: 100,
    unit: 'cm',
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(s: SelfPaperSize) {
  isEdit.value = true
  currentId.value = s.id
  form.value = {
    name: s.name,
    length: s.length,
    width: s.width,
    unit: s.unit,
    status: s.status
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveSize() {
  const dimensionStr = `${form.value.length} x ${form.value.width}`
  const now = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  if (isEdit.value && currentId.value !== null) {
    const idx = sizes.value.findIndex(s => s.id === currentId.value)
    if (idx !== -1) {
      sizes.value[idx] = {
        ...sizes.value[idx],
        name: form.value.name,
        length: form.value.length,
        width: form.value.width,
        dimension: dimensionStr,
        unit: form.value.unit,
        status: form.value.status,
        update: now
      }
    }
  } else {
    const newId = sizes.value.length ? Math.max(...sizes.value.map(s => s.id)) + 1 : 1
    sizes.value.unshift({
      id: newId,
      name: form.value.name,
      length: form.value.length,
      width: form.value.width,
      dimension: dimensionStr,
      unit: form.value.unit,
      status: form.value.status,
      update: now
    })
  }
  closeModal()
}

function deleteSize(id: number) {
  if (confirm('Are you sure you want to delete this paper size?')) {
    sizes.value = sizes.value.filter(s => s.id !== id)
  }
}

function exportPdf() {
  alert('Exporting paper sizes as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>
=======
<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '#server/types/paper-shop'
import PaperSizeStatsWidgets from '~/components/pages/paper-shop/PaperSizeStatsWidgets.vue'
import PaperSizeRecordsTable from '~/components/pages/paper-shop/PaperSizeRecordsTable.vue'
import PaperSizeFormModal from '~/components/pages/paper-shop/PaperSizeFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Paper Sizes - Master Ukuran Kertas',
  sweetAlert: false
})

const { sizes, stats, pending, error, refresh, saveSize, deleteSize } = usePaperSizesSelf()

const isFormModalOpen = ref(false)
const selectedSize = ref<PaperSize | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedSize.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: PaperSize) {
  selectedSize.value = item
  isFormModalOpen.value = true
}

function handleDelete(id: string) {
  deleteTargetId.value = id
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteSize(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper size:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperSizeFormData) {
  isSaving.value = true
  try {
    await saveSize(payload)
    isFormModalOpen.value = false
    selectedSize.value = null
  } catch (err) {
    console.error('Failed to save paper size:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-ukuran-self space-y-6">
    <SalesListHeader
      title="Paper Sizes"
      subtitle="Master dimensi dan ukuran standar kertas cetak"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Stats Widgets -->
    <PaperSizeStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !sizes.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data paper size'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PaperSizeRecordsTable
      v-else
      :sizes="sizes"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperSizeFormModal
      :open="isFormModalOpen"
      :size="selectedSize"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Paper Size"
      message="Apakah Anda yakin ingin menghapus data ukuran kertas ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
>>>>>>> origin/eko
