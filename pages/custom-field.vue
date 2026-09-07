<template>
  <div class="page-wrapper mt-3">
    <div class="content settings-content">
      <div class="page-header settings-pg-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <div class="setting-title mb-3">
                <h4 class="fs-18 fw-bold">Custom Fields</h4>
              </div>

              <div class="page-header d-flex justify-content-between align-items-center mb-3">
                <ul class="table-top-head list-unstyled d-flex gap-2 mb-0">
                  <li>
                    <a href="javascript:void(0);" title="Pdf" class="btn btn-outline-secondary btn-sm" @click="exportPdf">
                      <i class="ti ti-file-type-pdf text-danger"></i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" title="Print" class="btn btn-outline-secondary btn-sm" @click="printPage">
                      <i class="ti ti-printer"></i>
                    </a>
                  </li>
                </ul>
                <div class="page-btn">
                  <button class="btn btn-primary btn-sm" @click="openAddModal">
                    <i class="ti ti-circle-plus me-1"></i>Add New Field
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <div class="card table-list-card shadow-sm border">
                    <div class="card-body">
                      <!-- Search and Filter Bar -->
                      <div class="table-top d-flex justify-content-between align-items-center mb-3">
                        <div class="search-set">
                          <div class="input-group">
                            <span class="input-group-text bg-white"><i class="ti ti-search"></i></span>
                            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search fields..." />
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <button class="btn btn-outline-secondary btn-sm" @click="showFilterAccordion = !showFilterAccordion">
                            <i class="ti ti-filter"></i>
                          </button>
                          <select v-model="sortBy" class="form-select form-select-sm" style="width: 140px;">
                            <option value="newest">Sort by Date</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                          </select>
                        </div>
                      </div>

                      <!-- Filter Card Accordion -->
                      <div v-if="showFilterAccordion" class="card p-3 mb-3 bg-light border">
                        <div class="row g-2 align-items-center">
                          <div class="col-lg-3 col-sm-6 col-12">
                            <select v-model="filterModule" class="form-select form-select-sm">
                              <option value="">Choose Module</option>
                              <option value="Expense">Expense</option>
                              <option value="Transaction">Transaction</option>
                              <option value="Order">Order</option>
                              <option value="Product">Product</option>
                            </select>
                          </div>
                          <div class="col-lg-3 col-sm-6 col-12">
                            <select v-model="filterStatus" class="form-select form-select-sm">
                              <option value="">Choose Status</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                          <div class="col-lg-2 col-sm-6 col-12">
                            <button class="btn btn-secondary btn-sm w-100" @click="resetFilters">Reset</button>
                          </div>
                        </div>
                      </div>

                      <!-- Datatable -->
                      <div class="table-responsive">
                        <table class="table table-hover align-middle">
                          <thead class="table-light">
                            <tr>
                              <th>Module</th>
                              <th>Label</th>
                              <th>Type</th>
                              <th>Default Value</th>
                              <th>Required</th>
                              <th>Status</th>
                              <th class="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="field in filteredFields" :key="field.id">
                              <td class="fw-semibold text-primary">{{ field.module }}</td>
                              <td class="fw-bold">{{ field.label }}</td>
                              <td><span class="badge bg-light text-dark">{{ field.type }}</span></td>
                              <td class="text-muted">{{ field.defaultValue || '-' }}</td>
                              <td>
                                <span :class="field.required ? 'badge bg-outline-danger' : 'badge bg-outline-secondary'">
                                  {{ field.required ? 'Required' : 'Optional' }}
                                </span>
                              </td>
                              <td>
                                <span :class="field.status === 'Active' ? 'badge bg-success' : 'badge bg-secondary'">
                                  {{ field.status }}
                                </span>
                              </td>
                              <td class="text-end">
                                <div class="btn-group btn-group-sm">
                                  <button class="btn btn-outline-secondary" title="Edit" @click="openEditModal(field)">
                                    <i class="ti ti-edit"></i>
                                  </button>
                                  <button class="btn btn-outline-danger" title="Delete" @click="deleteField(field.id)">
                                    <i class="ti ti-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr v-if="filteredFields.length === 0">
                              <td colspan="7" class="text-center py-4 text-muted">No custom fields found.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Add / Edit Custom Field Modal -->
      <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="page-wrapper-new p-0">
              <div class="content p-4">
                <div class="modal-header border-0 custom-modal-header p-0 mb-3">
                  <div class="page-title">
                    <h4 class="fw-bold">{{ isEditing ? 'Edit Custom Field' : 'Add New Custom Fields' }}</h4>
                  </div>
                  <button type="button" class="btn-close" @click="showModal = false"></button>
                </div>
                <div class="modal-body custom-modal-body p-0">
                  <form @submit.prevent="saveField">
                    <div class="row">
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Custom Fields For <span class="text-danger">*</span></label>
                        <select v-model="form.module" class="form-select" required>
                          <option value="">Choose Module</option>
                          <option value="Expense">Expense</option>
                          <option value="Transaction">Transaction</option>
                          <option value="Order">Order</option>
                          <option value="Product">Product</option>
                        </select>
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Label <span class="text-danger">*</span></label>
                        <input v-model="form.label" type="text" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Default Value</label>
                        <input v-model="form.defaultValue" type="text" class="form-control" />
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Input Type <span class="text-danger">*</span></label>
                        <select v-model="form.type" class="form-select" required>
                          <option value="Text">Text</option>
                          <option value="Textarea">Textarea</option>
                          <option value="Number">Number</option>
                          <option value="Date">Date</option>
                          <option value="Select">Select Dropdown</option>
                        </select>
                      </div>
                      <div class="col-lg-12 mb-3">
                        <div class="d-flex align-items-center gap-4">
                          <div class="form-check">
                            <input v-model="form.required" class="form-check-input" type="checkbox" id="reqCheck" />
                            <label class="form-check-label" for="reqCheck">Required Field</label>
                          </div>
                          <div class="form-check">
                            <input v-model="form.disabled" class="form-check-input" type="checkbox" id="disCheck" />
                            <label class="form-check-label" for="disCheck">Disabled</label>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-12 mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="status-label fw-semibold">Status Active</span>
                          <div class="form-check form-switch mb-0">
                            <input v-model="form.isActive" class="form-check-input" type="checkbox" role="switch" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="showModal = false">Cancel</button>
                      <button type="submit" class="btn btn-warning text-white">{{ isEditing ? 'Update' : 'Submit' }}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Custom Fields - Kacetak System'
})

interface CustomField {
  id: number
  module: string
  label: string
  type: string
  defaultValue: string
  required: boolean
  disabled: boolean
  status: 'Active' | 'Inactive'
}

const customFields = ref<CustomField[]>([
  {
    id: 1,
    module: 'Expense',
    label: 'Name',
    type: 'Text',
    defaultValue: 'Name',
    required: true,
    disabled: false,
    status: 'Active'
  },
  {
    id: 2,
    module: 'Transaction',
    label: 'Comment',
    type: 'Textarea',
    defaultValue: 'Enter Comments',
    required: true,
    disabled: false,
    status: 'Active'
  }
])

const searchQuery = ref('')
const filterModule = ref('')
const filterStatus = ref('')
const sortBy = ref('newest')
const showFilterAccordion = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  module: '',
  label: '',
  defaultValue: '',
  type: 'Text',
  required: true,
  disabled: false,
  isActive: true
})

const filteredFields = computed(() => {
  return customFields.value.filter(f => {
    const matchesSearch = f.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          f.module.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesModule = filterModule.value ? f.module === filterModule.value : true
    const matchesStatus = filterStatus.value ? f.status === filterStatus.value : true
    return matchesSearch && matchesModule && matchesStatus
  })
})

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    module: 'Expense',
    label: '',
    defaultValue: '',
    type: 'Text',
    required: true,
    disabled: false,
    isActive: true
  }
  showModal.value = true
}

const openEditModal = (f: CustomField) => {
  isEditing.value = true
  editingId.value = f.id
  form.value = {
    module: f.module,
    label: f.label,
    defaultValue: f.defaultValue,
    type: f.type,
    required: f.required,
    disabled: f.disabled,
    isActive: f.status === 'Active'
  }
  showModal.value = true
}

const saveField = () => {
  if (isEditing.value && editingId.value !== null) {
    const idx = customFields.value.findIndex(cf => cf.id === editingId.value)
    if (idx !== -1) {
      customFields.value[idx] = {
        ...customFields.value[idx],
        module: form.value.module,
        label: form.value.label,
        defaultValue: form.value.defaultValue,
        type: form.value.type,
        required: form.value.required,
        disabled: form.value.disabled,
        status: form.value.isActive ? 'Active' : 'Inactive'
      }
    }
  } else {
    customFields.value.push({
      id: Date.now(),
      module: form.value.module,
      label: form.value.label,
      defaultValue: form.value.defaultValue,
      type: form.value.type,
      required: form.value.required,
      disabled: form.value.disabled,
      status: form.value.isActive ? 'Active' : 'Inactive'
    })
  }
  showModal.value = false
}

const deleteField = (id: number) => {
  if (confirm('Are you sure you want to delete this custom field?')) {
    customFields.value = customFields.value.filter(cf => cf.id !== id)
  }
}

const resetFilters = () => {
  filterModule.value = ''
  filterStatus.value = ''
}

const exportPdf = () => {
  alert('Exporting PDF...')
}

const printPage = () => {
  window.print()
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
