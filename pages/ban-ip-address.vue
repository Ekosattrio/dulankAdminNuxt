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
              <div class="setting-title mb-4">
                <h4 class="fs-18 fw-bold">Ban IP Address</h4>
              </div>
              <div class="page-header bank-settings justify-content-end mb-3">
                <div class="page-btn">
                  <button class="btn btn-primary" @click="openAddModal">
                    <i class="ti ti-circle-plus me-2"></i>Add New Ban IP
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <div class="card table-list-card shadow-sm border">
                    <div class="card-body">
                      <!-- Search and Filters -->
                      <div class="table-top d-flex justify-content-between align-items-center mb-3">
                        <div class="search-set d-flex align-items-center gap-2">
                          <div class="input-group">
                            <span class="input-group-text bg-white"><i class="ti ti-search"></i></span>
                            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search IP address..." />
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <button class="btn btn-outline-secondary btn-sm" @click="showFilters = !showFilters">
                            <i class="ti ti-filter"></i>
                          </button>
                          <select v-model="sortBy" class="form-select form-select-sm" style="width: 140px;">
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                          </select>
                        </div>
                      </div>

                      <!-- Collapsible Filter -->
                      <div v-if="showFilters" class="card p-3 mb-3 bg-light border">
                        <div class="row g-2 align-items-center">
                          <div class="col-md-4">
                            <input v-model="filterIp" type="text" class="form-control form-control-sm" placeholder="Filter by IP..." />
                          </div>
                          <div class="col-md-2">
                            <button class="btn btn-sm btn-secondary w-100" @click="clearFilter">Reset</button>
                          </div>
                        </div>
                      </div>

                      <!-- Datatable -->
                      <div class="table-responsive">
                        <table class="table table-hover align-middle">
                          <thead class="table-light">
                            <tr>
                              <th>IP Address</th>
                              <th>Reason</th>
                              <th>Date</th>
                              <th class="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in filteredIps" :key="item.id">
                              <td class="fw-semibold text-danger">{{ item.ip }}</td>
                              <td>
                                <p class="mb-0 text-muted">{{ item.reason }}</p>
                              </td>
                              <td class="text-nowrap">{{ item.date }}</td>
                              <td class="text-end">
                                <div class="btn-group btn-group-sm">
                                  <button class="btn btn-outline-secondary" title="Edit" @click="openEditModal(item)">
                                    <i class="ti ti-edit"></i>
                                  </button>
                                  <button class="btn btn-outline-danger" title="Delete" @click="deleteIp(item.id)">
                                    <i class="ti ti-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr v-if="filteredIps.length === 0">
                              <td colspan="4" class="text-center py-4 text-muted">No banned IP addresses found.</td>
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

      <!-- Add / Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="page-wrapper-new p-0">
              <div class="content p-4">
                <div class="modal-header border-0 custom-modal-header p-0 mb-3">
                  <div class="page-title">
                    <h4 class="fw-bold">{{ isEditing ? 'Edit Ban IP Address' : 'Add New Ban IP Address' }}</h4>
                  </div>
                  <button type="button" class="btn-close" @click="showModal = false"></button>
                </div>
                <div class="modal-body custom-modal-body p-0">
                  <form @submit.prevent="saveIp">
                    <div class="row">
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">IP Address <span class="text-danger">*</span></label>
                        <input v-model="form.ip" type="text" class="form-control" placeholder="e.g. 192.168.1.1" required />
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Reason For Ban</label>
                        <textarea v-model="form.reason" rows="4" placeholder="Type reason for banning this IP" class="form-control"></textarea>
                      </div>
                      <div class="col-lg-12 mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="status-label fw-semibold">Status Active</span>
                          <div class="form-check form-switch mb-0">
                            <input v-model="form.status" class="form-check-input" type="checkbox" role="switch" />
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
  title: 'Ban IP Address - Kacetak System'
})

interface BanIp {
  id: number
  ip: string
  reason: string
  date: string
  status: boolean
}

const banList = ref<BanIp[]>([
  {
    id: 1,
    ip: '211.11.0.25',
    reason: 'You can get on-demand services in order to find a nearby service.',
    date: '12 Jul 2023',
    status: true
  },
  {
    id: 2,
    ip: '211.03.0.11',
    reason: 'Extract pricing information at inventory levels.',
    date: '24 Aug 2023',
    status: true
  },
  {
    id: 3,
    ip: '211.24.0.17',
    reason: 'Fetching data for competitors to gain competitive advantage.',
    date: '07 Sep 2023',
    status: true
  },
  {
    id: 4,
    ip: '211.12.0.34',
    reason: 'Temporarily block to protect user accounts from internet fraudsters.',
    date: '13 Oct 2023',
    status: true
  }
])

const searchQuery = ref('')
const filterIp = ref('')
const sortBy = ref('newest')
const showFilters = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  ip: '',
  reason: '',
  status: true
})

const filteredIps = computed(() => {
  return banList.value.filter(item => {
    const matchesSearch = item.ip.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.reason.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesIp = filterIp.value ? item.ip.includes(filterIp.value) : true
    return matchesSearch && matchesIp
  })
})

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { ip: '', reason: '', status: true }
  showModal.value = true
}

const openEditModal = (item: BanIp) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ip: item.ip, reason: item.reason, status: item.status }
  showModal.value = true
}

const saveIp = () => {
  if (isEditing.value && editingId.value !== null) {
    const index = banList.value.findIndex(i => i.id === editingId.value)
    if (index !== -1) {
      banList.value[index] = {
        ...banList.value[index],
        ip: form.value.ip,
        reason: form.value.reason,
        status: form.value.status
      }
    }
  } else {
    banList.value.unshift({
      id: Date.now(),
      ip: form.value.ip,
      reason: form.value.reason,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: form.value.status
    })
  }
  showModal.value = false
}

const deleteIp = (id: number) => {
  if (confirm('Are you sure you want to unban this IP address?')) {
    banList.value = banList.value.filter(i => i.id !== id)
  }
}

const clearFilter = () => {
  filterIp.value = ''
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>

