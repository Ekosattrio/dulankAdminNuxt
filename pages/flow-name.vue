<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Flow Name List</h4>
            <h6>Configure detailed work steps, standard incentives, and execution types</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add New Flow Name
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search flow name or assignee..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterCategory" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Categories</option>
                <option value="Design">Design</option>
                <option value="Pracetak">Pracetak</option>
                <option value="Cetak">Cetak</option>
                <option value="Finishing">Finishing</option>
              </select>
              <select v-model="filterType" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Types</option>
                <option value="Inhouse">Inhouse</option>
                <option value="Outsource">Outsource</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No</th>
                  <th>Flow Category</th>
                  <th>Flow Name</th>
                  <th class="text-end">Incentive Amount</th>
                  <th>Unit Incentive</th>
                  <th>Flow Assignee</th>
                  <th>Flow Type</th>
                  <th>Created Info</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredList" :key="item.id">
                  <td class="fw-bold text-primary">{{ item.code }}</td>
                  <td><span class="badge bg-light text-dark border">{{ item.category }}</span></td>
                  <td class="fw-bold text-dark">{{ item.name }}</td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(item.incentive) }}</td>
                  <td>{{ item.unit }}</td>
                  <td class="small">{{ item.assignees }}</td>
                  <td>
                    <span :class="item.flowType === 'Inhouse' ? 'badge bg-success bg-opacity-10 text-success border border-success' : 'badge bg-warning bg-opacity-10 text-warning border border-warning'">
                      {{ item.flowType }}
                    </span>
                  </td>
                  <td class="small text-muted">{{ item.createdInfo }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
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
                  <td colspan="9" class="text-center py-4 text-muted">
                    No flow names found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Flow Name' : 'Add New Flow Name' }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveItem">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Flow Category <span class="text-danger">*</span></label>
                <select v-model="formData.category" class="form-select" required>
                  <option value="Design">Design</option>
                  <option value="Pracetak">Pracetak</option>
                  <option value="Cetak">Cetak</option>
                  <option value="Finishing">Finishing</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Flow Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. Cetak Multilith, Potong Sisir" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Incentive (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="formData.incentive" type="number" min="0" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Unit Incentive <span class="text-danger">*</span></label>
                  <select v-model="formData.unit" class="form-select" required>
                    <option value="Per Job">Per Job</option>
                    <option value="Per Meter">Per Meter</option>
                    <option value="Per Rim">Per Rim</option>
                    <option value="Per Pcs">Per Pcs</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Flow Type</label>
                <select v-model="formData.flowType" class="form-select">
                  <option value="Inhouse">Inhouse</option>
                  <option value="Outsource">Outsource</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Default Assignees</label>
                <input v-model="formData.assignees" type="text" class="form-control" placeholder="e.g. Abdul, Nurdin" />
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Flow Name' : 'Save Flow Name' }}</button>
            </div>
          </form>
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
  title: 'Flow Name List - Kacetak System'
})

interface FlowNameItem {
  id: number
  code: string
  category: string
  name: string
  incentive: number
  unit: string
  assignees: string
  flowType: 'Inhouse' | 'Outsource'
  createdInfo: string
}

const flowNames = ref<FlowNameItem[]>([
  { id: 1, code: 'JBP-0001', category: 'Design', name: 'Design Layout', incentive: 5000, unit: 'Per Job', assignees: 'Adul, Nurdin', flowType: 'Inhouse', createdInfo: 'Admin, 2025-10-13' },
  { id: 2, code: 'JBP-0002', category: 'Pracetak', name: 'Pre-press Setting', incentive: 8500, unit: 'Per Job', assignees: 'Adul, Nurdin, Admin', flowType: 'Inhouse', createdInfo: 'Admin, 2025-10-13' },
  { id: 3, code: 'JBP-0003', category: 'Cetak', name: 'Digital Printing', incentive: 4000, unit: 'Per Meter', assignees: 'Arif, Galih', flowType: 'Outsource', createdInfo: 'Admin, 2025-10-13' },
  { id: 4, code: 'JBP-0004', category: 'Finishing', name: 'Potong Sisir', incentive: 2000, unit: 'Per Rim', assignees: 'Rapli, Budi', flowType: 'Inhouse', createdInfo: 'Admin, 2025-10-13' }
])

const searchQuery = ref('')
const filterCategory = ref('')
const filterType = ref('')

const filteredList = computed(() => {
  return flowNames.value.filter(item => {
    const matchSearch =
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.assignees.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat = filterCategory.value ? item.category === filterCategory.value : true
    const matchType = filterType.value ? item.flowType === filterType.value : true
    return matchSearch && matchCat && matchType
  })
})

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  category: 'Design',
  name: '',
  incentive: 0,
  unit: 'Per Job',
  flowType: 'Inhouse' as 'Inhouse' | 'Outsource',
  assignees: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.category = 'Design'
  formData.name = ''
  formData.incentive = 0
  formData.unit = 'Per Job'
  formData.flowType = 'Inhouse'
  formData.assignees = ''
  modalVisible.value = true
}

function openEditModal(item: FlowNameItem) {
  isEditing.value = true
  formData.id = item.id
  formData.category = item.category
  formData.name = item.name
  formData.incentive = item.incentive
  formData.unit = item.unit
  formData.flowType = item.flowType
  formData.assignees = item.assignees
  modalVisible.value = true
}

function saveItem() {
  if (isEditing.value) {
    const idx = flowNames.value.findIndex(f => f.id === formData.id)
    if (idx !== -1) {
      flowNames.value[idx] = {
        ...flowNames.value[idx],
        category: formData.category,
        name: formData.name,
        incentive: formData.incentive,
        unit: formData.unit,
        flowType: formData.flowType,
        assignees: formData.assignees
      }
    }
  } else {
    flowNames.value.push({
      id: Date.now(),
      code: 'JBP-000' + (flowNames.value.length + 1),
      category: formData.category,
      name: formData.name,
      incentive: formData.incentive,
      unit: formData.unit,
      flowType: formData.flowType,
      assignees: formData.assignees,
      createdInfo: 'Admin, ' + new Date().toISOString().split('T')[0]
    })
  }
  modalVisible.value = false
}

function deleteItem(id: number) {
  if (confirm('Delete this flow name?')) {
    flowNames.value = flowNames.value.filter(f => f.id !== id)
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
  filterCategory.value = ''
  filterType.value = ''
}
</script>
