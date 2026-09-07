<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Group Paper's List (Marketplace)</h4>
            <h6>Directory of paper groups across partner printers and paper merchants</h6>
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
          <NuxtLink to="/kertas-group-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Kertas Sendiri
          </NuxtLink>
        </div>
      </div>

      <!-- Dashboard Metric Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-files fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Paper Groups</h6>
              <h4 class="fw-bold mb-0">{{ groups.length }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash1 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-printer fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Percetakan</h6>
              <h4 class="fw-bold mb-0">{{ vendorCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash2 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-info bg-opacity-10 p-3 rounded">
              <i class="ti ti-share fs-2 text-info"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Published</h6>
              <h4 class="fw-bold mb-0">{{ publishedCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash3 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-secondary bg-opacity-10 p-3 rounded">
              <i class="ti ti-lock fs-2 text-secondary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Private</h6>
              <h4 class="fw-bold mb-0">{{ privateCount }}</h4>
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search paper group, merk, or vendor..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="groupDropdownOpen = !groupDropdownOpen"
                >
                  Group: {{ filterGroup || 'All Groups' }}
                </button>
                <ul v-if="groupDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterGroup = ''; groupDropdownOpen = false">All Groups</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterGroup = 'HVS Putih'; groupDropdownOpen = false">HVS Putih</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterGroup = 'Art Paper'; groupDropdownOpen = false">Art Paper</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterGroup = 'Art Carton'; groupDropdownOpen = false">Art Carton</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterGroup = 'Ivory'; groupDropdownOpen = false">Ivory</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterGroup = 'Duplex'; groupDropdownOpen = false">Duplex</a></li>
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

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Sumber / Vendor</th>
                  <th>Paper's Group</th>
                  <th>Merk</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="g in filteredGroups" :key="g.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="g.avatar"
                        :alt="g.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 36px; height: 36px;"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ g.sumber }}</span>
                        <span class="text-muted fs-11">{{ g.lokasi }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="fw-medium text-dark">{{ g.name }}</td>
                  <td>{{ g.merk }}</td>
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
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="View Group Details"
                        @click="viewGroup(g)"
                      >
                        <i class="ti ti-eye fs-16"></i>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PaperGroupItem {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  name: string
  merk: string
  update: string
  status: 'Active' | 'Inactive'
  isPublic: boolean
}

const groups = ref<PaperGroupItem[]>([
  { id: 1, sumber: 'Percetakan Cepat', lokasi: 'Surabaya, Jawa Timur', avatar: '/assets/img/users/user-23.jpg', name: 'HVS Putih', merk: 'Sinar Dunia', update: '09/11/2025 09:00', status: 'Active', isPublic: true },
  { id: 2, sumber: 'Media Jaya Printing', lokasi: 'Bandung, Jawa Barat', avatar: '/assets/img/users/user-24.jpg', name: 'Art Paper', merk: 'Pindo Deli', update: '09/11/2025 10:30', status: 'Active', isPublic: true },
  { id: 3, sumber: 'Toko Kertas Makmur', lokasi: 'Jakarta Utara, Jakarta', avatar: '/assets/img/users/user-25.jpg', name: 'Art Carton', merk: 'Mattel / Golden Coin', update: '09/12/2025 14:00', status: 'Active', isPublic: true },
  { id: 4, sumber: 'Percetakan Cahaya Grafika', lokasi: 'Semarang, Jawa Tengah', avatar: '/assets/img/users/user-26.jpg', name: 'Ivory', merk: 'Sinar Mas', update: '09/12/2025 16:30', status: 'Active', isPublic: false },
  { id: 5, sumber: 'Mitra Kemasan Perkasa', lokasi: 'Bekasi, Jawa Barat', avatar: '/assets/img/users/user-27.jpg', name: 'Duplex', merk: 'Cenming', update: '09/10/2025 11:20', status: 'Inactive', isPublic: false }
])

const searchQuery = ref('')
const filterGroup = ref('')
const filterStatus = ref('')
const groupDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const vendorCount = computed(() => new Set(groups.value.map(g => g.sumber)).size)
const publishedCount = computed(() => groups.value.filter(g => g.isPublic).length)
const privateCount = computed(() => groups.value.filter(g => !g.isPublic).length)

const filteredGroups = computed(() => {
  return groups.value.filter(g => {
    const matchGroup = !filterGroup.value || g.name === filterGroup.value
    const matchStatus = !filterStatus.value || g.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      g.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchGroup && matchStatus && matchSearch
  })
})

function viewGroup(g: PaperGroupItem) {
  alert(`Paper Group: ${g.name} (${g.merk}) provided by ${g.sumber}`)
}

function exportPdf() {
  alert('Exporting paper groups as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterGroup.value = ''
  filterStatus.value = ''
}
</script>
