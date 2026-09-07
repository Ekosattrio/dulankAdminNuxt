<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Subscription List</h4>
            <h6>Manage your Subscriptions</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <!-- KPI Widgets -->
      <div class="row mt-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Transactions</h6>
              <h4 class="mb-0 fw-bold">307,000</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-primary rounded-circle">
              <i class="ti ti-chart-arrows fs-24 text-primary"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div
            class="dash-widget dash1 w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-muted mb-1">Total Subscribers</h6>
              <h4 class="mb-0 fw-bold text-info">4,385</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-info rounded-circle">
              <i class="ti ti-users fs-24 text-info"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div
            class="dash-widget dash2 w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-muted mb-1">Active Subscribers</h6>
              <h4 class="mb-0 fw-bold text-success">3,000</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-success rounded-circle">
              <i class="ti ti-user-check fs-24 text-success"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div
            class="dash-widget dash3 w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-muted mb-1">Expired Subscribers</h6>
              <h4 class="mb-0 fw-bold text-danger">1,385</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-danger rounded-circle">
              <i class="ti ti-user-x fs-24 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search subscriber, plan..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterPlan" class="form-select form-select-sm" style="width: auto">
                <option value="">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Advanced">Advanced</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <select v-model="filterPayment" class="form-select form-select-sm" style="width: auto">
                <option value="">All Payments</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Paypal">Paypal</option>
                <option value="Debit Card">Debit Card</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Subscriber</th>
                  <th>Plan</th>
                  <th>Billing Cycle</th>
                  <th>Payment Method</th>
                  <th class="text-end">Amount</th>
                  <th>Created Date</th>
                  <th>Expiring On</th>
                  <th>Status</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredSubs" :key="item.id">
                  <td class="fw-semibold text-primary">{{ item.subscriber }}</td>
                  <td>{{ item.plan }}</td>
                  <td>{{ item.billingCycle }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.method }}</span>
                  </td>
                  <td class="text-end fw-semibold">{{ formatNumber(item.amount) }}</td>
                  <td>{{ item.createdDate }}</td>
                  <td>{{ item.expiringOn }}</td>
                  <td>
                    <span class="badge" :class="item.status === 'Paid' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2 text-info" href="javascript:void(0);" title="View" @click="openViewModal(item)">
                        <i class="ti ti-eye"></i>
                      </a>
                      <a class="me-2 p-2" href="javascript:void(0);" title="Edit" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredSubs.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No subscriptions found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- View Subscription Modal -->
      <div
        v-if="showViewModal && activeItem"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="page-title">
                <h4>Subscription - {{ activeItem.subscriber }}</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row g-2">
                <div class="col-6 text-muted">Plan</div>
                <div class="col-6 text-end fw-bold">{{ activeItem.plan }}</div>
                <div class="col-6 text-muted">Cycle</div>
                <div class="col-6 text-end">{{ activeItem.billingCycle }}</div>
                <div class="col-6 text-muted">Payment Method</div>
                <div class="col-6 text-end">{{ activeItem.method }}</div>
                <div class="col-6 text-muted">Amount</div>
                <div class="col-6 text-end fw-bold text-success fs-16">Rp {{ formatNumber(activeItem.amount) }}</div>
                <div class="col-6 text-muted">Created Date</div>
                <div class="col-6 text-end">{{ activeItem.createdDate }}</div>
                <div class="col-6 text-muted">Expiring On</div>
                <div class="col-6 text-end">{{ activeItem.expiringOn }}</div>
                <div class="col-6 text-muted">Status</div>
                <div class="col-6 text-end">
                  <span class="badge" :class="activeItem.status === 'Paid' ? 'bg-success' : 'bg-danger'">{{
                    activeItem.status
                  }}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useHead({
  title: "Subscriptions - Kacetak System",
});

interface SubscriptionItem {
  id: number;
  subscriber: string;
  plan: string;
  billingCycle: string;
  method: string;
  amount: number;
  createdDate: string;
  expiringOn: string;
  status: "Paid" | "Unpaid";
}

const subscriptions = ref<SubscriptionItem[]>([
  {
    id: 1,
    subscriber: "BrightWave Innovations",
    plan: "Advanced (Monthly)",
    billingCycle: "30 Days",
    method: "Credit Card",
    amount: 200000,
    createdDate: "12 Sep 2024",
    expiringOn: "11 Oct 2024",
    status: "Paid",
  },
  {
    id: 2,
    subscriber: "Quantum Nexus",
    plan: "Basic (Yearly)",
    billingCycle: "365 Days",
    method: "Paypal",
    amount: 1500000,
    createdDate: "10 Aug 2024",
    expiringOn: "10 Aug 2025",
    status: "Paid",
  },
  {
    id: 3,
    subscriber: "Apex Blue Studio",
    plan: "Enterprise (Monthly)",
    billingCycle: "30 Days",
    method: "Debit Card",
    amount: 500000,
    createdDate: "01 Jan 2025",
    expiringOn: "31 Jan 2025",
    status: "Unpaid",
  },
]);

const searchQuery = ref("");
const filterPlan = ref("");
const filterPayment = ref("");
const filterStatus = ref("");

const filteredSubs = computed(() => {
  return subscriptions.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = !q || item.subscriber.toLowerCase().includes(q) || item.plan.toLowerCase().includes(q);
    const matchPlan = !filterPlan.value || item.plan.toLowerCase().includes(filterPlan.value.toLowerCase());
    const matchPay = !filterPayment.value || item.method === filterPayment.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchPlan && matchPay && matchStatus;
  });
});

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showViewModal = ref(false);
const activeItem = ref<SubscriptionItem | null>(null);

const openViewModal = (item: SubscriptionItem) => {
  activeItem.value = item;
  showViewModal.value = true;
};

const openEditModal = (item: SubscriptionItem) => {
  const newStatus = item.status === "Paid" ? "Unpaid" : "Paid";
  item.status = newStatus;
};

const closeModal = () => {
  showViewModal.value = false;
  activeItem.value = null;
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterPlan.value = "";
  filterPayment.value = "";
  filterStatus.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
