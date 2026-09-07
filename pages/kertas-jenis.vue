<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Paper Types (Marketplace)</h4>
            <h6>Directory of paper types, gramatures, and specs from all network partners</h6>
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
          <NuxtLink to="/kertas-jenis-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Jenis Kertas Sendiri
          </NuxtLink>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search paper group, merk or gramatur..." />
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
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Sumber</th>
                  <th>Group Kertas</th>
                  <th>Merk</th>
                  <th>Ukuran</th>
                  <th>Satuan</th>
                  <th class="text-center">Gramatur (gsm)</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="j in filteredTypes" :key="j.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="j.avatar"
                        :alt="j.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 36px; height: 36px;"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ j.sumber }}</span>
                        <span class="text-muted fs-11">{{ j.lokasi }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="fw-medium text-dark">{{ j.group }}</td>
                  <td>{{ j.merk }}</td>
                  <td>{{ j.ukuran }}</td>
                  <td>{{ j.satuan }}</td>
                  <td class="text-center fw-bold">{{ j.gramatur }}</td>
                  <td>{{ j.update }}</td>
                  <td>
                    <span class="badge bg-success me-1">Publish</span>
                    <span class="badge bg-info">Active</span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="View spec details"
                        @click="viewSpec(j)"
                      >
                        <i class="ti ti-eye fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredTypes.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">
                    No paper types found.
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

interface PaperTypeItem {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  group: string
  merk: string
  ukuran: string
  satuan: string
  gramatur: number
  update: string
}

const paperTypes = ref<PaperTypeItem[]>([
  { id: 1, sumber: 'Percetakan Cepat', lokasi: 'Surabaya, Jawa Timur', avatar: '/assets/img/users/user-23.jpg', group: 'HVS Putih', merk: 'Sinar Dunia', ukuran: '21x29.7', satuan: 'cm', gramatur: 80, update: '09/01/2025 10:15' },
  { id: 2, sumber: 'Media Jaya Printing', lokasi: 'Bandung, Jawa Barat', avatar: '/assets/img/users/user-24.jpg', group: 'Art Paper', merk: 'Pindo Deli', ukuran: '65x100', satuan: 'cm', gramatur: 150, update: '09/01/2025 10:45' },
  { id: 3, sumber: 'Toko Kertas Makmur', lokasi: 'Jakarta Utara, Jakarta', avatar: '/assets/img/users/user-25.jpg', group: 'Art Carton', merk: 'Golden Coin', ukuran: '79x109', satuan: 'cm', gramatur: 260, update: '09/02/2025 11:20' },
  { id: 4, sumber: 'Gudang Grafika Utama', lokasi: 'Semarang, Jawa Tengah', avatar: '/assets/img/users/user-26.jpg', group: 'Ivory', merk: 'Sinar Mas', ukuran: '65x90', satuan: 'cm', gramatur: 310, update: '09/03/2025 14:10' }
])

const searchQuery = ref('')
const filterGroup = ref('')
const groupDropdownOpen = ref(false)

const filteredTypes = computed(() => {
  return paperTypes.value.filter(p => {
    const matchGroup = !filterGroup.value || p.group === filterGroup.value
    const matchSearch = !searchQuery.value ||
      p.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(p.gramatur).includes(searchQuery.value)
    return matchGroup && matchSearch
  })
})

function viewSpec(j: PaperTypeItem) {
  alert(`Paper Type: ${j.group} ${j.gramatur}gsm (${j.merk}) - Size: ${j.ukuran} ${j.satuan}`)
}

function exportPdf() {
  alert('Exporting paper types as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterGroup.value = ''
}
</script>
