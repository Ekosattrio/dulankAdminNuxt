<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Paper Price Directory (Marketplace)</h4>
            <h6>Realtime vendor paper prices per plano, per kg, and minimum order rules</h6>
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
          <NuxtLink to="/kertas-harga-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Harga Kertas Sendiri
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search paper, group, or vendor..." />
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
                  <th>Nama Kertas</th>
                  <th>Group</th>
                  <th>Merk</th>
                  <th>Ukuran</th>
                  <th class="text-center">GSM</th>
                  <th>Min Order</th>
                  <th>Kelipatan</th>
                  <th class="text-end">Harga Kertas</th>
                  <th>Last Update</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="h in filteredPrices" :key="h.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="h.avatar"
                        :alt="h.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 34px; height: 34px;"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ h.sumber }}</span>
                        <span class="text-muted fs-11">{{ h.lokasi }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="fw-bold text-dark">{{ h.nama }}</td>
                  <td>{{ h.group }}</td>
                  <td>{{ h.merk }}</td>
                  <td>{{ h.ukuran }}</td>
                  <td class="text-center">{{ h.gramatur }}</td>
                  <td>{{ h.minOrder }}</td>
                  <td>{{ h.kelipatan }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(h.harga) }} / {{ h.satuan }}</td>
                  <td>{{ h.update }}</td>
                  <td>
                    <span class="badge bg-success me-1">Publish</span>
                    <span class="badge bg-info">Active</span>
                  </td>
                </tr>
                <tr v-if="filteredPrices.length === 0">
                  <td colspan="11" class="text-center py-4 text-muted">
                    No vendor paper prices found.
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

interface VendorPaperPrice {
  id: number
  sumber: string
  lokasi: string
  avatar: string
  nama: string
  group: string
  merk: string
  ukuran: string
  satuan: string
  gramatur: number
  minOrder: string
  kelipatan: string
  harga: number
  update: string
}

const prices = ref<VendorPaperPrice[]>([
  { id: 1, sumber: 'Percetakan Cepat', lokasi: 'Surabaya, Jawa Timur', avatar: '/assets/img/users/user-23.jpg', nama: 'A4', group: 'HVS Putih', merk: 'Sinar Dunia', ukuran: '21x29.7 cm', satuan: 'rim', gramatur: 80, minOrder: '1 rim', kelipatan: '1 rim', harga: 52000, update: '09/01/2025 10:15' },
  { id: 2, sumber: 'Media Jaya Printing', lokasi: 'Bandung, Jawa Barat', avatar: '/assets/img/users/user-24.jpg', nama: 'Plano 65x100', group: 'Art Paper', merk: 'Pindo Deli', ukuran: '65x100 cm', satuan: 'lembar', gramatur: 150, minOrder: '10 lembar', kelipatan: '10 lembar', harga: 2400, update: '09/01/2025 10:45' },
  { id: 3, sumber: 'Toko Kertas Makmur', lokasi: 'Jakarta Utara, Jakarta', avatar: '/assets/img/users/user-25.jpg', nama: 'Plano 79x109', group: 'Art Carton', merk: 'Golden Coin', ukuran: '79x109 cm', satuan: 'lembar', gramatur: 260, minOrder: '5 lembar', kelipatan: '5 lembar', harga: 4800, update: '09/02/2025 11:20' }
])

const searchQuery = ref('')
const filterGroup = ref('')
const groupDropdownOpen = ref(false)

const filteredPrices = computed(() => {
  return prices.value.filter(p => {
    const matchGroup = !filterGroup.value || p.group === filterGroup.value
    const matchSearch = !searchQuery.value ||
      p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchGroup && matchSearch
  })
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function exportPdf() {
  alert('Exporting paper prices as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterGroup.value = ''
}
</script>
