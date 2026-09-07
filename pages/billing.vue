<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Billing List</h4>
            <h6>Manage Billing and Invoice Transactions</h6>
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
      </div>

      <!-- KPI Widgets -->
      <div class="row mt-3 mb-4">
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Transaction</h6>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-primary rounded-circle">
              <i class="ti ti-receipt fs-24 text-primary"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Success</h6>
              <h4 class="mb-0 fw-bold text-success">4,385</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-success rounded-circle">
              <i class="ti ti-circle-check fs-24 text-success"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Failed</h6>
              <h4 class="mb-0 fw-bold text-danger">385,656</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-danger rounded-circle">
              <i class="ti ti-circle-x fs-24 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search billing id, tx, user..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterMethod" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Methods</option>
                <option value="Kartu Kredit">Kartu Kredit</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="Virtual Account">Virtual Account</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Statuses</option>
                <option value="Berhasil">Berhasil</option>
                <option value="Gagal">Gagal</option>
              </select>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>ID Billing</th>
                  <th>ID Transaksi</th>
                  <th>ID Pengguna</th>
                  <th>Tanggal Billing</th>
                  <th class="text-end">Jumlah Tagihan</th>
                  <th class="text-end">Diskon</th>
                  <th class="text-end">Pajak</th>
                  <th class="text-end">Biaya Kirim</th>
                  <th class="text-end">Total Pembayaran</th>
                  <th>Status</th>
                  <th>Metode</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredBillings" :key="item.id">
                  <td class="fw-semibold text-primary">{{ item.billingId }}</td>
                  <td class="fw-medium">{{ item.txId }}</td>
                  <td class="small">{{ item.userEmail }}</td>
                  <td>{{ item.date }}</td>
                  <td class="text-end">{{ formatNumber(item.subtotal) }}</td>
                  <td class="text-end text-danger">{{ item.discount > 0 ? `-${formatNumber(item.discount)}` : '0' }}</td>
                  <td class="text-end">{{ formatNumber(item.tax) }}</td>
                  <td class="text-end">{{ formatNumber(item.shipping) }}</td>
                  <td class="text-end fw-bold text-success">{{ formatNumber(item.total) }}</td>
                  <td>
                    <span class="badge" :class="item.status === 'Berhasil' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td><span class="badge bg-light text-dark border">{{ item.method }}</span></td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2 text-info" href="javascript:void(0);" title="View Invoice" @click="openViewModal(item)">
                        <i class="ti ti-eye"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredBillings.length === 0">
                  <td colspan="12" class="text-center py-4 text-muted">No billing records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- View Detail Modal -->
      <div v-if="showViewModal && activeItem" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Billing Detail - {{ activeItem.billingId }}</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-2">
                <div class="col-6 text-muted">ID Transaksi</div>
                <div class="col-6 text-end fw-medium">{{ activeItem.txId }}</div>
                <div class="col-6 text-muted">User Email</div>
                <div class="col-6 text-end small">{{ activeItem.userEmail }}</div>
                <div class="col-6 text-muted">Tanggal</div>
                <div class="col-6 text-end">{{ activeItem.date }}</div>
                <div class="col-6 text-muted">Jumlah Tagihan</div>
                <div class="col-6 text-end">Rp {{ formatNumber(activeItem.subtotal) }}</div>
                <div class="col-6 text-muted">Diskon</div>
                <div class="col-6 text-end text-danger">- Rp {{ formatNumber(activeItem.discount) }}</div>
                <div class="col-6 text-muted">Pajak</div>
                <div class="col-6 text-end">Rp {{ formatNumber(activeItem.tax) }}</div>
                <div class="col-6 text-muted">Biaya Kirim</div>
                <div class="col-6 text-end">Rp {{ formatNumber(activeItem.shipping) }}</div>
                <hr class="my-2" />
                <div class="col-6 fw-bold">Total Pembayaran</div>
                <div class="col-6 text-end fw-bold text-success fs-16">Rp {{ formatNumber(activeItem.total) }}</div>
                <div class="col-6 text-muted">Metode</div>
                <div class="col-6 text-end">{{ activeItem.method }}</div>
                <div class="col-6 text-muted">Status</div>
                <div class="col-6 text-end"><span class="badge" :class="activeItem.status === 'Berhasil' ? 'bg-success' : 'bg-danger'">{{ activeItem.status }}</span></div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Close</button>
              <button type="button" class="btn btn-primary" @click="printTable">Print</button>
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
  title: 'Billing - Kacetak System'
})

interface BillingItem {
  id: number
  billingId: string
  txId: string
  userEmail: string
  date: string
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  status: 'Berhasil' | 'Gagal'
  method: string
}

const billings = ref<BillingItem[]>([
  { id: 1, billingId: 'B-001', txId: 'T-101', userEmail: 'john.doe@email.com', date: '2025-08-28', subtotal: 530000, discount: 53000, tax: 20000, shipping: 20000, total: 517000, status: 'Berhasil', method: 'Kartu Kredit' },
  { id: 2, billingId: 'B-002', txId: 'T-102', userEmail: 'jane.smith@email.com', date: '2025-08-28', subtotal: 155000, discount: 0, tax: 15500, shipping: 15000, total: 185500, status: 'Berhasil', method: 'Transfer Bank' },
  { id: 3, billingId: 'B-003', txId: 'T-103', userEmail: 'david.williams@email.com', date: '2025-08-27', subtotal: 230000, discount: 0, tax: 23000, shipping: 18000, total: 271000, status: 'Berhasil', method: 'E-Wallet' },
  { id: 4, billingId: 'B-004', txId: 'T-104', userEmail: 'sarah.jones@email.com', date: '2025-08-26', subtotal: 1200000, discount: 240000, tax: 120000, shipping: 0, total: 1080000, status: 'Gagal', method: 'Kartu Kredit' },
  { id: 5, billingId: 'B-005', txId: 'T-105', userEmail: 'michael.brown@email.com', date: '2025-08-25', subtotal: 275000, discount: 0, tax: 27500, shipping: 25000, total: 327500, status: 'Berhasil', method: 'Virtual Account' },
  { id: 6, billingId: 'B-006', txId: 'T-106', userEmail: 'emma.white@email.com', date: '2025-08-24', subtotal: 850000, discount: 85000, tax: 85000, shipping: 30000, total: 880000, status: 'Berhasil', method: 'Kartu Kredit' }
])

const searchQuery = ref('')
const filterMethod = ref('')
const filterStatus = ref('')

const filteredBillings = computed(() => {
  return billings.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      item.billingId.toLowerCase().includes(q) ||
      item.txId.toLowerCase().includes(q) ||
      item.userEmail.toLowerCase().includes(q)
    const matchMethod = !filterMethod.value || item.method === filterMethod.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchMethod && matchStatus
  })
})

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

const showViewModal = ref(false)
const activeItem = ref<BillingItem | null>(null)

const openViewModal = (item: BillingItem) => {
  activeItem.value = item
  showViewModal.value = true
}

const closeModal = () => {
  showViewModal.value = false
  activeItem.value = null
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  searchQuery.value = ''
  filterMethod.value = ''
  filterStatus.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}
</script>
