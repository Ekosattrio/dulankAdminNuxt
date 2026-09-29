<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Report</h4>
          <h6>Manage Your Purchase Report</h6>
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

    <!-- Stat Cards -->
    <div class="row mt-4">
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-package"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase Unit</h6>
            <h5><span>7.525</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-shopping-cart"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase</h6>
            <h5>Rp <span>87.802.500</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash2 w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-credit-card"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase Due</h6>
            <h5>Rp <span>12.253.000</span></h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash3 w-100">
          <div class="dash-widgetimg">
            <span><i class="feather-dollar-sign"></i></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase Amount</h6>
            <h5>Rp <span>75.549.500</span></h5>
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
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search purchase category..."
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
                <th>Purchase Category</th>
                <th>Purchase Qty</th>
                <th>Unit</th>
                <th>Total Purchase</th>
                <th>Total Purchase Due</th>
                <th>Total Purchase Amount</th>
                <th>Percentage</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRows" :key="item.category">
                <td class="fw-bold">{{ item.category }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ formatNumber(item.total) }}</td>
                <td :class="item.due > 0 ? 'text-danger' : 'text-muted'">{{ formatNumber(item.due) }}</td>
                <td class="fw-semibold text-success">{{ formatNumber(item.amount) }}</td>
                <td class="text-end fw-bold">{{ item.percentage }}%</td>
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
                <td class="fw-bold">{{ formatNumber(sumTotal) }}</td>
                <td class="fw-bold text-danger">{{ formatNumber(sumDue) }}</td>
                <td class="fw-bold text-success">{{ formatNumber(sumAmount) }}</td>
                <td class="text-end fw-bold">100%</td>
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
            <h4 class="modal-title">Purchase Details - {{ activeItem?.category }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="activeItem">
            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Item Name</th>
                  <th class="text-center">Qty</th>
                  <th class="text-end">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, idx) in activeItem.items" :key="idx">
                  <td class="fw-semibold">{{ p.name }}</td>
                  <td class="text-center">{{ p.qty }} {{ activeItem.unit }}</td>
                  <td class="text-end fw-bold">Rp {{ formatNumber(p.cost) }}</td>
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
    category: "Kertas & Bahan Baku Cetak",
    qty: 50,
    unit: "Rim",
    total: 35000000,
    due: 5000000,
    amount: 30000000,
    percentage: "39.71",
    items: [
      { name: "Art Paper 150gr Plano", qty: 30, cost: 21000000 },
      { name: "HVS 80gr Plano", qty: 20, cost: 14000000 },
    ],
  },
  {
    category: "Tinta & Toner (Ink/Toner)",
    qty: 20,
    unit: "Set",
    total: 22000000,
    due: 2000000,
    amount: 20000000,
    percentage: "26.47",
    items: [
      { name: "Tinta Offset Cyan/Magenta/Yellow/Black", qty: 15, cost: 16500000 },
      { name: "Toner Konica Minolta Cyan", qty: 5, cost: 5500000 },
    ],
  },
  {
    category: "Bahan Sticker & Vinyl",
    qty: 15,
    unit: "Roll",
    total: 16500000,
    due: 3253000,
    amount: 13247000,
    percentage: "17.53",
    items: [
      { name: "Vinyl Ritrama Glossy 1.26m", qty: 10, cost: 11000000 },
      { name: "Sticker Kromo Camel", qty: 5, cost: 5500000 },
    ],
  },
  {
    category: "Bahan Display (Banner/X-Banner)",
    qty: 100,
    unit: "Pcs",
    total: 8000000,
    due: 1000000,
    amount: 7000000,
    percentage: "9.27",
    items: [
      { name: "Stand X-Banner 60x160", qty: 60, cost: 4800000 },
      { name: "Stand Roll Banner 85x200", qty: 40, cost: 3200000 },
    ],
  },
  {
    category: "Material Finishing (Laminasi/Lem)",
    qty: 25,
    unit: "Roll",
    total: 6302500,
    due: 1000000,
    amount: 5302500,
    percentage: "7.02",
    items: [
      { name: "Plastik Laminasi Doff 32mic", qty: 15, cost: 3781500 },
      { name: "Lem Panas Jilid Buku", qty: 10, cost: 2521000 },
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

const totalQty = computed(() => filteredRows.value.reduce((acc, r) => acc + r.qty, 0));
const sumTotal = computed(() => filteredRows.value.reduce((acc, r) => acc + r.total, 0));
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
