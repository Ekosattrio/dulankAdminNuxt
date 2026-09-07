<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Paper Sizes & Formats</h4>
            <h6>Manage sheet cut dimensions and master plano specifications</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Paper Size
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search size name or dimensions..." />
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
                  <th>Format / Ukuran</th>
                  <th>Dimensi (P x L)</th>
                  <th>Unit</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in filteredSizes" :key="s.id">
                  <td class="fw-bold text-dark">{{ s.name }}</td>
                  <td><span class="badge bg-light text-dark font-monospace border">{{ s.dimension }}</span></td>
                  <td>{{ s.unit }}</td>
                  <td>{{ s.update }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="s.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ s.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Size"
                        @click="openEditModal(s)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Size"
                        @click="deleteSize(s.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredSizes.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No paper sizes found.
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
            <h5 class="modal-title">{{ isEdit ? 'Edit Paper Size' : 'Add Paper Size' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveSize">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Size Name / Code <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Plano 65x100, A4, F4" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Panjang (Length) <span class="text-danger">*</span></label>
                  <input v-model.number="form.length" type="number" step="0.1" class="form-control" required placeholder="65" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Lebar (Width) <span class="text-danger">*</span></label>
                  <input v-model.number="form.width" type="number" step="0.1" class="form-control" required placeholder="100" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Unit</label>
                  <select v-model="form.unit" class="form-select">
                    <option value="cm">Centimeter (cm)</option>
                    <option value="mm">Millimeter (mm)</option>
                    <option value="inch">Inches (in)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="sizeActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Size' : 'Save Size' }}
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

interface SelfPaperSize {
  id: number
  name: string
  dimension: string
  length: number
  width: number
  unit: string
  update: string
  status: 'Active' | 'Inactive'
}

const sizes = ref<SelfPaperSize[]>([
  { id: 1, name: 'A4', dimension: '21 x 29.7', length: 21, width: 29.7, unit: 'cm', update: '10/01/2025 09:00', status: 'Active' },
  { id: 2, name: 'F4 (Folio)', dimension: '21.5 x 33', length: 21.5, width: 33, unit: 'cm', update: '10/01/2025 09:15', status: 'Active' },
  { id: 3, name: 'A3', dimension: '29.7 x 42', length: 29.7, width: 42, unit: 'cm', update: '10/01/2025 09:30', status: 'Active' },
  { id: 4, name: 'A5', dimension: '14.8 x 21', length: 14.8, width: 21, unit: 'cm', update: '10/01/2025 09:45', status: 'Active' },
  { id: 5, name: 'Plano 65 x 100', dimension: '65 x 100', length: 65, width: 100, unit: 'cm', update: '10/01/2025 10:00', status: 'Active' },
  { id: 6, name: 'Plano 79 x 109', dimension: '79 x 109', length: 79, width: 109, unit: 'cm', update: '10/01/2025 10:15', status: 'Active' },
  { id: 7, name: 'Plano 65 x 90', dimension: '65 x 90', length: 65, width: 90, unit: 'cm', update: '10/01/2025 10:30', status: 'Active' }
])

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

