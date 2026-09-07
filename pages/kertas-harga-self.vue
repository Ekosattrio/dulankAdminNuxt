<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Paper Price Management</h4>
            <h6>Configure paper base purchasing rates, order increments, and minimum quantities</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Paper Price
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search paper name, group or merk..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || 'All Status' }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = ''; statusDropdownOpen = false">All Status</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Active'; statusDropdownOpen = false">Active</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Inactive'; statusDropdownOpen = false">Inactive</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Nama Kertas</th>
                  <th>Group Kertas</th>
                  <th>Merk</th>
                  <th>Ukuran</th>
                  <th>Satuan</th>
                  <th class="text-center">GSM</th>
                  <th>Min Order</th>
                  <th>Kelipatan</th>
                  <th class="text-end">Harga Kertas</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in filteredPrices" :key="p.id">
                  <td class="fw-bold text-dark">{{ p.nama }}</td>
                  <td>{{ p.group }}</td>
                  <td>{{ p.merk }}</td>
                  <td>{{ p.ukuran }}</td>
                  <td>{{ p.satuan }}</td>
                  <td class="text-center fw-bold">{{ p.gramatur }}</td>
                  <td>{{ p.minOrder }}</td>
                  <td>{{ p.kelipatan }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(p.harga) }} / {{ p.satuan }}</td>
                  <td>{{ p.update }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="p.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ p.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Price"
                        @click="openEditModal(p)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Price"
                        @click="deletePrice(p.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPrices.length === 0">
                  <td colspan="12" class="text-center py-4 text-muted">
                    No paper price configurations found.
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
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Paper Price' : 'Add Paper Price' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="savePrice">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nama Kertas / Format <span class="text-danger">*</span></label>
                  <input v-model="form.nama" type="text" class="form-control" required placeholder="e.g. A4, Plano" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Group Kertas <span class="text-danger">*</span></label>
                  <select v-model="form.group" class="form-select" required>
                    <option value="HVS Putih">HVS Putih</option>
                    <option value="Art Paper">Art Paper</option>
                    <option value="Art Carton">Art Carton</option>
                    <option value="Ivory">Ivory</option>
                    <option value="Duplex">Duplex</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Merk / Brand</label>
                  <input v-model="form.merk" type="text" class="form-control" placeholder="e.g. Paperone, Pindo Deli" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Ukuran (cm)</label>
                  <input v-model="form.ukuran" type="text" class="form-control" placeholder="65x100 cm" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Satuan <span class="text-danger">*</span></label>
                  <select v-model="form.satuan" class="form-select">
                    <option value="lembar">Lembar Plano</option>
                    <option value="rim">Rim (500 lbr)</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Gramatur (GSM)</label>
                  <input v-model.number="form.gramatur" type="number" class="form-control" placeholder="150" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Min Order</label>
                  <input v-model="form.minOrder" type="text" class="form-control" placeholder="1 rim / 1 lembar" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Order Kelipatan</label>
                  <input v-model="form.kelipatan" type="text" class="form-control" placeholder="1 rim / 10 lembar" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Harga Satuan (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.harga" type="number" class="form-control" required placeholder="50000" />
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="priceActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Price' : 'Save Price' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SelfPaperPrice {
  id: number
  nama: string
  group: string
  merk: string
  ukuran: string
  satuan: string
  gramatur: number
  minOrder: string
  kelipatan: string
  harga: number
  update: string
  status: 'Active' | 'Inactive'
}

const prices = ref<SelfPaperPrice[]>([
  { id: 1, nama: 'A4', group: 'HVS Putih', merk: 'Paperone', ukuran: '21x29.7 cm', satuan: 'rim', gramatur: 80, minOrder: '1 rim', kelipatan: '1 rim', harga: 50000, update: '09/10/2025 10:00', status: 'Active' },
  { id: 2, nama: 'Plano', group: 'Art Paper', merk: 'Sinar Mas', ukuran: '65x90 cm', satuan: 'lembar', gramatur: 120, minOrder: '1 lembar', kelipatan: '10 lembar', harga: 2000, update: '09/10/2025 10:15', status: 'Active' },
  { id: 3, nama: 'Plano', group: 'Art Carton', merk: 'Golden Coin', ukuran: '79x109 cm', satuan: 'lembar', gramatur: 260, minOrder: '1 lembar', kelipatan: '10 lembar', harga: 4500, update: '09/10/2025 10:30', status: 'Active' },
  { id: 4, nama: 'Plano', group: 'Ivory', merk: 'Sinar Mas', ukuran: '65x100 cm', satuan: 'lembar', gramatur: 310, minOrder: '5 lembar', kelipatan: '5 lembar', harga: 5800, update: '09/10/2025 11:00', status: 'Active' },
  { id: 5, nama: 'Plano', group: 'Duplex', merk: 'Cenming', ukuran: '79x109 cm', satuan: 'lembar', gramatur: 250, minOrder: '10 lembar', kelipatan: '10 lembar', harga: 3200, update: '09/10/2025 11:30', status: 'Inactive' }
])

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
