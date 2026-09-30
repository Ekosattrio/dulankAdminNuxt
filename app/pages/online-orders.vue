<template>
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
      </div>
    </div>

    <!-- Sale Detail Modal -->
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