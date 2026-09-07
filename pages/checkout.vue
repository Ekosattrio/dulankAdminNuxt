<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Checkout List</h4>
            <h6>Manage completed and pending customer checkouts</h6>
          </div>
        </div>
      </div>

      <!-- Dashboard Metric Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-shopping-cart-check fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Checkout</h6>
              <h4 class="fw-bold mb-0">{{ checkouts.length }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash1 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-cash fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Revenue</h6>
              <h4 class="fw-bold mb-0">Rp {{ formatNumber(totalRevenue) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash2 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-info bg-opacity-10 p-3 rounded">
              <i class="ti ti-circle-check fs-2 text-info"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Success</h6>
              <h4 class="fw-bold mb-0">{{ successCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash3 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-danger bg-opacity-10 p-3 rounded">
              <i class="ti ti-alert-triangle fs-2 text-danger"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Failed</h6>
              <h4 class="fw-bold mb-0">{{ failedCount }}</h4>
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search customer or product details..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="methodDropdownOpen = !methodDropdownOpen"
                >
                  Metode: {{ filterMethod || 'All' }}
                </button>
                <ul v-if="methodDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterMethod = ''; methodDropdownOpen = false">All Methods</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterMethod = 'Kartu Kredit'; methodDropdownOpen = false">Kartu Kredit</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterMethod = 'Transfer Bank'; methodDropdownOpen = false">Transfer Bank</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterMethod = 'E-Wallet'; methodDropdownOpen = false">E-Wallet</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterMethod = 'Virtual Account'; methodDropdownOpen = false">Virtual Account</a></li>
                </ul>
              </div>
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
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Berhasil'; statusDropdownOpen = false">Berhasil</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Gagal'; statusDropdownOpen = false">Gagal</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>User</th>
                  <th>Date Checkout</th>
                  <th class="text-end">Payment Amount</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th>Voucher</th>
                  <th class="text-end">Delivery Fee</th>
                  <th>Detail Product</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredCheckouts" :key="item.id">
                  <td class="fw-semibold text-dark">{{ item.user }}</td>
                  <td>{{ item.date }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(item.amount) }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.method }}</span>
                  </td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="item.status === 'Berhasil' ? 'badge-success' : 'badge-danger'"
                    >
                      • {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <span v-if="item.voucher !== '-'" class="badge bg-warning text-dark font-monospace">{{ item.voucher }}</span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td class="text-end">{{ item.deliveryFee > 0 ? `Rp ${formatNumber(item.deliveryFee)}` : '-' }}</td>
                  <td class="small text-muted text-wrap" style="max-width: 250px;">{{ item.details }}</td>
                </tr>
                <tr v-if="filteredCheckouts.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">
                    No checkout records found.
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

interface CheckoutItem {
  id: number
  user: string
  date: string
  amount: number
  method: string
  status: 'Berhasil' | 'Gagal'
  voucher: string
  deliveryFee: number
  details: string
}

const checkouts = ref<CheckoutItem[]>([
  { id: 1, user: 'john.doe@email.com', date: '2025-09-29', amount: 550000, method: 'Kartu Kredit', status: 'Berhasil', voucher: 'DISKON10', deliveryFee: 20000, details: 'Cetak Brosur A4 (500), Kartu Nama (2 box)' },
  { id: 2, user: 'jane.smith@email.com', date: '2025-09-29', amount: 170000, method: 'Transfer Bank', status: 'Berhasil', voucher: '-', deliveryFee: 15000, details: 'Sticker Vinyl Cutting A3+ (10 lembar)' },
  { id: 3, user: 'david.williams@email.com', date: '2025-09-28', amount: 255000, method: 'E-Wallet', status: 'Berhasil', voucher: '-', deliveryFee: 18000, details: 'Buku Yasin Softcover (50 pcs)' },
  { id: 4, user: 'sarah.jones@email.com', date: '2025-09-27', amount: 1200000, method: 'Kartu Kredit', status: 'Gagal', voucher: 'PROMO20', deliveryFee: 0, details: 'Hardbox Souvenir Custom Foil Emas (100 pcs)' },
  { id: 5, user: 'michael.brown@email.com', date: '2025-09-27', amount: 300000, method: 'Virtual Account', status: 'Berhasil', voucher: '-', deliveryFee: 25000, details: 'Spanduk Outdoor Flexi 280g 3x1m (2)' },
  { id: 6, user: 'emily.davis@email.com', date: '2025-09-26', amount: 85000, method: 'E-Wallet', status: 'Berhasil', voucher: 'CUAN5', deliveryFee: 12000, details: 'Print HVS Warna A4 Tugas Akhir (1 jilid)' },
  { id: 7, user: 'chris.wilson@email.com', date: '2025-09-26', amount: 450000, method: 'Transfer Bank', status: 'Berhasil', voucher: '-', deliveryFee: 20000, details: 'Kalender Meja Dudukan Linen (25 pcs)' }
])

const searchQuery = ref('')
const filterMethod = ref('')
const filterStatus = ref('')
const methodDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const totalRevenue = computed(() => {
  return checkouts.value
    .filter(c => c.status === 'Berhasil')
    .reduce((sum, c) => sum + c.amount, 0)
})
const successCount = computed(() => checkouts.value.filter(c => c.status === 'Berhasil').length)
const failedCount = computed(() => checkouts.value.filter(c => c.status === 'Gagal').length)

const filteredCheckouts = computed(() => {
  return checkouts.value.filter(c => {
    const matchMethod = !filterMethod.value || c.method === filterMethod.value
    const matchStatus = !filterStatus.value || c.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      c.user.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.details.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.voucher.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchMethod && matchStatus && matchSearch
  })
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}
</script>
