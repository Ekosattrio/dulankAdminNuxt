<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Tax Report</h4>
          <h6>Manage your monthly VAT / PPN tax report</h6>
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
              <input v-model="searchQuery" type="text" placeholder="Search month..." class="form-control form-control-sm" />
            </div>
            <div class="year-select">
              <select class="form-select form-select-sm" v-model="yearFilter">
                <option value="">All Years</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th class="text-end">Output Tax (IDR)</th>
                <th class="text-end">Input Tax (IDR)</th>
                <th class="text-end">Input Tax (Carry Over)</th>
                <th class="text-end">VAT is under or (over) paid</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRows" :key="item.month + item.year">
                <td class="fw-semibold">{{ item.month }}</td>
                <td>{{ item.year }}</td>
                <td class="text-end">{{ formatNumber(item.outputTax) }}</td>
                <td class="text-end">{{ formatNumber(item.inputTax) }}</td>
                <td class="text-end">{{ formatNumber(item.carryOver) }}</td>
                <td class="text-end fw-bold" :class="item.vatDiff < 0 ? 'text-danger' : 'text-success'">
                  {{ formatNumber(item.vatDiff) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold">
                <td colspan="2">Total</td>
                <td class="text-end text-primary">{{ formatNumber(totalOutput) }}</td>
                <td class="text-end text-muted">{{ formatNumber(totalInput) }}</td>
                <td class="text-end text-muted">{{ formatNumber(totalCarryOver) }}</td>
                <td class="text-end" :class="totalDiff < 0 ? 'text-danger' : 'text-success'">
                  {{ formatNumber(totalDiff) }}
                </td>
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
  { month: "January", year: "2025", outputTax: 15000000, inputTax: 12000000, carryOver: 0, vatDiff: 3000000 },
  { month: "February", year: "2025", outputTax: 10000000, inputTax: 12000000, carryOver: 0, vatDiff: -2000000 },
  { month: "March", year: "2025", outputTax: 18000000, inputTax: 14000000, carryOver: 2000000, vatDiff: 2000000 },
  { month: "April", year: "2025", outputTax: 12000000, inputTax: 15000000, carryOver: 0, vatDiff: -3000000 },
  { month: "May", year: "2025", outputTax: 20000000, inputTax: 10000000, carryOver: 3000000, vatDiff: 7000000 },
  { month: "June", year: "2025", outputTax: 15000000, inputTax: 18000000, carryOver: 0, vatDiff: -3000000 },
  { month: "July", year: "2025", outputTax: 14000000, inputTax: 14000000, carryOver: 3000000, vatDiff: 3000000 },
  { month: "August", year: "2025", outputTax: 25000000, inputTax: 15000000, carryOver: 3000000, vatDiff: 7000000 },
  { month: "September", year: "2025", outputTax: 12000000, inputTax: 13000000, carryOver: 0, vatDiff: -1000000 },
  { month: "October", year: "2025", outputTax: 22000000, inputTax: 18000000, carryOver: 1000000, vatDiff: 3000000 },
  { month: "November", year: "2025", outputTax: 16000000, inputTax: 20000000, carryOver: 0, vatDiff: -4000000 },
  { month: "December", year: "2025", outputTax: 30000000, inputTax: 22000000, carryOver: 4000000, vatDiff: 4000000 },
]);

const searchQuery = ref("");
const yearFilter = ref("");

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const matchesSearch = !searchQuery.value || r.month.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesYear = !yearFilter.value || r.year === yearFilter.value;
    return matchesSearch && matchesYear;
  });
});

const totalOutput = computed(() => filteredRows.value.reduce((acc, r) => acc + r.outputTax, 0));
const totalInput = computed(() => filteredRows.value.reduce((acc, r) => acc + r.inputTax, 0));
const totalCarryOver = computed(() => filteredRows.value.reduce((acc, r) => acc + r.carryOver, 0));
const totalDiff = computed(() => filteredRows.value.reduce((acc, r) => acc + r.vatDiff, 0));

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
  yearFilter.value = "";
};

const toggleHeader = () => {
  // toggle
};
</script>
