<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Invoice Report</h4>
          <h6>Manage your monthly invoice collection and sales report</h6>
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

    <!-- Metric Cards -->
    <div class="row mt-4">
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/purchased-earnings.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Amount</h6>
            <h5>Rp <span>1.248.500.000</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash2.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Paid</h6>
            <h5>Rp <span>1.186.075.000</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash2 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash3.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Unpaid</h6>
            <h5>Rp <span>62.425.000</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash3 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash4.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Overdue</h6>
            <h5>Rp <span>18.500.000</span></h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search..." class="form-control form-control-sm" />
            </div>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" v-model="monthFilter">
                <option value="">All Months</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
              </select>
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
                <th class="text-center">Total Invoice</th>
                <th class="text-end">Net Sales (IDR)</th>
                <th class="text-end">Delivery Fee (IDR)</th>
                <th class="text-end">Total Tax 11% (IDR)</th>
                <th class="text-end">Total Discount (IDR)</th>
                <th class="text-end">Gross Revenue (IDR)</th>
                <th class="text-center">Collection Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredInvoices" :key="item.month + item.year">
                <td class="fw-semibold">{{ item.month }}</td>
                <td>{{ item.year }}</td>
                <td class="text-center">{{ item.totalInvoice }}</td>
                <td class="text-end">{{ formatNumber(item.netSales) }}</td>
                <td class="text-end">{{ formatNumber(item.deliveryFee) }}</td>
                <td class="text-end">{{ formatNumber(item.tax) }}</td>
                <td class="text-end text-danger">-{{ formatNumber(item.discount) }}</td>
                <td class="text-end fw-bold text-success">{{ formatNumber(item.grossRevenue) }}</td>
                <td class="text-center fw-bold">{{ item.collectionRate }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold">
                <td colspan="2">Total</td>
                <td class="text-center">{{ totalInvoices }}</td>
                <td class="text-end">{{ formatNumber(sumNetSales) }}</td>
                <td class="text-end">{{ formatNumber(sumDelivery) }}</td>
                <td class="text-end">{{ formatNumber(sumTax) }}</td>
                <td class="text-end text-danger">-{{ formatNumber(sumDiscount) }}</td>
                <td class="text-end text-primary">{{ formatNumber(sumRevenue) }}</td>
                <td class="text-center">95%</td>
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
  {
    month: "January",
    year: "2024",
    totalInvoice: 101,
    netSales: 94125132,
    deliveryFee: 2564390,
    tax: 10353764,
    discount: 3697212,
    grossRevenue: 103346074,
    collectionRate: "95%",
  },
  {
    month: "February",
    year: "2024",
    totalInvoice: 132,
    netSales: 174428760,
    deliveryFee: 3224232,
    tax: 19187163,
    discount: 4948536,
    grossRevenue: 191891619,
    collectionRate: "95%",
  },
  {
    month: "March",
    year: "2024",
    totalInvoice: 149,
    netSales: 147708915,
    deliveryFee: 5367427,
    tax: 16247980,
    discount: 5322770,
    grossRevenue: 164001552,
    collectionRate: "95%",
  },
  {
    month: "April",
    year: "2024",
    totalInvoice: 51,
    netSales: 57215829,
    deliveryFee: 2209983,
    tax: 6293741,
    discount: 573940,
    grossRevenue: 65145613,
    collectionRate: "95%",
  },
  {
    month: "May",
    year: "2024",
    totalInvoice: 82,
    netSales: 80751878,
    deliveryFee: 3261058,
    tax: 8882706,
    discount: 2502521,
    grossRevenue: 90393121,
    collectionRate: "95%",
  },
]);

const searchQuery = ref("");
const monthFilter = ref("");
const yearFilter = ref("");

const filteredInvoices = computed(() => {
  return rows.value.filter((r) => {
    const matchesSearch = !searchQuery.value || r.month.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesMonth = !monthFilter.value || r.month === monthFilter.value;
    const matchesYear = !yearFilter.value || r.year === yearFilter.value;
    return matchesSearch && matchesMonth && matchesYear;
  });
});

const totalInvoices = computed(() => filteredInvoices.value.reduce((acc, r) => acc + r.totalInvoice, 0));
const sumNetSales = computed(() => filteredInvoices.value.reduce((acc, r) => acc + r.netSales, 0));
const sumDelivery = computed(() => filteredInvoices.value.reduce((acc, r) => acc + r.deliveryFee, 0));
const sumTax = computed(() => filteredInvoices.value.reduce((acc, r) => acc + r.tax, 0));
const sumDiscount = computed(() => filteredInvoices.value.reduce((acc, r) => acc + r.discount, 0));
const sumRevenue = computed(() => filteredInvoices.value.reduce((acc, r) => acc + r.grossRevenue, 0));

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
  monthFilter.value = "";
  yearFilter.value = "";
};

const toggleHeader = () => {
  // toggle
};
</script>
