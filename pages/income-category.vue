<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Income Category</h4>
            <h6>Manage your income category</h6>
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
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-added btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-2"></i> Add Category
          </button>
        </div>
      </div>

      <!-- Category List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search category..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
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
                  <th>No Category</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredCategories" :key="item.id">
                  <td class="inc-no fw-semibold text-primary">{{ item.no }}</td>
                  <td class="inc-name fw-medium text-dark">{{ item.name }}</td>
                  <td class="inc-desc text-muted">{{ item.description }}</td>
                  <td class="inc-status">
                    <span class="badge" :class="item.status === 'Active' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="inc-created text-muted fs-12">{{ item.created }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a class="confirm-text p-2 align-center text-danger" href="javascript:void(0);" @click="deleteItem(item.id)">
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCategories.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">No income categories found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Category Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add Income Category</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveCategory">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Category Name <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" placeholder="Enter category name" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea v-model="formData.description" class="form-control" rows="3" placeholder="Category purpose or description..."></textarea>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input id="catStatus" v-model="formData.isActive" class="form-check-input" type="checkbox" role="switch" />
                      <label class="form-check-label" for="catStatus">Active Status</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Category Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Income Category</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateCategory">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Category Name <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea v-model="formData.description" class="form-control" rows="3"></textarea>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input id="editCatStatus" v-model="formData.isActive" class="form-check-input" type="checkbox" role="switch" />
                      <label class="form-check-label" for="editCatStatus">Active Status</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Income Category - Kacetak System'
})

interface IncomeCategory {
  id: number
  no: string
  name: string
  description: string
  status: 'Active' | 'Inactive'
  created: string
}

const categories = ref<IncomeCategory[]>([
  { id: 1, no: 'INC001', name: 'Penjualan Jasa Cetak', description: 'Pemasukan dari layanan cetak utama (Offset, Digital, Large Format).', status: 'Active', created: '25/11/2025 15:45, Admin' },
  { id: 2, no: 'INC002', name: 'Penjualan Limbah Kertas', description: 'Pendapatan dari penjualan sisa potongan atau limbah kertas produksi ke pengepul.', status: 'Active', created: '25/11/2025 15:50, Admin' },
  { id: 3, no: 'INC003', name: 'Jasa Desain', description: 'Pemasukan dari layanan desain grafis terpisah atau layout dokumen.', status: 'Active', created: '26/11/2025 09:10, Budi' },
  { id: 4, no: 'INC004', name: 'Penjualan Plat Offset Bekas', description: 'Pendapatan dari penjualan plat cetak offset yang sudah tidak terpakai (bekas) ke pengepul.', status: 'Active', created: '26/11/2025 10:30, Admin' }
])

const searchQuery = ref('')
const filterStatus = ref('')

const filteredCategories = computed(() => {
  return categories.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.no.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingId = ref<number | null>(null)

const defaultFormData = () => ({
  name: '',
  description: '',
  isActive: true
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: IncomeCategory) => {
  editingId.value = item.id
  formData.value = {
    name: item.name,
    description: item.description,
    isActive: item.status === 'Active'
  }
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
}

const saveCategory = () => {
  const newId = Math.max(0, ...categories.value.map(c => c.id)) + 1
  const no = `INC${String(newId).padStart(3, '0')}`
  const now = new Date()
  const dateStr = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Admin`
  categories.value.push({
    id: newId,
    no,
    name: formData.value.name,
    description: formData.value.description,
    status: formData.value.isActive ? 'Active' : 'Inactive',
    created: dateStr
  })
  closeModal()
}

const updateCategory = () => {
  if (editingId.value === null) return
  const idx = categories.value.findIndex(c => c.id === editingId.value)
  if (idx !== -1) {
    categories.value[idx] = {
      ...categories.value[idx],
      name: formData.value.name,
      description: formData.value.description,
      status: formData.value.isActive ? 'Active' : 'Inactive'
    }
  }
  closeModal()
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this income category?')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  searchQuery.value = ''
  filterStatus.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}
</script>
