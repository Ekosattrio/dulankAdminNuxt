<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Fixed Components & Work Shift Capacities</h4>
            <h6>Manage baseline production capacity variables and shift durations</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Fixed Component
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search component name..." />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Nama Komponen Fiks</th>
                  <th class="text-end">Nilai / Kapasitas</th>
                  <th>Satuan</th>
                  <th class="text-center">Formula Usage</th>
                  <th>Last Update</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in filteredComponents" :key="c.id">
                  <td class="fw-bold text-dark">{{ c.name }}</td>
                  <td class="text-end fw-bold text-dark">{{ formatNumber(c.value) }}</td>
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
                  <td colspan="6" class="text-center py-4 text-muted">
                    No fixed components found.
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
            <h5 class="modal-title">{{ isEdit ? 'Edit Fixed Component' : 'Add Fixed Component' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveComponent">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Component Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Kapasitas Mesin Cetak" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Capacity Value <span class="text-danger">*</span></label>
                  <input v-model.number="form.value" type="number" class="form-control" required placeholder="5000" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Unit <span class="text-danger">*</span></label>
                  <input v-model="form.unit" type="text" class="form-control" required placeholder="Jam, lbr, pcs, kg" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FixedComponent {
  id: number
  name: string
  value: number
  unit: string
  used: number
  update: string
}

const components = ref<FixedComponent[]>([
  { id: 1, name: 'Jam Kerja Harian Operator', value: 12, unit: 'Jam', used: 23, update: '15/12/2025' },
  { id: 2, name: 'Kapasitas Mesin Cetak (Speedmaster)', value: 5000, unit: 'lbr', used: 27, update: '15/12/2025' },
  { id: 3, name: 'Kapasitas Susun Kalender Meja', value: 3000, unit: 'lbr', used: 12, update: '15/12/2025' },
  { id: 4, name: 'Kapasitas Pasang Gantungan / Mata Ayam', value: 500, unit: 'pcs', used: 61, update: '15/12/2025' },
  { id: 5, name: 'Kapasitas Beli Kertas & Potong Plano', value: 1500, unit: 'lbr', used: 87, update: '15/12/2025' },
  { id: 6, name: 'Kapasitas Laminasi Roll Doff/Glossy', value: 2000, unit: 'lbr', used: 12, update: '15/12/2025' },
  { id: 7, name: 'Kapasitas Lipat Mesin Otomatis', value: 8000, unit: 'lbr', used: 23, update: '15/12/2025' }
])

const searchQuery = ref('')

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
  value: 0,
  unit: 'lbr'
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    value: 1000,
    unit: 'lbr'
  }
  modalVisible.value = true
}

function openEditModal(c: FixedComponent) {
  isEdit.value = true
  currentId.value = c.id
  form.value = {
    name: c.name,
    value: c.value,
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
        value: form.value.value,
        unit: form.value.unit,
        update: now
      }
    }
  } else {
    const newId = components.value.length ? Math.max(...components.value.map(c => c.id)) + 1 : 1
    components.value.unshift({
      id: newId,
      name: form.value.name,
      value: form.value.value,
      unit: form.value.unit,
      used: 0,
      update: now
    })
  }
  closeModal()
}

function deleteComponent(id: number) {
  if (confirm('Are you sure you want to delete this fixed component variable?')) {
    components.value = components.value.filter(c => c.id !== id)
  }
}

function exportPdf() {
  alert('Exporting fixed components as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
}
</script>
