<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Customer Type</h4>
            <h6>Manage customer classification tiers and membership levels</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Customer Type
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search customer type..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Customer Type</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in filteredList" :key="t.id">
                  <td class="fw-bold text-dark">{{ t.name }}</td>
                  <td>
                    <span :class="t.status === 'Active' ? 'badge bg-success bg-opacity-10 text-success border border-success' : 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary'">
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(t)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteType(t.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="3" class="text-center py-4 text-muted">
                    No customer types found.
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
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Customer Type' : 'Add Customer Type' }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveType">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Customer Type Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. Standard, Corporate, Reseller" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="formData.status" class="form-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Type' : 'Save Type' }}</button>
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
  title: 'Customer Type - Kacetak System'
})

interface CustomerTypeItem {
  id: number
  name: string
  status: 'Active' | 'Inactive'
}

const customerTypes = ref<CustomerTypeItem[]>([
  { id: 1, name: 'Standard', status: 'Active' },
  { id: 2, name: 'Membership', status: 'Active' },
  { id: 3, name: 'Premium', status: 'Active' },
  { id: 4, name: 'Seasonal', status: 'Active' },
  { id: 5, name: 'Student', status: 'Active' },
  { id: 6, name: 'Free Shipping', status: 'Active' },
  { id: 7, name: 'Celebration', status: 'Active' }
])

const searchQuery = ref('')
const filterStatus = ref('')

const filteredList = computed(() => {
  return customerTypes.value.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value ? t.status === filterStatus.value : true
    return matchSearch && matchStatus
  })
})

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  status: 'Active' as 'Active' | 'Inactive'
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.status = 'Active'
  modalVisible.value = true
}

function openEditModal(t: CustomerTypeItem) {
  isEditing.value = true
  formData.id = t.id
  formData.name = t.name
  formData.status = t.status
  modalVisible.value = true
}

function saveType() {
  if (isEditing.value) {
    const idx = customerTypes.value.findIndex(t => t.id === formData.id)
    if (idx !== -1) {
      customerTypes.value[idx].name = formData.name
      customerTypes.value[idx].status = formData.status
    }
  } else {
    customerTypes.value.push({
      id: Date.now(),
      name: formData.name,
      status: formData.status
    })
  }
  modalVisible.value = false
}

function deleteType(id: number) {
  if (confirm('Delete this customer type?')) {
    customerTypes.value = customerTypes.value.filter(t => t.id !== id)
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
  filterStatus.value = ''
}
</script>

