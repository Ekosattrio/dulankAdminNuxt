<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Expense Report</h4>
          <h6>Manage your Expense Report</h6>
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
              <input v-model="searchQuery" type="text" placeholder="Search category..." class="form-control form-control-sm" />
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
                <div
                  v-if="showDateDropdown"
                  class="pemilihrentang-panel position-absolute bg-white border rounded shadow p-2 mt-1 z-3"
                >
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
                <th>Category</th>
                <th class="text-center">Total Expense (Trx)</th>
                <th class="text-end">Amount (IDR)</th>
                <th class="text-end">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRows" :key="item.category">
                <td class="fw-semibold">{{ item.category }}</td>
                <td class="text-center">{{ item.count }}</td>
                <td class="text-end fw-bold">{{ formatNumber(item.amount) }}</td>
                <td class="text-end">{{ item.percentage }}%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="fw-bold">Total</td>
                <td class="fw-bold text-center">{{ totalCount }}</td>
                <td class="fw-bold text-end text-primary">{{ formatNumber(totalAmount) }}</td>
                <td class="fw-bold text-end">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const rows = ref([
  { category: "Bahan Baku Percetakan", count: 18, amount: 45500000, percentage: "38.41" },
  { category: "Gaji Karyawan & Operator", count: 1, amount: 32000000, percentage: "27.02" },
  { category: "Sewa Gedung / Ruko", count: 1, amount: 12000000, percentage: "10.13" },
  { category: "Utilitas (Listrik & Air)", count: 4, amount: 7200000, percentage: "6.08" },
  { category: "Pemeliharaan Mesin", count: 3, amount: 5800000, percentage: "4.89" },
  { category: "Pemasaran & Iklan Digital", count: 6, amount: 4500000, percentage: "3.80" },
  { category: "Logistik & Pengiriman", count: 25, amount: 3750000, percentage: "3.17" },
  { category: "Perlengkapan Kantor (ATK)", count: 12, amount: 2850000, percentage: "2.41" },
  { category: "Biaya Keamanan & Kebersihan", count: 2, amount: 2500000, percentage: "2.11" },
  { category: "Biaya Tak Terduga", count: 5, amount: 2350000, percentage: "1.98" },
]);

const searchQuery = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    return !searchQuery.value || r.category.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const totalCount = computed(() => filteredRows.value.reduce((acc, r) => acc + r.count, 0));
const totalAmount = computed(() => filteredRows.value.reduce((acc, r) => acc + r.amount, 0));

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
};

const toggleHeader = () => {
  // toggle
};
</script>
