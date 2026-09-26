<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Cash Flow</h4>
          <h6>Statement of Cash Flows</h6>
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

    <!-- Cash Flow Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div class="d-flex align-items-center gap-2">
            <label class="fw-bold mb-0">Period:</label>
            <select class="form-select form-select-sm" v-model="selectedPeriod" style="width: 180px">
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="ytd">Year-to-Date</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 70%">DESCRIPTION</th>
                <th class="text-end" style="width: 30%">AMOUNT (IDR)</th>
              </tr>
            </thead>
            <tbody>
              <!-- Operating Activities -->
              <tr class="table-secondary fw-bold">
                <td colspan="2">CASH FLOWS FROM OPERATING ACTIVITIES</td>
              </tr>
              <tr>
                <td class="ps-4">Cash Received from Customers</td>
                <td class="text-end text-success">{{ formatNumber(cf.receivedFromCustomers) }}</td>
              </tr>
              <tr>
                <td class="ps-4">Cash Paid for Materials (Paper, Ink, etc.)</td>
                <td class="text-end text-danger">-{{ formatNumber(cf.paidForMaterials) }}</td>
              </tr>
              <tr>
                <td class="ps-4">Cash Paid for Operating Expenses (Electricity, Rent)</td>
                <td class="text-end text-danger">-{{ formatNumber(cf.paidForOpex) }}</td>
              </tr>
              <tr>
                <td class="ps-4">Cash Paid for Wages/Salaries</td>
                <td class="text-end text-danger">-{{ formatNumber(cf.paidForWages) }}</td>
              </tr>
              <tr class="table-light fw-bold">
                <td>Net Cash Provided by Operating Activities</td>
                <td class="text-end text-primary">{{ formatNumber(netOperatingCash) }}</td>
              </tr>

              <!-- Spacer -->
              <tr><td colspan="2" class="py-2"></td></tr>

              <!-- Other Activities -->
              <tr class="table-secondary fw-bold">
                <td colspan="2">CASH FLOWS FROM FINANCING & INVESTING ACTIVITIES</td>
              </tr>
              <tr>
                <td class="ps-4">Other Financing Activities</td>
                <td class="text-end text-success">{{ formatNumber(cf.financing) }}</td>
              </tr>
              <tr>
                <td class="ps-4">Capital Expenditure (Machine Parts)</td>
                <td class="text-end text-danger">-{{ formatNumber(cf.capex) }}</td>
              </tr>
              <tr class="table-light fw-bold">
                <td>Net Cash from Financing & Investing Activities</td>
                <td class="text-end text-primary">{{ formatNumber(netFinancingCash) }}</td>
              </tr>

              <!-- Spacer -->
              <tr><td colspan="2" class="py-2"></td></tr>

              <!-- Summary Cash -->
              <tr class="table-primary fw-bold">
                <td>NET INCREASE IN CASH</td>
                <td class="text-end text-primary">{{ formatNumber(netCashIncrease) }}</td>
              </tr>
              <tr class="fw-semibold">
                <td>CASH AT BEGINNING OF PERIOD</td>
                <td class="text-end">{{ formatNumber(beginningCash) }}</td>
              </tr>
              <tr class="table-success fw-bold fs-6">
                <td>CASH AT END OF PERIOD</td>
                <td class="text-end text-success">{{ formatNumber(endingCash) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatNumber } from '~/composables/useFormatters'

const selectedPeriod = ref('thisMonth')

const cf = ref({
  receivedFromCustomers: 45000000,
  paidForMaterials: 18000000,
  paidForOpex: 5000000,
  paidForWages: 7000000,
  financing: 3000000,
  capex: 2000000
})

const beginningCash = ref(7000000)

const netOperatingCash = computed(() => {
  return cf.value.receivedFromCustomers - cf.value.paidForMaterials - cf.value.paidForOpex - cf.value.paidForWages
})

const netFinancingCash = computed(() => {
  return cf.value.financing - cf.value.capex
})

const netCashIncrease = computed(() => {
  return netOperatingCash.value + netFinancingCash.value
})

const endingCash = computed(() => {
  return beginningCash.value + netCashIncrease.value
})

const printStatement = () => {
  window.print()
}

const toggleHeader = () => {
  // toggle
}
</script>

