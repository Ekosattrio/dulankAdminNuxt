<<<<<<< HEAD
<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Minimum Charges & Finishing Base Rates</h4>
            <h6>Configure minimum thresholds and unit costs for post-press finishing operations</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add Minimum Component
          </button>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search finishing process..." />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Nama Jasa / Finishing</th>
                  <th class="text-end">Tarif Satuan</th>
                  <th class="text-end">Minim Biaya (Floor)</th>
                  <th>Satuan</th>
                  <th class="text-center">Formula Usage</th>
                  <th>Last Update</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in filteredComponents" :key="c.id">
                  <td class="fw-bold text-dark">{{ c.name }}</td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(c.rate) }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(c.minim) }}</td>
                  <td><span class="badge bg-light text-dark border">{{ c.unit }}</span></td>
                  <td class="text-center">
                    <span class="badge bg-info bg-opacity-10 text-primary fw-bold px-2 py-1">
                      {{ c.used }} calculations
                    </span>
                  </td>
                  <td>{{ c.update }}</td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Component"
                        @click="openEditModal(c)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Component"
                        @click="deleteComponent(c.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredComponents.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">
                    No minimum components found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="modalVisible"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Minimum Component' : 'Add Minimum Component' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveComponent">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Service / Finishing Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Potong, Mobilisasi, Spiral" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Tarif Satuan (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.rate" type="number" class="form-control" required placeholder="2000" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Minim Biaya / Floor (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.minim" type="number" class="form-control" required placeholder="30000" />
                </div>
                <div class="col-12">
                  <label class="form-label">Satuan Ukur <span class="text-danger">*</span></label>
                  <input v-model="form.unit" type="text" class="form-control" required placeholder="Kg, Lembar, Cm, Buku" />
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Component' : 'Save Component' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <SalesConfirmDelete :open="deleteTargetId !== null" title="Delete Minimum Component" message="Are you sure you want to delete this minimum charge rule?" @close="deleteTargetId = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Minimum Charges & Finishing Base Rates" :columns="printColumns" :items="filteredComponents" :default-action="print.defaultPrintAction.value" :show-date-range="false" @close="print.closePrintModal" />
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: komponenMinimumData } = await useFetch<MinimumComponent[]>('/api/komponen-minimum')
const components = ref<MinimumComponent[]>(komponenMinimumData.value ?? [])
useMockSync('komponen-minimum', components)

const searchQuery = ref('')
const deleteTargetId = ref<number | null>(null)
const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Service / Finishing' },
  { key: 'rate', label: 'Rate', align: 'right' as const },
  { key: 'minim', label: 'Minimum Charge', align: 'right' as const },
  { key: 'unit', label: 'Unit' },
  { key: 'used', label: 'Used', align: 'right' as const },
  { key: 'update', label: 'Updated' },
]

const filteredComponents = computed(() => {
  return components.value.filter(c => {
    return !searchQuery.value ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.unit.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  name: '',
  rate: 2000,
  minim: 30000,
  unit: 'Kg'
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    rate: 2000,
    minim: 50000,
    unit: 'Lembar'
  }
  modalVisible.value = true
}

function openEditModal(c: MinimumComponent) {
  isEdit.value = true
  currentId.value = c.id
  form.value = {
    name: c.name,
    rate: c.rate,
    minim: c.minim,
    unit: c.unit
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveComponent() {
  const now = new Date().toLocaleDateString('en-GB')
  if (isEdit.value && currentId.value !== null) {
    const idx = components.value.findIndex(c => c.id === currentId.value)
    if (idx !== -1) {
      components.value[idx] = {
        ...components.value[idx],
        name: form.value.name,
        rate: form.value.rate,
        minim: form.value.minim,
        unit: form.value.unit,
        update: now
      }
    }
  } else {
    const newId = components.value.length ? Math.max(...components.value.map(c => c.id)) + 1 : 1
    components.value.unshift({
      id: newId,
      name: form.value.name,
      rate: form.value.rate,
      minim: form.value.minim,
      unit: form.value.unit,
      used: 0,
      update: now
    })
  }
  closeModal()
}

function deleteComponent(id: number) {
  deleteTargetId.value = id
}

function confirmDelete() {
  if (deleteTargetId.value === null) return
  components.value = components.value.filter(c => c.id !== deleteTargetId.value)
  deleteTargetId.value = null
}

function exportPdf() {
  print.openPrintModal('pdf')
}

function printTable() {
  print.openPrintModal('print')
}

function refresh() {
  searchQuery.value = ''
}</script>

=======
<script setup lang="ts">
import type { KomponenMinimumItem, KomponenMinimumFormData } from '#server/types/calculator-components'
import KomponenMinimumRecordsTable from '~/components/pages/calculator/components/KomponenMinimumRecordsTable.vue'
import KomponenMinimumFormModal from '~/components/pages/calculator/components/KomponenMinimumFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Minimum Charges & Finishing Base Rates',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveItem, deleteItem } = useKomponenMinimum()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenMinimumItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedItem.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: KomponenMinimumItem) {
  selectedItem.value = item
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
    await deleteItem(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete minimum component:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: KomponenMinimumFormData) {
  isSaving.value = true
  try {
    await saveItem(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save minimum component:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-komponen-minimum space-y-6">
    <SalesListHeader
      title="Minimum Charges & Finishing Base Rates"
      subtitle="Kelola threshold minimum biaya dan tarif dasar finishing pasca cetak"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !items.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat komponen minimum'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <KomponenMinimumRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <KomponenMinimumFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Minimum"
      message="Apakah Anda yakin ingin menghapus data komponen minimum ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
>>>>>>> origin/eko
