<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Supplier Report</h4>
          <h6>Manage supplier purchasing transactions and order history</h6>
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
            <span><img src="/assets/img/icons/purchased-earnings.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase Amount</h6>
            <h5>
              Rp <span>{{ formatNumber(totalPurchaseAmount) }}</span>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash2.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase (Paid)</h6>
            <h5>
              Rp <span>{{ formatNumber(totalPaid) }}</span>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash2 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash3.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Purchase Due</h6>
            <h5>
              Rp <span>{{ formatNumber(totalDue) }}</span>
            </h5>
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
            <h5>Rp <span>1.800.000</span></h5>
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
                placeholder="Search purchase item or category..."
                class="form-control form-control-sm"
              />
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Purchase Item</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Amount (IDR)</th>
                <th class="text-center no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredRows" :key="item.id">
                <td>{{ item.date }}</td>
                <td>{{ item.category }}</td>
                <td class="fw-semibold">{{ item.item }}</td>
                <td class="text-center">{{ item.qty }}</td>
                <td class="text-end fw-bold text-success">{{ formatNumber(item.amount) }}</td>
                <td class="action-table-data text-center">
                  <div class="edit-delete-action justify-content-center">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewItem(item)" title="View Details">
                      <i class="feather-eye"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">No records found.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold table-light">
                <td colspan="3">Total</td>
                <td class="text-center">{{ totalQty }}</td>
                <td class="text-end text-primary">{{ formatNumber(totalPurchaseAmount) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Purchase Item Details</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="activeItem">
            <p><strong>Item:</strong> {{ activeItem.item }}</p>
            <p><strong>Category:</strong> {{ activeItem.category }}</p>
            <p><strong>Date:</strong> {{ activeItem.date }}</p>
            <p><strong>Quantity:</strong> {{ activeItem.qty }}</p>
            <p><strong>Amount:</strong> Rp {{ formatNumber(activeItem.amount) }}</p>
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
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const rows = ref([
  { id: 1, date: "02/03/2026", category: "Kertas Plano", item: "Art Paper 120gr (65x100)", qty: 20, amount: 4400000 },
  { id: 2, date: "03/03/2026", category: "Tinta & Kimia", item: "Tinta Black Offset (1kg)", qty: 10, amount: 2500000 },
  { id: 3, date: "04/03/2026", category: "Bahan Large Format", item: "Vinyl Ritrama Glossy 1.26m", qty: 5, amount: 3750000 },
  { id: 4, date: "04/03/2026", category: "Finishing & Jilid", item: 'Kawat Spiral (Spool) 1/4"', qty: 2, amount: 1800000 },
  { id: 5, date: "05/03/2026", category: "Kertas Digital", item: "Art Carton 260gr A3+", qty: 50, amount: 6250000 },
  { id: 6, date: "06/03/2026", category: "Sparepart & Maintenance", item: "Roller Karet Mesin SM52", qty: 4, amount: 3200000 },
  { id: 7, date: "07/03/2026", category: "Bahan Penunjang", item: "Plat CTP (Thermal)", qty: 100, amount: 4500000 },
]);

const searchQuery = ref("");

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const q = searchQuery.value.toLowerCase();
    return !q || r.item.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  });
});

const totalQty = computed(() => filteredRows.value.reduce((acc, r) => acc + r.qty, 0));
const totalPurchaseAmount = computed(() => filteredRows.value.reduce((acc, r) => acc + r.amount, 0));
const totalPaid = computed(() => totalPurchaseAmount.value * 0.85);
const totalDue = computed(() => totalPurchaseAmount.value * 0.15);

const showModal = ref(false);
const activeItem = ref<any>(null);

const viewItem = (item: any) => {
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
