<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Printing Machinery</h4>
            <h6>Configure offset presses, digital laser engines, minimum runs, and plate costs</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Printing Machine
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search press name or type..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="typeDropdownOpen = !typeDropdownOpen"
                >
                  Type: {{ filterType || 'All Types' }}
                </button>
                <ul v-if="typeDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterType = ''; typeDropdownOpen = false">All Types</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterType = 'Offset'; typeDropdownOpen = false">Offset</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterType = 'Digital Printing'; typeDropdownOpen = false">Digital Printing</a></li>
                </ul>
              </div>
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

          <div class="table-responsive mb-4">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Machine Type</th>
                  <th>Machine Name</th>
                  <th>Color / Spec</th>
                  <th>Max Area</th>
                  <th class="text-end">Base Minim</th>
                  <th class="text-end">Druck / Click</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in filteredMachines" :key="m.id">
                  <td>
                    <span
                      class="badge"
                      :class="m.type === 'Offset' ? 'bg-primary' : 'bg-success'"
                    >
                      {{ m.type }}
                    </span>
                  </td>
                  <td class="fw-bold text-dark">{{ m.name }}</td>
                  <td>{{ m.colors }} Warna</td>
                  <td><span class="badge bg-light text-dark border font-monospace">{{ m.maxArea }}</span></td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(m.minim) }}</td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(m.druck) }}</td>
                  <td>{{ m.update }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="m.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ m.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Machine"
                        @click="openEditModal(m)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Machine"
                        @click="deleteMachine(m.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMachines.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">
                    No printing machinery found.
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
            <h5 class="modal-title">{{ isEdit ? 'Edit Printing Machine' : 'Add Printing Machine' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveMachine">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Machinery Type <span class="text-danger">*</span></label>
                  <select v-model="form.type" class="form-select" required>
                    <option value="Offset">Offset Press</option>
                    <option value="Digital Printing">Digital Printing / Laser</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Machine Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Heidelberg SM52, Xerox C70" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Color Count</label>
                  <select v-model.number="form.colors" class="form-select">
                    <option :value="1">1 Warna (Monochrome)</option>
                    <option :value="2">2 Warna</option>
                    <option :value="4">4 Warna (CMYK Full Color)</option>
                    <option :value="5">5 Warna (CMYK + Pant)</option>
                    <option :value="6">6 Warna</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Max Print Area</label>
                  <input v-model="form.maxArea" type="text" class="form-control" placeholder="36 x 52 cm" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Plate / Setup Cost (Rp)</label>
                  <input v-model.number="form.plateCost" type="number" class="form-control" placeholder="60000" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Minim Cost (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.minim" type="number" class="form-control" required placeholder="240000" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Druck / Run Rate per Sheet (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.druck" type="number" class="form-control" required placeholder="85" />
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="pressActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Machine' : 'Save Machine' }}
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

interface SelfPress {
  id: number
  type: 'Offset' | 'Digital Printing'
  name: string
  colors: number
  maxArea: string
  plateCost: number
  minim: number
  druck: number
  update: string
  status: 'Active' | 'Inactive'
}

const machines = ref<SelfPress[]>([
  { id: 1, type: 'Offset', name: 'Heidelberg SM52', colors: 4, maxArea: '36 x 52 cm', plateCost: 65000, minim: 240000, druck: 85, update: '25/12/2025 Admin', status: 'Active' },
  { id: 2, type: 'Digital Printing', name: 'Xerox C70 A3+', colors: 4, maxArea: '32 x 48 cm', plateCost: 0, minim: 1500, druck: 1500, update: '25/12/2025 Admin', status: 'Active' },
  { id: 3, type: 'Offset', name: 'Heidelberg SM74', colors: 4, maxArea: '52 x 74 cm', plateCost: 95000, minim: 380000, druck: 110, update: '25/12/2025 Admin', status: 'Active' },
  { id: 4, type: 'Offset', name: 'Oliver Sakurai 58', colors: 2, maxArea: '44 x 58 cm', plateCost: 55000, minim: 160000, druck: 50, update: '25/12/2025 Admin', status: 'Active' },
  { id: 5, type: 'Digital Printing', name: 'Konica Minolta AccurioPress', colors: 4, maxArea: '33 x 70 cm', plateCost: 0, minim: 2200, druck: 2200, update: '25/12/2025 Admin', status: 'Inactive' }
])

const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const typeDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const filteredMachines = computed(() => {
  return machines.value.filter(m => {
    const matchType = !filterType.value || m.type === filterType.value
    const matchStatus = !filterStatus.value || m.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.maxArea.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchType && matchStatus && matchSearch
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  type: 'Offset' as 'Offset' | 'Digital Printing',
  name: '',
  colors: 4,
  maxArea: '36 x 52 cm',
  plateCost: 65000,
  minim: 240000,
  druck: 85,
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
    type: 'Offset',
    name: '',
    colors: 4,
    maxArea: '36 x 52 cm',
    plateCost: 65000,
    minim: 240000,
    druck: 85,
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(m: SelfPress) {
  isEdit.value = true
  currentId.value = m.id
  form.value = { ...m }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveMachine() {
  const now = new Date().toLocaleDateString('en-GB') + ' Admin'
  if (isEdit.value && currentId.value !== null) {
    const idx = machines.value.findIndex(m => m.id === currentId.value)
    if (idx !== -1) {
      machines.value[idx] = { ...machines.value[idx], ...form.value, update: now }
    }
  } else {
    const newId = machines.value.length ? Math.max(...machines.value.map(m => m.id)) + 1 : 1
    machines.value.unshift({ id: newId, ...form.value, update: now })
  }
  closeModal()
}

function deleteMachine(id: number) {
  if (confirm('Are you sure you want to delete this press machine?')) {
    machines.value = machines.value.filter(m => m.id !== id)
  }
}

function exportPdf() {
  alert('Exporting printing machinery as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterType.value = ''
  filterStatus.value = ''
}
</script>

