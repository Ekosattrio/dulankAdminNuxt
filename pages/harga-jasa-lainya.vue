<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Komponen Cetak & Jasa Lainnya</h4>
            <h6>Manage auxiliary print services and finishing tariffs</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add New Komponen Cetak
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search jasa..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: showFilter }"
                @click="showFilter = !showFilter"
              >
                <i class="ti ti-filter me-1"></i>Filter
              </button>
            </div>
          </div>

          <!-- Filter Panel -->
          <div v-if="showFilter" class="card bg-light border-0 mb-3">
            <div class="card-body py-3">
              <div class="row g-3">
                <div class="col-12 col-md-4">
                  <label class="form-label text-muted small mb-1">Filter Satuan</label>
                  <select v-model="filterUnit" class="form-select form-select-sm">
                    <option value="">Semua Satuan</option>
                    <option value="Kg">Kg</option>
                    <option value="Lembar">Lembar</option>
                    <option value="Cm">Cm</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
                <div class="col-12 col-md-4 d-flex align-items-end">
                  <button class="btn btn-sm btn-outline-danger" @click="resetFilter">
                    <i class="ti ti-x me-1"></i>Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Nama Jasa</th>
                  <th class="text-end">Harga</th>
                  <th class="text-end">Minim Harga</th>
                  <th>Satuan</th>
                  <th class="text-center" style="width: 120px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredList" :key="item.id">
                  <td class="fw-bold text-dark">{{ item.name }}</td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(item.harga) }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(item.minimHarga) }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.satuan }}</span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-info" title="View" @click="viewDetail(item)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteItem(item.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">
                    No components found matching your search.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Komponen Cetak' : 'Add New Komponen Cetak' }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveItem">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Nama Jasa <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. Potong, Spiral, Mobilisasi" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Harga Satuan (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="formData.harga" type="number" class="form-control" min="0" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Minim Harga (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="formData.minimHarga" type="number" class="form-control" min="0" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Satuan <span class="text-danger">*</span></label>
                <select v-model="formData.satuan" class="form-select" required>
                  <option value="Kg">Kg</option>
                  <option value="Lembar">Lembar</option>
                  <option value="Cm">Cm</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Roll">Roll</option>
                  <option value="Set">Set</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Jasa' : 'Save Jasa' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Detail Modal -->
    <div v-if="detailModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Detail Jasa Cetak</h5>
            <button type="button" class="btn-close" @click="detailModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedItem">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Nama Jasa</span>
                <span class="fw-bold">{{ selectedItem.name }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Tarif Satuan</span>
                <span class="fw-semibold">Rp {{ formatNumber(selectedItem.harga) }} / {{ selectedItem.satuan }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Minimal Charge</span>
                <span class="fw-bold text-primary">Rp {{ formatNumber(selectedItem.minimHarga) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Satuan Pengukuran</span>
                <span class="badge bg-light text-dark border">{{ selectedItem.satuan }}</span>
              </li>
            </ul>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="detailModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Komponen Cetak & Jasa Lainnya - Kacetak System'
})

interface JasaLain {
  id: number
  name: string
  harga: number
  minimHarga: number
  satuan: string
}

const items = ref<JasaLain[]>([
  { id: 1, name: 'Potong', harga: 2000, minimHarga: 30000, satuan: 'Kg' },
  { id: 2, name: 'Mobilisasi', harga: 2500, minimHarga: 150000, satuan: 'Kg' },
  { id: 3, name: 'Susun Komplit Kalender', harga: 40, minimHarga: 100000, satuan: 'Lembar' },
  { id: 4, name: '1 Lipatan', harga: 10, minimHarga: 200000, satuan: 'Lembar' },
  { id: 5, name: '2 Lipatan', harga: 15, minimHarga: 350000, satuan: 'Lembar' },
  { id: 6, name: 'Spiral', harga: 150, minimHarga: 350000, satuan: 'Cm' },
  { id: 7, name: 'Jepit Kaleng', harga: 30, minimHarga: 300000, satuan: 'Cm' },
  { id: 8, name: 'Mata Ayam', harga: 20, minimHarga: 200000, satuan: 'Pcs' }
])

const searchQuery = ref('')
const filterUnit = ref('')
const showFilter = ref(false)

const filteredList = computed(() => {
  return items.value.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchUnit = filterUnit.value ? item.satuan === filterUnit.value : true
    return matchQuery && matchUnit
  })
})

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

function resetFilter() {
  filterUnit.value = ''
  searchQuery.value = ''
}

// Modal Form
const modalVisible = ref(false)
const isEditing = ref(false)
const detailModalVisible = ref(false)
const selectedItem = ref<JasaLain | null>(null)

const formData = reactive({
  id: 0,
  name: '',
  harga: 0,
  minimHarga: 0,
  satuan: 'Kg'
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.harga = 0
  formData.minimHarga = 0
  formData.satuan = 'Kg'
  modalVisible.value = true
}

function openEditModal(item: JasaLain) {
  isEditing.value = true
  formData.id = item.id
  formData.name = item.name
  formData.harga = item.harga
  formData.minimHarga = item.minimHarga
  formData.satuan = item.satuan
  modalVisible.value = true
}

function viewDetail(item: JasaLain) {
  selectedItem.value = item
  detailModalVisible.value = true
}

function saveItem() {
  if (isEditing.value) {
    const idx = items.value.findIndex(i => i.id === formData.id)
    if (idx !== -1) {
      items.value[idx] = { ...formData }
    }
  } else {
    items.value.push({
      ...formData,
      id: Date.now()
    })
  }
  modalVisible.value = false
}

function deleteItem(id: number) {
  if (confirm('Are you sure you want to delete this service component?')) {
    items.value = items.value.filter(i => i.id !== id)
  }
}

function exportPdf() {
  alert('Exporting PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterUnit.value = ''
}
</script>

