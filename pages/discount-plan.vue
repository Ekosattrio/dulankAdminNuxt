<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Discount Plan</h4>
            <h6>Manage your discount plans</h6>
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
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add Discount Plan
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <div class="search-set">
            <div class="search-input">
              <span class="btn-searchset"><i class="ti ti-search fs-14"></i></span>
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Search plan name..." />
            </div>
          </div>
          <div class="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <div class="dropdown me-2">
              <button
                type="button"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                {{ filterCustomer || 'Customer' }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-2">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCustomer = ''">All Customer</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCustomer = 'Members Only'">Members Only</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCustomer = 'High-Spending Customers'">High-Spending Customers</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCustomer = 'Online Customers'">Online Customers</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCustomer = 'Students'">Students</a></li>
              </ul>
            </div>
            <div class="dropdown">
              <button
                type="button"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                {{ filterStatus || 'Status' }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end p-2">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = ''">All Status</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = 'Active'">Active</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = 'Inactive'">Inactive</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Plan Name</th>
                  <th>Customers</th>
                  <th>Status</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredPlans" :key="item.id">
                  <td class="text-gray-9 fw-medium">{{ item.name }}</td>
                  <td>{{ item.customers }}</td>
                  <td>
                    <span class="badge table-badge fw-medium fs-10" :class="item.status === 'Active' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
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
                <tr v-if="filteredPlans.length === 0">
                  <td colspan="4" class="text-center py-4 text-muted">No discount plans found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Discount Plan Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Add Discount Plan</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="savePlan">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Plan Name <span class="text-danger ms-1">*</span></label>
                  <input v-model="formData.name" type="text" class="form-control" required placeholder="e.g. Premium Plan" />
                </div>
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="form-label mb-0">Customer <span class="text-danger ms-1">*</span></label>
                    <a href="javascript:void(0);" class="text-primary fs-12 fw-medium" @click="showAddCustomerModal = true">
                      <i class="ti ti-circle-plus me-1"></i>Add New
                    </a>
                  </div>
                  <select v-model="formData.customers" class="form-select" required>
                    <option value="">Select</option>
                    <option v-for="c in customerOptions" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div class="mb-0">
                  <div class="form-check form-switch d-flex align-items-center gap-2">
                    <input id="addPlanStatus" v-model="formData.isActive" class="form-check-input" type="checkbox" role="switch" />
                    <label class="form-check-label" for="addPlanStatus">Active Status</label>
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

      <!-- Edit Discount Plan Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Edit Discount Plan</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updatePlan">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Plan Name <span class="text-danger ms-1">*</span></label>
                  <input v-model="formData.name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="form-label mb-0">Customer <span class="text-danger ms-1">*</span></label>
                    <a href="javascript:void(0);" class="text-primary fs-12 fw-medium" @click="showAddCustomerModal = true">
                      <i class="ti ti-circle-plus me-1"></i>Add New
                    </a>
                  </div>
                  <select v-model="formData.customers" class="form-select" required>
                    <option v-for="c in customerOptions" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div class="mb-0">
                  <div class="form-check form-switch d-flex align-items-center gap-2">
                    <input id="editPlanStatus" v-model="formData.isActive" class="form-check-input" type="checkbox" role="switch" />
                    <label class="form-check-label" for="editPlanStatus">Active Status</label>
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

      <!-- Add Customer Sub-Modal -->
      <div v-if="showAddCustomerModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.6); z-index: 1060;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Add Customer</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="showAddCustomerModal = false">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="addNewCustomerOption">
              <div class="modal-body">
                <div>
                  <label class="form-label">Customer Tier / Name <span class="text-danger">*</span></label>
                  <input v-model="newCustomerName" type="text" class="form-control" required placeholder="e.g. VIP Gold Tier" />
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="showAddCustomerModal = false">Cancel</button>
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
  title: 'Discount Plan - Kacetak System'
})

interface DiscountPlan {
  id: number
  name: string
  customers: string
  status: 'Active' | 'Inactive'
}

const customerOptions = ref([
  'All Customers',
  'Members Only',
  'High-Spending Customers',
  'Students',
  'Online Customers'
])

const plans = ref<DiscountPlan[]>([
  { id: 1, name: 'Standard Plan', customers: 'All Customers', status: 'Active' },
  { id: 2, name: 'Membership Plan', customers: 'Members Only', status: 'Active' },
  { id: 3, name: 'Premium Plan', customers: 'High-Spending Customers', status: 'Active' },
  { id: 4, name: 'Seasonal Plan', customers: 'All Customers', status: 'Active' },
  { id: 5, name: 'Student Plan', customers: 'Students', status: 'Active' },
  { id: 6, name: 'Free Shipping Plan', customers: 'Online Customers', status: 'Active' },
  { id: 7, name: 'Celebration Plan', customers: 'All Customers', status: 'Active' }
])

const searchQuery = ref('')
const filterCustomer = ref('')
const filterStatus = ref('')

const filteredPlans = computed(() => {
  return plans.value.filter(item => {
    const matchSearch = searchQuery.value === '' || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCustomer = !filterCustomer.value || item.customers === filterCustomer.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchCustomer && matchStatus
  })
})

const showAddModal = ref(false)
const showEditModal = ref(false)
const showAddCustomerModal = ref(false)
const editingId = ref<number | null>(null)
const newCustomerName = ref('')

const defaultFormData = () => ({
  name: '',
  customers: 'All Customers',
  isActive: true
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: DiscountPlan) => {
  editingId.value = item.id
  formData.value = {
    name: item.name,
    customers: item.customers,
    isActive: item.status === 'Active'
  }
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
}

const addNewCustomerOption = () => {
  if (newCustomerName.value.trim()) {
    if (!customerOptions.value.includes(newCustomerName.value.trim())) {
      customerOptions.value.push(newCustomerName.value.trim())
    }
    formData.value.customers = newCustomerName.value.trim()
    newCustomerName.value = ''
    showAddCustomerModal.value = false
  }
}

const savePlan = () => {
  const newId = Math.max(0, ...plans.value.map(p => p.id)) + 1
  plans.value.unshift({
    id: newId,
    name: formData.value.name,
    customers: formData.value.customers,
    status: formData.value.isActive ? 'Active' : 'Inactive'
  })
  closeModal()
}

const updatePlan = () => {
  if (editingId.value === null) return
  const idx = plans.value.findIndex(p => p.id === editingId.value)
  if (idx !== -1) {
    plans.value[idx] = {
      ...plans.value[idx],
      name: formData.value.name,
      customers: formData.value.customers,
      status: formData.value.isActive ? 'Active' : 'Inactive'
    }
  }
  closeModal()
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this discount plan?')) {
    plans.value = plans.value.filter(p => p.id !== id)
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
  filterCustomer.value = ''
  filterStatus.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}
</script>

