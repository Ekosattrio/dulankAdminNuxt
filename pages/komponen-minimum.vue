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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface MinimumComponent {
  id: number
  name: string
  rate: number
  minim: number
  unit: string
  used: number
  update: string
}

const components = ref<MinimumComponent[]>([
  { id: 1, name: 'Potong Kertas Plano', rate: 2000, minim: 30000, unit: 'Kg', used: 27, update: '15/12/2025' },
  { id: 2, name: 'Mobilisasi / Ongkos Angkut', rate: 2500, minim: 150000, unit: 'Kg', used: 32, update: '15/12/2025' },
  { id: 3, name: 'Susun Komplit Kalender', rate: 40, minim: 100000, unit: 'Lembar', used: 18, update: '15/12/2025' },
  { id: 4, name: '1 Lipatan (Mesin Lipat)', rate: 10, minim: 200000, unit: 'Lembar', used: 91, update: '15/12/2025' },
  { id: 5, name: '2 Lipatan (Mesin Lipat)', rate: 15, minim: 350000, unit: 'Lembar', used: 11, update: '15/12/2025' },
  { id: 6, name: 'Jilid Spiral Kawat', rate: 150, minim: 350000, unit: 'Cm', used: 23, update: '15/12/2025' },
  { id: 7, name: 'Jepit Kaleng Kalender Dinding', rate: 30, minim: 150000, unit: 'Pcs', used: 45, update: '15/12/2025' },
  { id: 8, name: 'Lem Panas / Perfect Binding', rate: 2500, minim: 250000, unit: 'Buku', used: 54, update: '15/12/2025' }
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
  if (confirm('Are you sure you want to delete this minimum charge rule?')) {
    components.value = components.value.filter(c => c.id !== id)
  }
}

function exportPdf() {
  alert('Exporting minimum components as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
}
</script>
