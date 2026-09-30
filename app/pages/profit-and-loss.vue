<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Profit & Loss</h4>
          <h6>Financial statement of comprehensive income</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printStatement">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printStatement">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- P&L Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div class="d-flex align-items-center gap-2">
            <label class="fw-bold mb-0">Period:</label>
            <select class="form-select form-select-sm" v-model="selectedPeriod" style="width: 180px">
              <option value="feb2025">February 2025</option>
              <option value="jan2025">January 2025</option>
              <option value="ytd2025">Year-to-Date 2025</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%">Description</th>
                <th class="text-end" style="width: 25%">Value (IDR)</th>
                <th class="text-end" style="width: 15%">Percentage (%)</th>
              </tr>
            </thead>
            <tbody>
              <!-- REVENUE -->
              <tr class="table-secondary fw-bold">
                <td colspan="3">REVENUE</td>
              </tr>
              <tr>
                <td class="ps-4">Core Product Sales (Digital Print, Banners, etc.)</td>
                <td class="text-end">{{ formatNumber(revenue.coreSales) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">Non-Core Income (Waste Sales, Layout Services, etc.)</td>
                <td class="text-end">{{ formatNumber(revenue.nonCore) }}</td>
                <td></td>
              </tr>
              <tr class="table-light fw-bold">
                <td class="ps-4">Total Gross Revenue</td>
                <td class="text-end text-primary">{{ formatNumber(totalRevenue) }}</td>
                <td class="text-end">100%</td>
              </tr>

              <!-- Spacer -->
              <tr>
                <td colspan="3" class="py-2"></td>
              </tr>

              <!-- COGS -->
              <tr class="table-secondary fw-bold">
                <td colspan="3">COST OF GOODS SOLD (COGS)</td>
              </tr>
              <tr>
                <td class="ps-4">Raw Material Purchases (Paper, Ink, Plates)</td>
                <td class="text-end text-danger">- {{ formatNumber(cogs.materials) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">Direct Labor Costs (Machine Operators)</td>
                <td class="text-end text-danger">- {{ formatNumber(cogs.directLabor) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">Electricity & Machine Maintenance</td>
                <td class="text-end text-danger">- {{ formatNumber(cogs.maintenance) }}</td>
                <td></td>
              </tr>
              <tr class="table-light fw-bold">
                <td class="ps-4">Total COGS</td>
                <td class="text-end text-danger">- {{ formatNumber(totalCogs) }}</td>
                <td class="text-end">{{ ((totalCogs / totalRevenue) * 100).toFixed(2) }}%</td>
              </tr>

              <!-- Spacer -->
              <tr>
                <td colspan="3" class="py-2"></td>
              </tr>

              <!-- Gross Profit -->
              <tr class="table-primary fw-bold fs-6">
                <td>GROSS PROFIT</td>
                <td class="text-end">{{ formatNumber(grossProfit) }}</td>
                <td class="text-end">{{ ((grossProfit / totalRevenue) * 100).toFixed(2) }}%</td>
              </tr>

              <!-- Spacer -->
              <tr>
                <td colspan="3" class="py-2"></td>
              </tr>

              <!-- OPERATING EXPENSES -->
              <tr class="table-secondary fw-bold">
                <td colspan="3">OPERATING EXPENSES</td>
              </tr>
              <tr>
                <td class="ps-4">Management & Admin Salaries</td>
                <td class="text-end text-danger">- {{ formatNumber(opex.salaries) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">Workshop / Shopfront Rent</td>
                <td class="text-end text-danger">- {{ formatNumber(opex.rent) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">Marketing & Advertising</td>
                <td class="text-end text-danger">- {{ formatNumber(opex.marketing) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">Logistics & Shipping</td>
                <td class="text-end text-danger">- {{ formatNumber(opex.logistics) }}</td>
                <td></td>
              </tr>
              <tr>
                <td class="ps-4">General Office Supplies (Stationery)</td>
                <td class="text-end text-danger">- {{ formatNumber(opex.office) }}</td>
                <td></td>
              </tr>
              <tr class="table-light fw-bold">
                <td class="ps-4">Total Operating Expenses</td>
                <td class="text-end text-danger">- {{ formatNumber(totalOpex) }}</td>
                <td class="text-end">{{ ((totalOpex / totalRevenue) * 100).toFixed(2) }}%</td>
              </tr>

              <!-- Spacer -->
              <tr>
                <td colspan="3" class="py-2"></td>
              </tr>

              <!-- EBT -->
              <tr class="table-light fw-bold">
                <td>EARNINGS BEFORE TAX (EBT)</td>
                <td class="text-end">{{ formatNumber(ebt) }}</td>
                <td class="text-end">{{ ((ebt / totalRevenue) * 100).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td class="ps-4">Estimated Income Tax (Final PPH 0.5%)</td>
                <td class="text-end text-danger">- {{ formatNumber(tax) }}</td>
                <td></td>
              </tr>

              <!-- Spacer -->
              <tr>
                <td colspan="3" class="py-2"></td>
              </tr>

              <!-- NET PROFIT -->
              <tr class="table-success fw-bold fs-5">
                <td>NET PROFIT</td>
                <td class="text-end text-success">{{ formatNumber(netProfit) }}</td>
                <td class="text-end">{{ ((netProfit / totalRevenue) * 100).toFixed(2) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const selectedPeriod = ref("feb2025");

const revenue = ref({
  coreSales: 165450000,
  nonCore: 18750000,
});

const cogs = ref({
  materials: 75500000,
  directLabor: 15000000,
  maintenance: 8500000,
});

const opex = ref({
  salaries: 12000000,
  rent: 5000000,
  marketing: 4500000,
  logistics: 3750000,
  office: 2850000,
});

const totalRevenue = computed(() => revenue.value.coreSales + revenue.value.nonCore);
const totalCogs = computed(() => cogs.value.materials + cogs.value.directLabor + cogs.value.maintenance);
const grossProfit = computed(() => totalRevenue.value - totalCogs.value);
const totalOpex = computed(
  () => opex.value.salaries + opex.value.rent + opex.value.marketing + opex.value.logistics + opex.value.office,
);
const ebt = computed(() => grossProfit.value - totalOpex.value);
const tax = computed(() => Math.round(totalRevenue.value * 0.005));
const netProfit = computed(() => ebt.value - tax.value);

const printStatement = () => {
  window.print();
};

const toggleHeader = () => {
  // toggle
};
</script>
