<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Paper Sizes (Marketplace)</h4>
            <h6>Standard and custom plano paper sizes across vendor networks</h6>
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
          <NuxtLink to="/kertas-ukuran-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Ukuran Sendiri
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search size name or dimensions..." />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Sumber</th>
                  <th>Ukuran</th>
                  <th>Dimensi (P x L)</th>
                  <th>Unit</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredSizes" :key="u.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="u.avatar"
                        :alt="u.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 36px; height: 36px;"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ u.sumber }}</span>
                        <span class="text-muted fs-11">{{ u.lokasi }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="fw-bold text-dark">{{ u.name }}</td>
                  <td><span class="badge bg-light text-dark font-monospace border">{{ u.dimension }}</span></td>
                  <td>{{ u.unit }}</td>
                  <td>{{ u.update }}</td>
                  <td>
                    <span class="badge bg-info">Active</span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="View details"
                        @click="viewDetails(u)"
                      >
                        <i class="ti ti-eye fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredSizes.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">
                    No paper sizes found.
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

interface PaperSizeItem {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  name: string
  dimension: string
  unit: string
  update: string
}

const sizes = ref<PaperSizeItem[]>([
  { id: 1, sumber: 'Percetakan Cepat', lokasi: 'Surabaya, Jawa Timur', avatar: '/assets/img/users/user-23.jpg', name: 'A4 Cut', dimension: '21 x 29.7', unit: 'cm', update: '09/16/2025 09:00' },
  { id: 2, sumber: 'Media Jaya Printing', lokasi: 'Bandung, Jawa Barat', avatar: '/assets/img/users/user-24.jpg', name: 'Plano Sedang 1', dimension: '65 x 90', unit: 'cm', update: '09/16/2025 10:30' },
  { id: 3, sumber: 'Toko Kertas Makmur', lokasi: 'Jakarta Utara, Jakarta', avatar: '/assets/img/users/user-25.jpg', name: 'Plano Besar 1', dimension: '79 x 109', unit: 'cm', update: '09/16/2025 11:15' },
  { id: 4, sumber: 'Gudang Grafika Utama', lokasi: 'Semarang, Jawa Tengah', avatar: '/assets/img/users/user-26.jpg', name: 'Plano Sedang 2', dimension: '65 x 100', unit: 'cm', update: '09/17/2025 13:40' },
  { id: 5, sumber: 'Mitra Kemasan Perkasa', lokasi: 'Bekasi, Jawa Barat', avatar: '/assets/img/users/user-27.jpg', name: 'Plano Besar 2', dimension: '86 x 106', unit: 'cm', update: '09/17/2025 15:00' }
])

const searchQuery = ref('')

const filteredSizes = computed(() => {
  return sizes.value.filter(s => {
    return !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.dimension.includes(searchQuery.value) ||
      s.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

function viewDetails(u: PaperSizeItem) {
  alert(`Paper Size: ${u.name} (${u.dimension} ${u.unit}) by ${u.sumber}`)
}

function exportPdf() {
  alert('Exporting paper sizes as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
}
</script>

