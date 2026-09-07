<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Annual Report</h4>
          <h6>Annual comprehensive performance report</h6>
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
            <div class="d-flex gap-2">
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
                <th class="text-end">Total Revenue</th>
                <th class="text-end">COGS</th>
                <th class="text-end">Gross Profit</th>
                <th class="text-end">Operating Expenses</th>
                <th class="text-end">Net Profit</th>
                <th class="text-end">Net Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRows" :key="item.month + item.year">
                <td class="fw-semibold">{{ item.month }}</td>
                <td>{{ item.year }}</td>
                <td class="text-end">{{ formatNumber(item.revenue) }}</td>
                <td class="text-end text-danger">{{ formatNumber(item.cogs) }}</td>
                <td class="text-end fw-semibold text-primary">{{ formatNumber(item.revenue - item.cogs) }}</td>
                <td class="text-end text-danger">{{ formatNumber(item.opex) }}</td>
                <td class="text-end fw-bold text-success">{{ formatNumber(item.revenue - item.cogs - item.opex) }}</td>
                <td class="text-end fw-bold">
                  {{ (((item.revenue - item.cogs - item.opex) / item.revenue) * 100).toFixed(2) }}%
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold table-light">
                <td colspan="2">TOTAL</td>
                <td class="text-end text-primary">{{ formatNumber(totalRevenue) }}</td>
                <td class="text-end text-danger">{{ formatNumber(totalCogs) }}</td>
                <td class="text-end text-primary">{{ formatNumber(totalGross) }}</td>
                <td class="text-end text-danger">{{ formatNumber(totalOpex) }}</td>
                <td class="text-end text-success">{{ formatNumber(totalNet) }}</td>
                <td class="text-end">{{ ((totalNet / totalRevenue) * 100).toFixed(2) }}%</td>
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
  { month: "January", year: "2025", revenue: 155000000, cogs: 82150000, opex: 26500000 },
  { month: "February", year: "2025", revenue: 184200000, cogs: 99000000, opex: 28100000 },
  { month: "March", year: "2025", revenue: 175500000, cogs: 94700000, opex: 27200000 },
  { month: "April", year: "2025", revenue: 192000000, cogs: 101500000, opex: 29000000 },
]);

const searchQuery = ref("");
const yearFilter = ref("2025");

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const matchesSearch = !searchQuery.value || r.month.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesYear = !yearFilter.value || r.year === yearFilter.value;
    return matchesSearch && matchesYear;
  });
});

const totalRevenue = computed(() => filteredRows.value.reduce((acc, r) => acc + r.revenue, 0));
const totalCogs = computed(() => filteredRows.value.reduce((acc, r) => acc + r.cogs, 0));
const totalGross = computed(() => totalRevenue.value - totalCogs.value);
const totalOpex = computed(() => filteredRows.value.reduce((acc, r) => acc + r.opex, 0));
const totalNet = computed(() => totalGross.value - totalOpex.value);

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
