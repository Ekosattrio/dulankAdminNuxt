<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Balance Sheet</h4>
          <h6>Statement of Financial Position</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printSheet">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printSheet">
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

    <!-- Sheet Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div class="d-flex align-items-center gap-2">
            <label class="fw-bold mb-0">As of Date:</label>
            <input type="date" class="form-control form-control-sm" v-model="asOfDate" style="width: 160px" />
          </div>
        </div>

        <div class="table-responsive">
          <div class="row g-4">
            <!-- Assets Side -->
            <div class="col-md-6">
              <div class="p-3 border rounded bg-white">
                <table class="table align-middle mb-0">
                  <thead>
                    <tr class="table-light">
                      <th class="fw-bold">ASSETS</th>
                      <th class="text-end fw-bold">Debit (IDR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="table-secondary fw-semibold">
                      <td colspan="2">Current Assets</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Cash and Bank</td>
                      <td class="text-end">{{ formatNumber(assets.cashAndBank) }}</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Accounts Receivable (Customer invoices)</td>
                      <td class="text-end">{{ formatNumber(assets.receivables) }}</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Inventory (Paper, Ink, Raw Materials)</td>
                      <td class="text-end">{{ formatNumber(assets.inventory) }}</td>
                    </tr>
                    <tr class="fw-bold table-light">
                      <td>Total Current Assets</td>
                      <td class="text-end text-primary">{{ formatNumber(totalCurrentAssets) }}</td>
                    </tr>
                    <tr class="table-secondary fw-semibold">
                      <td colspan="2">Fixed Assets</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Printing Machinery & Equipment</td>
                      <td class="text-end">{{ formatNumber(assets.machinery) }}</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Accumulated Depreciation</td>
                      <td class="text-end text-danger">-{{ formatNumber(assets.depreciation) }}</td>
                    </tr>
                    <tr class="fw-bold table-light">
                      <td>Total Fixed Assets</td>
                      <td class="text-end text-primary">{{ formatNumber(totalFixedAssets) }}</td>
                    </tr>
                    <tr class="fw-bold table-primary fs-6">
                      <td>TOTAL ASSETS</td>
                      <td class="text-end text-primary">{{ formatNumber(totalAssets) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Liabilities & Equity Side -->
            <div class="col-md-6">
              <div class="p-3 border rounded bg-white">
                <table class="table align-middle mb-0">
                  <thead>
                    <tr class="table-light">
                      <th class="fw-bold">LIABILITIES & EQUITY</th>
                      <th class="text-end fw-bold">Credit (IDR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="table-secondary fw-semibold">
                      <td colspan="2">Current Liabilities</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Accounts Payable (Owed to suppliers)</td>
                      <td class="text-end">{{ formatNumber(liabilities.payables) }}</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Accrued Expenses (Unpaid utilities/wages)</td>
                      <td class="text-end">{{ formatNumber(liabilities.accrued) }}</td>
                    </tr>
                    <tr class="fw-bold table-light">
                      <td>Total Liabilities</td>
                      <td class="text-end text-danger">{{ formatNumber(totalLiabilities) }}</td>
                    </tr>
                    <tr class="table-secondary fw-semibold">
                      <td colspan="2">Equity</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Owner's Capital</td>
                      <td class="text-end">{{ formatNumber(equity.capital) }}</td>
                    </tr>
                    <tr>
                      <td class="ps-4">Retained Earnings</td>
                      <td class="text-end">{{ formatNumber(equity.retainedEarnings) }}</td>
                    </tr>
                    <tr class="fw-bold table-light">
                      <td>Total Equity</td>
                      <td class="text-end text-success">{{ formatNumber(totalEquity) }}</td>
                    </tr>
                    <tr class="fw-bold table-primary fs-6">
                      <td>TOTAL LIABILITIES & EQUITY</td>
                      <td class="text-end text-primary">{{ formatNumber(totalLiabilitiesAndEquity) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const asOfDate = ref(new Date().toISOString().slice(0, 10));

const assets = ref({
  cashAndBank: 15000000,
  receivables: 5000000,
  inventory: 8000000,
  machinery: 45000000,
  depreciation: 9000000,
});

const liabilities = ref({
  payables: 4000000,
  accrued: 2000000,
});

const equity = ref({
  capital: 40000000,
  retainedEarnings: 18000000,
});

const totalCurrentAssets = computed(() => assets.value.cashAndBank + assets.value.receivables + assets.value.inventory);
const totalFixedAssets = computed(() => assets.value.machinery - assets.value.depreciation);
const totalAssets = computed(() => totalCurrentAssets.value + totalFixedAssets.value);

const totalLiabilities = computed(() => liabilities.value.payables + liabilities.value.accrued);
const totalEquity = computed(() => equity.value.capital + equity.value.retainedEarnings);
const totalLiabilitiesAndEquity = computed(() => totalLiabilities.value + totalEquity.value);

const printSheet = () => {
  window.print();
};

const toggleHeader = () => {
  // toggle
};
</script>
