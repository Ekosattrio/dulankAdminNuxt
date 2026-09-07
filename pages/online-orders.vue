<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Online Orders</h4>
            <h6>Manage ecommerce marketplace & webstore transactions</h6>
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
        </ul>
        <div class="page-btn">
          <NuxtLink to="/add-sales" class="btn btn-primary"> <i class="ti ti-circle-plus me-1"></i>Add Sales </NuxtLink>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search reference, customer..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">All Statuses</option>
                <option value="Complete">Complete</option>
                <option value="Pending">Pending</option>
              </select>
              <select v-model="filterPayment" class="form-select form-select-sm" style="width: auto">
                <option value="">All Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Customer</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th class="text-end">Grand Total</th>
                  <th class="text-end">Paid</th>
                  <th class="text-end">Due</th>
                  <th>Payment Status</th>
                  <th>Biller</th>
                  <th class="text-center" style="width: 80px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img
                        :src="order.avatar"
                        alt="customer"
                        class="rounded-circle"
                        style="width: 34px; height: 34px; object-fit: cover"
                      />
                      <span class="fw-bold text-dark">{{ order.customer }}</span>
                    </div>
                  </td>
                  <td class="fw-semibold text-primary">{{ order.reference }}</td>
                  <td>{{ order.date }}</td>
                  <td>
                    <span
                      :class="
                        order.status === 'Complete'
                          ? 'badge bg-success bg-opacity-10 text-success border border-success'
                          : 'badge bg-warning bg-opacity-10 text-warning border border-warning'
                      "
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(order.grandTotal) }}</td>
                  <td class="text-end text-success fw-semibold">Rp {{ formatNumber(order.paid) }}</td>
                  <td class="text-end text-danger fw-semibold">Rp {{ formatNumber(order.due) }}</td>
                  <td>
                    <span :class="order.paymentStatus === 'Paid' ? 'badge bg-success' : 'badge bg-danger'">
                      {{ order.paymentStatus }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ order.biller }}</span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="dropdown">
                      <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown">
                        <i class="ti ti-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                        <li>
                          <button class="dropdown-item py-1 small" type="button" @click="viewDetail(order)">
                            <i class="ti ti-eye me-2 text-info"></i>Sale Detail
                          </button>
                        </li>
                        <li>
                          <button class="dropdown-item py-1 small" type="button" @click="openPayments(order)">
                            <i class="ti ti-receipt me-2 text-secondary"></i>Show Payments
                          </button>
                        </li>
                        <li v-if="order.due > 0">
                          <button class="dropdown-item py-1 small" type="button" @click="openCreatePayment(order)">
                            <i class="ti ti-credit-card me-2 text-success"></i>Create Payment
                          </button>
                        </li>
                        <li>
                          <NuxtLink :to="'/sales-receipt?id=' + order.reference" class="dropdown-item py-1 small">
                            <i class="ti ti-printer me-2 text-primary"></i>Print Receipt
                          </NuxtLink>
                        </li>
                        <li>
                          <hr class="dropdown-divider" />
                        </li>
                        <li>
                          <button class="dropdown-item py-1 small text-danger" type="button" @click="deleteOrder(order.id)">
                            <i class="ti ti-trash me-2"></i>Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredOrders.length === 0">
                  <td colspan="10" class="text-center py-4 text-muted">No online orders found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Sale Detail Modal -->
    <div v-if="detailModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Online Order: {{ selectedOrder?.reference }}</h5>
            <button type="button" class="btn-close" @click="detailModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedOrder">
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Customer</span>
                <span class="fw-bold">{{ selectedOrder.customer }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Order Date</span>
                <span>{{ selectedOrder.date }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Status</span>
                <span :class="selectedOrder.status === 'Complete' ? 'badge bg-success' : 'badge bg-warning'">{{
                  selectedOrder.status
                }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Grand Total</span>
                <span class="fw-bold fs-6">Rp {{ formatNumber(selectedOrder.grandTotal) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Paid</span>
                <span class="text-success fw-bold">Rp {{ formatNumber(selectedOrder.paid) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Balance Due</span>
                <span class="text-danger fw-bold">Rp {{ formatNumber(selectedOrder.due) }}</span>
              </li>
            </ul>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="detailModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Payment Modal -->
    <div v-if="createPaymentVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Create Payment: {{ selectedOrder?.reference }}</h5>
            <button type="button" class="btn-close" @click="createPaymentVisible = false"></button>
          </div>
          <form @submit.prevent="submitPayment">
            <div class="modal-body pt-0" v-if="selectedOrder">
              <div class="mb-3">
                <label class="form-label">Paying Amount (Rp) <span class="text-danger">*</span></label>
                <input v-model.number="payingAmount" type="number" class="form-control" :max="selectedOrder.due" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Payment Gateway</label>
                <select v-model="paymentType" class="form-select">
                  <option value="Midtrans">Midtrans Virtual Account</option>
                  <option value="Xendit">Xendit QRIS</option>
                  <option value="CreditCard">Credit Card</option>
                  <option value="Transfer">Direct Bank Transfer</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="createPaymentVisible = false">Cancel</button>
              <button type="submit" class="btn btn-success">Confirm Payment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Online Orders - Kacetak System",
});

interface OnlineOrder {
  id: number;
  customer: string;
  avatar: string;
  reference: string;
  date: string;
  status: "Complete" | "Pending";
  grandTotal: number;
  paid: number;
  due: number;
  paymentStatus: "Paid" | "Unpaid";
  biller: string;
}

const orders = ref<OnlineOrder[]>([
  {
    id: 1,
    customer: "Joko Widodo",
    avatar: "/assets/img/customer/customer1.jpg",
    reference: "ONL001",
    date: "24 Dec 2024",
    status: "Complete",
    grandTotal: 450000,
    paid: 450000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Webstore",
  },
  {
    id: 2,
    customer: "Carl Evans",
    avatar: "/assets/img/customer/customer2.jpg",
    reference: "ONL002",
    date: "23 Dec 2024",
    status: "Pending",
    grandTotal: 1250000,
    paid: 500000,
    due: 750000,
    paymentStatus: "Unpaid",
    biller: "Marketplace",
  },
  {
    id: 3,
    customer: "Minerva Davis",
    avatar: "/assets/img/customer/customer3.jpg",
    reference: "ONL003",
    date: "22 Dec 2024",
    status: "Complete",
    grandTotal: 890000,
    paid: 890000,
    due: 0,
    paymentStatus: "Paid",
    biller: "Webstore",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("");
const filterPayment = ref("");

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.reference.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.biller.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = filterStatus.value ? o.status === filterStatus.value : true;
    const matchPay = filterPayment.value ? o.paymentStatus === filterPayment.value : true;
    return matchSearch && matchStatus && matchPay;
  });
});

function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID").format(val);
}

const detailModalVisible = ref(false);
const createPaymentVisible = ref(false);
const selectedOrder = ref<OnlineOrder | null>(null);
const payingAmount = ref(0);
const paymentType = ref("Midtrans");

function viewDetail(order: OnlineOrder) {
  selectedOrder.value = order;
  detailModalVisible.value = true;
}

function openPayments(order: OnlineOrder) {
  alert(`Payment records for ${order.reference}: Total Paid Rp ${formatNumber(order.paid)}`);
}

function openCreatePayment(order: OnlineOrder) {
  selectedOrder.value = order;
  payingAmount.value = order.due;
  createPaymentVisible.value = true;
}

function submitPayment() {
  if (selectedOrder.value) {
    selectedOrder.value.paid += payingAmount.value;
    selectedOrder.value.due = Math.max(0, selectedOrder.value.due - payingAmount.value);
    if (selectedOrder.value.due === 0) {
      selectedOrder.value.paymentStatus = "Paid";
      selectedOrder.value.status = "Complete";
    }
    alert(`Payment recorded successfully!`);
  }
  createPaymentVisible.value = false;
}

function deleteOrder(id: number) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders.value = orders.value.filter((o) => o.id !== id);
  }
}

function exportPdf() {
  alert("Exporting online orders as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
  filterPayment.value = "";
}
</script>
