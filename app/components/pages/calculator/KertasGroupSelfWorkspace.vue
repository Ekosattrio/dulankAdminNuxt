<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Paper Groups</h4>
            <h6>Manage your workshop's own paper group classifications and price types</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add New Paper Group
          </button>
        </div>
      </div>

      <!-- Dashboard Metric Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-files fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Paper Groups</h6>
              <h4 class="fw-bold mb-0">{{ groups.length }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash2 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-circle-check fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Active</h6>
              <h4 class="fw-bold mb-0">{{ activeCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash3 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-secondary bg-opacity-10 p-3 rounded">
              <i class="ti ti-circle-x fs-2 text-secondary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Inactive</h6>
              <h4 class="fw-bold mb-0">{{ inactiveCount }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search paper group or merk..." />
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
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Deactive'; statusDropdownOpen = false">Deactive</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Paper's Group</th>
                  <th>Merk</th>
                  <th>Price Type</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 120px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="g in filteredGroups" :key="g.id">
                  <td class="fw-bold text-dark">{{ g.name }}</td>
                  <td>{{ g.merk }}</td>
                  <td>
                    <span class="badge" :class="g.priceType === 'Yes' ? 'bg-info' : 'bg-light text-dark border'">
                      {{ g.priceType }}
                    </span>
                  </td>
                  <td>{{ g.update }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="g.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ g.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Paper Group"
                        @click="openEditModal(g)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Paper Group"
                        @click="deleteGroup(g.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredGroups.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No paper groups found.
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
            <h5 class="modal-title">{{ isEdit ? 'Edit Paper Group' : 'Add New Paper Group' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveGroup">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Paper Group Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Art Paper, HVS Putih" />
                </div>
                <div class="col-12">
                  <label class="form-label">Default Merk / Manufacturer</label>
                  <input v-model="form.merk" type="text" class="form-control" placeholder="e.g. Paperone, Sinar Mas, Pindo Deli" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Price Type</label>
                  <select v-model="form.priceType" class="form-select">
                    <option value="Yes">Yes (By Weight/Kg)</option>
                    <option value="No">No (By Sheet Plano)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="groupActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Group' : 'Save Group' }}
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

interface SelfPaperGroup {
  id: number
  name: string
  merk: string
  priceType: 'Yes' | 'No'
  update: string
  status: 'Active' | 'Deactive'
}

const groups = ref<SelfPaperGroup[]>([
  { id: 1, name: 'HVS Putih', merk: 'Paperone', priceType: 'Yes', update: '10/01/2025 12:00', status: 'Active' },
  { id: 2, name: 'Art Paper', merk: 'Pindo Deli', priceType: 'Yes', update: '10/01/2025 12:15', status: 'Active' },
  { id: 3, name: 'Art Carton', merk: 'Golden Coin', priceType: 'Yes', update: '10/01/2025 12:30', status: 'Active' },
  { id: 4, name: 'Duplex', merk: 'Cenming', priceType: 'No', update: '10/01/2025 12:45', status: 'Deactive' },
  { id: 5, name: 'Ivory', merk: 'Sinar Mas', priceType: 'Yes', update: '10/01/2025 13:00', status: 'Active' }
])

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const activeCount = computed(() => groups.value.filter(g => g.status === 'Active').length)
const inactiveCount = computed(() => groups.value.filter(g => g.status === 'Deactive').length)

const filteredGroups = computed(() => {
  return groups.value.filter(g => {
    const matchStatus = !filterStatus.value || g.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      g.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.merk.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  name: '',
  merk: '',
  priceType: 'Yes' as 'Yes' | 'No',
  status: 'Active' as 'Active' | 'Deactive'
})

const formActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Deactive'
  }
})

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    merk: '',
    priceType: 'Yes',
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(g: SelfPaperGroup) {
  isEdit.value = true
  currentId.value = g.id
  form.value = {
    name: g.name,
    merk: g.merk,
    priceType: g.priceType,
    status: g.status
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveGroup() {
  if (isEdit.value && currentId.value !== null) {
    const idx = groups.value.findIndex(g => g.id === currentId.value)
    if (idx !== -1) {
      groups.value[idx] = {
        ...groups.value[idx],
        name: form.value.name,
        merk: form.value.merk,
        priceType: form.value.priceType,
        status: form.value.status,
        update: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      }
    }
  } else {
    const newId = groups.value.length ? Math.max(...groups.value.map(g => g.id)) + 1 : 1
    groups.value.unshift({
      id: newId,
      name: form.value.name,
      merk: form.value.merk,
      priceType: form.value.priceType,
      status: form.value.status,
      update: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    })
  }
  closeModal()
}

function deleteGroup(id: number) {
  if (confirm('Are you sure you want to delete this paper group?')) {
    groups.value = groups.value.filter(g => g.id !== id)
  }
}

function exportPdf() {
  alert('Exporting paper groups as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>

