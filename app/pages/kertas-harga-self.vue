<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Internal Paper Prices" subtitle="Manage your workshop's own paper pricing">
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
            <span>Add New Paper Price</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search paper name or merk..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Nama Kertas / Format</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Group Kertas</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Merk</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ukuran</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Satuan</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">GSM</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Min Order</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Kelipatan</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Harga</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="p in filteredPrices" :key="p.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ p.nama }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.group }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.merk }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-mono">{{ p.ukuran }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.satuan }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center font-bold">{{ p.gramatur }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.minOrder }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ p.kelipatan }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(p.harga) }} / {{ p.satuan }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ p.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="p.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="p" @edit="openEditModal(p)" @delete="deletePrice(p.id)" />
              </td>
            </tr>
            <tr v-if="filteredPrices.length === 0">
              <td colspan="12" class="p-8 text-center text-gray-400">No paper prices found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Paper Price' : 'Add New Paper Price'" maxWidth="lg">
      <form @submit.prevent="savePrice" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Nama Kertas / Format" required>
            <input
              v-model="form.nama"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. A4, Plano"
            />
          </CommonFormField>
          <CommonFormField label="Group Kertas" required>
            <select
              v-model="form.group"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="HVS Putih">HVS Putih</option>
              <option value="Art Paper">Art Paper</option>
              <option value="Art Carton">Art Carton</option>
              <option value="Ivory">Ivory</option>
              <option value="Duplex">Duplex</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Merk / Brand">
            <input
              v-model="form.merk"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="e.g. Paperone, Pindo Deli"
            />
          </CommonFormField>
          <CommonFormField label="Ukuran (cm)">
            <input
              v-model="form.ukuran"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="65x100 cm"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CommonFormField label="Satuan" required>
            <select
              v-model="form.satuan"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="lembar">Lembar Plano</option>
              <option value="rim">Rim (500 lbr)</option>
              <option value="kg">Kg</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Gramatur (GSM)">
            <input
              v-model.number="form.gramatur"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="Harga (Rp)" required>
            <input
              v-model.number="form.harga"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="50000"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Min Order">
            <input
              v-model.number="form.minOrder"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="Kelipatan">
            <input
              v-model.number="form.kelipatan"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <CommonToggleSwitch v-model="formActive" label="Status Active" />
        <CommonModalFooter :submit-label="isEdit ? 'Update' : 'Submit'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasHargaSelfData } = await useFetch<SelfPaperPrice[]>('/api/kertas-harga-self')
const prices = ref<SelfPaperPrice[]>(kertasHargaSelfData.value ?? [])
useMockSync('kertas-harga-self', prices)

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const filteredPrices = computed(() => {
  return prices.value.filter(p => {
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(p.gramatur).includes(searchQuery.value)
    return matchStatus && matchSearch
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  nama: '',
  group: 'HVS Putih',
  merk: '',
  ukuran: '65x100 cm',
  satuan: 'lembar',
  gramatur: 150,
  minOrder: '1 lembar',
  kelipatan: '10 lembar',
  harga: 2500,
  status: 'Active' as 'Active' | 'Inactive'
})

const formActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Inactive'
  }
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    nama: '',
    group: 'Art Paper',
    merk: '',
    ukuran: '65x100 cm',
    satuan: 'lembar',
    gramatur: 150,
    minOrder: '1 lembar',
    kelipatan: '10 lembar',
    harga: 2500,
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(p: SelfPaperPrice) {
  isEdit.value = true
  currentId.value = p.id
  form.value = { ...p }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function savePrice() {
  const now = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (isEdit.value && currentId.value !== null) {
    const idx = prices.value.findIndex(p => p.id === currentId.value)
    if (idx !== -1) {
      prices.value[idx] = { ...prices.value[idx], ...form.value, update: now }
    }
  } else {
    const newId = prices.value.length ? Math.max(...prices.value.map(p => p.id)) + 1 : 1
    prices.value.unshift({ id: newId, ...form.value, update: now })
  }
  closeModal()
}

function deletePrice(id: number) {
  if (confirm('Are you sure you want to delete this paper price configuration?')) {
    prices.value = prices.value.filter(p => p.id !== id)
  }
}

function exportPdf() {
  alert('Exporting paper prices as PDF...')
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
import type { PaperPrice, PaperPriceFormData } from '#server/types/paper-shop'
import PaperPriceStatsWidgets from '~/components/pages/paper-shop/PaperPriceStatsWidgets.vue'
import PaperPriceRecordsTable from '~/components/pages/paper-shop/PaperPriceRecordsTable.vue'
import PaperPriceFormModal from '~/components/pages/paper-shop/PaperPriceFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Paper Prices - Master Harga Kertas',
  sweetAlert: false
})

const { prices, stats, pending, error, refresh, savePrice, deletePrice } = usePaperPricesSelf()
const { groups } = usePaperGroupsSelf()

const isFormModalOpen = ref(false)
const selectedPrice = ref<PaperPrice | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedPrice.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: PaperPrice) {
  selectedPrice.value = item
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
    await deletePrice(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper price:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperPriceFormData) {
  isSaving.value = true
  try {
    await savePrice(payload)
    isFormModalOpen.value = false
    selectedPrice.value = null
  } catch (err) {
    console.error('Failed to save paper price:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-harga-self space-y-6">
    <SalesListHeader
      title="Paper Prices"
      subtitle="Master daftar harga kertas berdasarkan grup, merk, ukuran dan satuan"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Stats Widgets -->
    <PaperPriceStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !prices.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data harga kertas'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PaperPriceRecordsTable
      v-else
      :prices="prices"
      :groups="groups"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperPriceFormModal
      :open="isFormModalOpen"
      :price="selectedPrice"
      :groups="groups"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Harga Kertas"
      message="Apakah Anda yakin ingin menghapus data harga kertas ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
>>>>>>> origin/eko
