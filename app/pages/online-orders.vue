<template>
<<<<<<< HEAD
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Online Orders" subtitle="Manage online store orders and web payments">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <NuxtLink
            to="/add-sales"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Sales</span>
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search reference, customer..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Complete', label: 'Complete' },
              { value: 'Pending', label: 'Pending' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterPayment"
            allLabel="All Payment Status"
            :options="[
              { value: 'Paid', label: 'Paid' },
              { value: 'Unpaid', label: 'Unpaid' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Reference</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Grand Total</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Paid</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Due</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Payment Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Biller</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="order in filteredOrders" :key="order.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <img :src="order.avatar" alt="customer" class="h-8 w-8 rounded-full object-cover" />
                  <span class="font-bold text-gray-900 dark:text-gray-100">{{ order.customer }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-primary">{{ order.reference }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ order.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="order.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(order.grandTotal) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(order.paid) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold text-rose-600 dark:text-rose-400">Rp {{ formatNumber(order.due) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="order.paymentStatus" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ order.biller }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                    title="Sale Detail"
                    @click="viewDetail(order)"
                  >
                    <CommonFeatherIcon name="eye" size="15" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                    title="Show Payments"
                    @click="openPayments(order)"
                  >
                    <CommonFeatherIcon name="receipt" size="15" />
                  </button>
                  <button
                    v-if="order.due > 0"
                    type="button"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-800"
                    title="Create Payment"
                    @click="openCreatePayment(order)"
                  >
                    <CommonFeatherIcon name="credit-card" size="15" />
                  </button>
                  <NuxtLink
                    :to="'/sales-receipt?id=' + order.reference"
                    title="Print Receipt"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                  >
                    <CommonFeatherIcon name="printer" size="15" />
                  </NuxtLink>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
                    title="Delete"
                    @click="deleteOrder(order.id)"
                  >
                    <CommonFeatherIcon name="trash-2" size="15" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="10" class="p-8 text-center text-gray-400">No online orders found.</td>
            </tr>
          </tbody>
        </table>
=======
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
      <p v-if="feedbackMessage" role="status" class="alert alert-success py-2">{{ feedbackMessage }}</p>

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
>>>>>>> origin/eko
      </div>
    </div>

    <!-- Sale Detail Modal -->
<<<<<<< HEAD
    <CommonBaseModal v-model="detailModalVisible" :title="`Online Order: ${selectedOrder?.reference ?? ''}`" maxWidth="md">
      <div v-if="selectedOrder" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Customer</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ selectedOrder.customer }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Order Date</span>
          <span class="text-gray-800 dark:text-gray-200">{{ selectedOrder.date }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Status</span>
          <CommonStatusPill :status="selectedOrder.status" />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Grand Total</span>
          <span class="text-base font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(selectedOrder.grandTotal) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Paid</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(selectedOrder.paid) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Balance Due</span>
          <span class="font-bold text-rose-600 dark:text-rose-400">Rp {{ formatNumber(selectedOrder.due) }}</span>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="detailModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Create Payment Modal -->
    <CommonBaseModal v-model="createPaymentVisible" :title="`Create Payment: ${selectedOrder?.reference ?? ''}`" maxWidth="md">
      <form v-if="selectedOrder" @submit.prevent="submitPayment" class="space-y-4">
        <CommonFormField label="Paying Amount (Rp)" required>
          <input
            v-model.number="payingAmount"
            type="number"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            :max="selectedOrder.due"
            required
          />
        </CommonFormField>
        <CommonFormField label="Payment Gateway">
          <select
            v-model="paymentType"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Midtrans">Midtrans Virtual Account</option>
            <option value="Xendit">Xendit QRIS</option>
            <option value="CreditCard">Credit Card</option>
            <option value="Transfer">Direct Bank Transfer</option>
          </select>
        </CommonFormField>
        <CommonModalFooter submitLabel="Confirm Payment" @cancel="createPaymentVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: "default",
});

useHead({
  title: "Online Orders - Kacetak System",
});

const { data: onlineOrdersData } = await useFetch<OnlineOrder[]>('/api/online-orders')
const orders = ref<OnlineOrder[]>(onlineOrdersData.value ?? [])
useMockSync('online-orders', orders);
=======
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
    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Online Order"
      message="Are you sure you want to delete this order? This action cannot be undone."
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />
    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      title="Online Orders"
      :columns="printColumns"
      :items="filteredOrders"
      :default-action="print.defaultPrintAction.value"
      :show-date-range="false"
      @close="print.closePrintModal"
    />
  </div>
</template>

<script setup lang="ts">
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue';

definePageMeta({
  layout: "default",
});

useLegacyPage({
  title: 'Online Orders',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
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
>>>>>>> origin/eko

const searchQuery = ref("");
const filterStatus = ref("");
const filterPayment = ref("");
<<<<<<< HEAD
=======
const feedbackMessage = ref("");
const print = useTablePrint();
const printColumns = [
  { key: "reference", label: "Reference" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "grandTotal", label: "Grand Total", align: "right" as const },
  { key: "paid", label: "Paid", align: "right" as const },
  { key: "due", label: "Due", align: "right" as const },
  { key: "paymentStatus", label: "Payment Status" },
];
>>>>>>> origin/eko

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
<<<<<<< HEAD
  alert(`Payment records for ${order.reference}: Total Paid Rp ${formatNumber(order.paid)}`);
=======
  selectedOrder.value = order;
  detailModalVisible.value = true;
>>>>>>> origin/eko
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
<<<<<<< HEAD
    alert(`Payment recorded successfully!`);
=======
    feedbackMessage.value = `Payment for ${selectedOrder.value.reference} recorded successfully.`;
>>>>>>> origin/eko
  }
  createPaymentVisible.value = false;
}

<<<<<<< HEAD
function deleteOrder(id: number) {
  if (confirm("Are you sure you want to delete this order?")) {
    orders.value = orders.value.filter((o) => o.id !== id);
=======
const isDeleteConfirmOpen = ref(false);
const deleteTargetId = ref<number | null>(null);

function deleteOrder(id: number) {
  deleteTargetId.value = id;
  isDeleteConfirmOpen.value = true;
}

function confirmDelete() {
  if (deleteTargetId.value !== null) {
    orders.value = orders.value.filter((o) => o.id !== deleteTargetId.value);
    isDeleteConfirmOpen.value = false;
    deleteTargetId.value = null;
>>>>>>> origin/eko
  }
}

function exportPdf() {
<<<<<<< HEAD
  alert("Exporting online orders as PDF...");
}

function printTable() {
  window.print();
=======
  print.openPrintModal("pdf");
}

function printTable() {
  print.openPrintModal("print");
>>>>>>> origin/eko
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
  filterPayment.value = "";
}
<<<<<<< HEAD
</script>
=======
</script>
>>>>>>> origin/eko
