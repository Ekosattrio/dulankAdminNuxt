<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Sales Report</h4>
          <h6>Manage Your Sales Report</h6>
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

    <!-- Metric Cards Row 1 -->
    <div class="row mt-4">
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash1.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Sold Unit</h6>
            <h5><span>307.144</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash2.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Sales</h6>
            <h5>Rp <span>481.002.000</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash2 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash3.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Sales Due</h6>
            <h5>Rp <span>38.565.000</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash3 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash4.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Sales Amount</h6>
            <h5>Rp <span>442.437.000</span></h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Metric Cards Row 2 (Channel breakdown) -->
    <div class="row">
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-shopping-bag"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Point of Sales</h6>
            <h5>Rp <span>215.250.500</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-globe"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Website</h6>
            <h5>Rp <span>52.250.500</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash2 w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-file-text"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Quotation</h6>
            <h5>Rp <span>75.250.500</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash3 w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-users"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Sales Staff</h6>
            <h5>Rp <span>138.250.500</span></h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Table Card -->
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
                <th>Product Category</th>
                <th>Sold Qty</th>
                <th>Unit</th>
                <th>Total Sales</th>
                <th>Total Sales Due</th>
                <th>Total Sales Amount</th>
                <th>Percentage</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRows" :key="item.category">
                <td class="fw-bold">{{ item.category }}</td>
                <td>{{ item.soldQty }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ formatNumber(item.totalSales) }}</td>
                <td :class="item.due > 0 ? 'text-danger' : 'text-muted'">{{ formatNumber(item.due) }}</td>
                <td class="fw-semibold text-success">{{ formatNumber(item.amount) }}</td>
                <td class="fw-bold">{{ item.percentage }}%</td>
                <td class="action-table-data">
                  <div class="edit-delete-action">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewDetail(item)" title="View Detail">
                      <i class="feather-eye"></i>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="fw-bold">Total</td>
                <td class="fw-bold">{{ totalQty }}</td>
                <td></td>
                <td class="fw-bold">{{ formatNumber(sumSales) }}</td>
                <td class="fw-bold text-danger">{{ formatNumber(sumDue) }}</td>
                <td class="fw-bold text-success">{{ formatNumber(sumAmount) }}</td>
                <td class="fw-bold">100%</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Sales Category Breakdown - {{ activeItem?.category }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="activeItem">
            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Product</th>
                  <th class="text-center">Sold Qty</th>
                  <th class="text-end">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, idx) in activeItem.products" :key="idx">
                  <td class="fw-semibold">{{ p.name }}</td>
                  <td class="text-center">{{ p.qty }} {{ activeItem.unit }}</td>
                  <td class="text-end fw-bold">Rp {{ formatNumber(p.revenue) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="modal-footer p-0 pt-3 border-top justify-content-end">
              <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
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

const rows = ref([
  {
    category: "Cetak Offset",
    soldQty: 10500,
    unit: "Lembar",
    totalSales: 130000000,
    due: 15000000,
    amount: 115000000,
    percentage: "27.02",
    products: [
      { name: "Brosur Full Color A4", qty: 6500, revenue: 65000000 },
      { name: "Buku Agenda Custom", qty: 4000, revenue: 50000000 },
    ],
  },
  {
    category: "Digital Print A3+",
    soldQty: 15400,
    unit: "Lembar",
    totalSales: 110000000,
    due: 5000000,
    amount: 105000000,
    percentage: "22.87",
    products: [
      { name: "Sticker Vinyl Ritrama", qty: 8400, revenue: 58800000 },
      { name: "Poster Art Carton 260gr", qty: 7000, revenue: 46200000 },
    ],
  },
  {
    category: "Large Format / Banner",
    soldQty: 8200,
    unit: "Meter",
    totalSales: 125000000,
    due: 10000000,
    amount: 115000000,
    percentage: "25.99",
    products: [
      { name: "Banner Flexi China 280gr", qty: 5200, revenue: 65000000 },
      { name: "Banner Flexi Korea 440gr", qty: 3000, revenue: 50000000 },
    ],
  },
  {
    category: "Merchandise & Sablon",
    soldQty: 4200,
    unit: "Pcs",
    totalSales: 66000000,
    due: 4500000,
    amount: 61500000,
    percentage: "13.72",
    products: [
      { name: "Mug Custom Digital", qty: 2200, revenue: 33000000 },
      { name: "Kaos Sablon DTF", qty: 2000, revenue: 28500000 },
    ],
  },
  {
    category: "Finishing & Jilid",
    soldQty: 1200,
    unit: "Buku",
    totalSales: 50002000,
    due: 4065000,
    amount: 45937000,
    percentage: "10.40",
    products: [
      { name: "Hardcover Skripsi", qty: 700, revenue: 28000000 },
      { name: "Jilid Spiral Kawat", qty: 500, revenue: 17937000 },
    ],
  },
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

const totalQty = computed(() => filteredRows.value.reduce((acc, r) => acc + r.soldQty, 0));
const sumSales = computed(() => filteredRows.value.reduce((acc, r) => acc + r.totalSales, 0));
const sumDue = computed(() => filteredRows.value.reduce((acc, r) => acc + r.due, 0));
const sumAmount = computed(() => filteredRows.value.reduce((acc, r) => acc + r.amount, 0));

const showModal = ref(false);
const activeItem = ref<any>(null);

const viewDetail = (item: any) => {
  activeItem.value = item;
  showModal.value = true;
};

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
