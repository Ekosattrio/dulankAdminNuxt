<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Customer Report</h4>
          <h6>Manage customer order and performance reports</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printReport">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printReport">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click.prevent="refreshReport">
            <i class="feather-rotate-ccw"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search customer..."
                class="form-control form-control-sm"
              />
            </div>
            <div class="my-2">
              <div class="pemilihrentang-container position-relative">
                <input
                  type="text"
                  class="pemilihrentang-input form-control form-control-sm cursor-pointer"
                  readonly
                  placeholder="Date Range"
                  :value="selectedDateRangeLabel"
                  @click="showDateDropdown = !showDateDropdown"
                  style="height: fit-content !important; width: 100% !important"
                />
                <div v-if="showDateDropdown" class="pemilihrentang-panel position-absolute bg-white border rounded shadow p-2 mt-1 z-3">
                  <div class="opsi-cepat">
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('kemarin')">Kemarin</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('7hari')">7 Hari Terakhir</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('bulanIni')">Bulan Ini</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('bulanLalu')">Bulan Lalu</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer text-muted" @click="setDateRange('semua')">Semua</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th class="text-center">Total Order</th>
                <th class="text-end">Amount (IDR)</th>
                <th class="text-center">Avg. Lead Time</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredCustomers" :key="item.name">
                <td class="fw-bold">{{ item.name }}</td>
                <td class="text-center">{{ item.totalOrder }}</td>
                <td class="text-end fw-bold text-success">{{ formatNumber(item.amount) }}</td>
                <td class="text-center">{{ item.avgLeadTime }}</td>
                <td class="action-table-data">
                  <div class="edit-delete-action">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewCustomer(item)" title="View Details">
                      <i class="feather-eye"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No records found.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold table-light">
                <td>Total</td>
                <td class="text-center">{{ totalOrders }}</td>
                <td class="text-end text-primary">{{ formatNumber(totalAmount) }}</td>
                <td class="text-center">3.4 Days</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Customer Order Summary - {{ activeCustomer?.name }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="activeCustomer">
            <p><strong>Total Lifetime Orders:</strong> {{ activeCustomer.totalOrder }} orders</p>
            <p><strong>Total Value:</strong> Rp {{ formatNumber(activeCustomer.amount) }}</p>
            <p><strong>Avg. Turnaround Time:</strong> {{ activeCustomer.avgLeadTime }}</p>
            <div class="modal-footer p-0 pt-3 border-top justify-content-end mt-4">
              <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatNumber } from '~/composables/useFormatters'

const customers = ref([
  { name: 'CV. Maju Jaya', totalOrder: 45, amount: 67500000, avgLeadTime: '3 Days' },
  { name: 'Toko Berkah', totalOrder: 38, amount: 12400000, avgLeadTime: '2 Days' },
  { name: 'Bpk. Heru', totalOrder: 12, amount: 4500000, avgLeadTime: '1 Days' },
  { name: 'PT. Sinar Abadi', totalOrder: 30, amount: 85000000, avgLeadTime: '5 Days' },
  { name: 'Universitas Terbuka', totalOrder: 15, amount: 42000000, avgLeadTime: '7 Days' },
  { name: 'Yayasan Pendidikan Islam', totalOrder: 22, amount: 18750000, avgLeadTime: '4 Days' },
  { name: 'Resto Sedap Malam', totalOrder: 55, amount: 9350000, avgLeadTime: '2 Days' }
])

const searchQuery = ref('')
const selectedDateRangeLabel = ref('')
const showDateDropdown = ref(false)

const setDateRange = (range: string) => {
  if (range === 'kemarin') selectedDateRangeLabel.value = 'Kemarin'
  else if (range === '7hari') selectedDateRangeLabel.value = '7 Hari Terakhir'
  else if (range === 'bulanIni') selectedDateRangeLabel.value = 'Bulan Ini'
  else if (range === 'bulanLalu') selectedDateRangeLabel.value = 'Bulan Lalu'
  else selectedDateRangeLabel.value = ''
  showDateDropdown.value = false
}

const filteredCustomers = computed(() => {
  return customers.value.filter(c => !searchQuery.value || c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const totalOrders = computed(() => filteredCustomers.value.reduce((acc, c) => acc + c.totalOrder, 0))
const totalAmount = computed(() => filteredCustomers.value.reduce((acc, c) => acc + c.amount, 0))

const showModal = ref(false)
const activeCustomer = ref<any>(null)

const viewCustomer = (item: any) => {
  activeCustomer.value = item
  showModal.value = true
}

const printReport = () => {
  window.print()
}

const refreshReport = () => {
  searchQuery.value = ''
}

const toggleHeader = () => {
  // toggle
}
</script>

