<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Kalkulator Dashboard</h4>
            <h6>Manage and monitor printing cost calculations and API requests</h6>
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
      </div>

      <!-- Realtime Engine Telemetry Card -->
      <div class="card bg-dark text-white mb-4 shadow-lg border-0">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge bg-secondary px-3 py-1">Realtime Calculation Engine</span>
            <span class="text-success small d-flex align-items-center"><i class="ti ti-point-filled me-1"></i>System Operational</span>
          </div>
          <div class="row g-4 mb-2">
            <div class="col-md-4 border-end border-secondary border-opacity-25">
              <div class="fs-13 text-secondary text-uppercase fw-semibold mb-1">Active Users (Current)</div>
              <div class="fs-1 fw-bold text-white mb-2">56</div>
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-primary" role="progressbar" style="width: 65%;"></div>
              </div>
            </div>
            <div class="col-md-4 border-end border-secondary border-opacity-25">
              <div class="fs-13 text-secondary text-uppercase fw-semibold mb-1">Total API Requests (7d)</div>
              <div class="fs-1 fw-bold text-white mb-1">7,920</div>
              <div class="text-success small fw-semibold">+5,056.2% vs last week</div>
            </div>
            <div class="col-md-4">
              <div class="fs-13 text-secondary text-uppercase fw-semibold mb-1">Total Sheet Calculates (7d)</div>
              <div class="fs-1 fw-bold text-white mb-1">18,032</div>
              <div class="text-success small fw-semibold">+2,056.2% calculations</div>
            </div>
          </div>
          <div class="d-flex justify-content-between mt-3 text-secondary small border-top border-secondary border-opacity-25 pt-2">
            <span>Peak Hour: 13:00 - 16:00 WIB</span>
            <span>Avg Computation Latency: 42ms</span>
          </div>
        </div>
      </div>

      <!-- Calculation History Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search user or operator..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || 'All' }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = ''; statusDropdownOpen = false">All Status</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Active'; statusDropdownOpen = false">Active</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Inactive'; statusDropdownOpen = false">Inactive</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>User / Estimator</th>
                  <th class="text-end">Calculate Count</th>
                  <th class="text-end">API Requests</th>
                  <th style="min-width: 140px;">Quota Usage</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsers" :key="u.id">
                  <td class="fw-semibold text-dark">{{ u.name }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(u.calculate) }}</td>
                  <td class="text-end">{{ formatNumber(u.request) }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress flex-grow-1" style="height: 6px;">
                        <div
                          class="progress-bar"
                          :class="u.usage >= 80 ? 'bg-danger' : u.usage >= 50 ? 'bg-warning' : 'bg-success'"
                          :style="{ width: `${u.usage}%` }"
                        ></div>
                      </div>
                      <span class="fs-12 fw-semibold text-muted">{{ u.usage }}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="u.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ u.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="View Calculations"
                        @click="viewDetails(u)"
                      >
                        <i class="ti ti-eye fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Reset Quota"
                        @click="resetQuota(u.id)"
                      >
                        <i class="ti ti-rotate-clockwise fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No calculator user logs found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CalculatorUser {
  id: number
  name: string
  calculate: number
  request: number
  usage: number
  status: 'Active' | 'Inactive'
}

const users = ref<CalculatorUser[]>([
  { id: 1, name: 'Bambang Prakoso (Estimator Lead)', calculate: 1250, request: 580, usage: 85, status: 'Active' },
  { id: 2, name: 'Citra Dewi (Prepress)', calculate: 800, request: 120, usage: 45, status: 'Active' },
  { id: 3, name: 'Dedi Kurnia (Sales Officer)', calculate: 640, request: 95, usage: 35, status: 'Active' },
  { id: 4, name: 'Eka Saputra (Offset Operator)', calculate: 420, request: 60, usage: 22, status: 'Active' },
  { id: 5, name: 'Fajar Nugraha (Branch Bandung)', calculate: 310, request: 45, usage: 18, status: 'Active' },
  { id: 6, name: 'Gita Permata (Intern)', calculate: 50, request: 10, usage: 5, status: 'Inactive' }
])

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchStatus = !filterStatus.value || u.status === filterStatus.value
    const matchSearch = !searchQuery.value || u.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function viewDetails(u: CalculatorUser) {
  alert(`User ${u.name} has performed ${u.calculate} plano and layout calculations with quota usage of ${u.usage}%.`)
}

function resetQuota(id: number) {
  if (confirm('Reset calculation quota for this user?')) {
    const u = users.value.find(item => item.id === id)
    if (u) {
      u.usage = 0
    }
  }
}

function exportPdf() {
  alert('Exporting calculation metrics as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>
