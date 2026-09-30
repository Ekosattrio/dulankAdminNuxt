<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Orders List" subtitle="Manage sales orders, execution workflows, and fulfillment tracking">
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
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Orders" value="307,144" icon="shopping-cart" tone="primary" />
      <CommonStatCard label="Total Customers" value="4,385" icon="users" tone="sky" />
      <CommonStatCard label="Total Complete" value="3,000" icon="check-circle" tone="success" />
      <CommonStatCard label="Total Cancel" value="1,385" icon="x-circle" tone="danger" />
    </div>

    <!-- Table List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search order number or customer..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterShipping"
            allLabel="All Shipping"
            :options="[
              { value: 'Pickup', label: 'Pickup' },
              { value: 'Courier', label: 'Courier' },
              { value: 'Express', label: 'Express' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Complete', label: 'Complete' },
              { value: 'Processing', label: 'Processing' },
              { value: 'Waiting', label: 'Waiting' },
              { value: 'Cancel', label: 'Cancel' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">No Order</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Order Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Order Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status By</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sales Channel</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Shipping</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="order in filteredOrders" :key="order.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ order.orderNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ order.customer }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ order.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="order.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ order.statusBy }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ order.salesChannel }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ order.shipping }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex flex-wrap items-center justify-center gap-1.5">
                  <NuxtLink to="/job-order-detail" class="rounded-md bg-sky-500 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-sky-600">Detail</NuxtLink>
                  <button
                    type="button"
                    class="rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-emerald-600"
                    @click="openStatusModal(order)"
                  >
                    Status
                  </button>
                  <NuxtLink to="/edit-job-order" class="rounded-md bg-gray-500 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-gray-600">Add Job Order</NuxtLink>
                  <NuxtLink to="/edit-job-order" class="rounded-md bg-amber-500 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-amber-600">Edit Job Order</NuxtLink>
                </div>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-400">No orders match the selected filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Update Status Modal -->
    <CommonBaseModal v-model="statusModalVisible" :title="`Update Order Status: ${selectedOrder?.orderNo ?? ''}`" maxWidth="md">
      <form v-if="selectedOrder" @submit.prevent="updateStatus" class="space-y-4">
        <CommonFormField label="Order Status">
          <select
            v-model="newStatus"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Waiting">Waiting</option>
            <option value="Processing">Processing</option>
            <option value="Complete">Complete</option>
            <option value="Cancel">Cancel</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Status Updated By">
          <input
            v-model="statusBy"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </CommonFormField>
        <CommonModalFooter submitLabel="Save Status" @cancel="statusModalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: "default",
});

useHead({
  title: "Orders List - Kacetak System",
});

const { data: ordersData } = await useFetch<Order[]>('/api/orders')
const orders = ref<Order[]>(ordersData.value ?? [])
useMockSync('orders', orders);

const searchQuery = ref("");
const filterShipping = ref("");
const filterStatus = ref("");

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchSearch =
      o.orderNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchShip = filterShipping.value ? o.shipping === filterShipping.value : true;
    const matchStat = filterStatus.value ? o.status === filterStatus.value : true;
    return matchSearch && matchShip && matchStat;
  });
});

function getStatusClass(status: string) {
  if (status === "Complete") return "badge bg-success bg-opacity-10 text-success border border-success";
  if (status === "Processing") return "badge bg-info bg-opacity-10 text-info border border-info";
  if (status === "Waiting") return "badge bg-warning bg-opacity-10 text-warning border border-warning";
  return "badge bg-danger bg-opacity-10 text-danger border border-danger";
}

const statusModalVisible = ref(false);
const selectedOrder = ref<Order | null>(null);
const newStatus = ref<"Complete" | "Processing" | "Waiting" | "Cancel">("Complete");
const statusBy = ref("Admin");

function openStatusModal(order: Order) {
  selectedOrder.value = order;
  newStatus.value = order.status;
  statusBy.value = "Admin";
  statusModalVisible.value = true;
}

function updateStatus() {
  if (selectedOrder.value) {
    selectedOrder.value.status = newStatus.value;
    selectedOrder.value.statusBy = statusBy.value;
  }
  statusModalVisible.value = false;
}

function exportPdf() {
  alert("Exporting orders list as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterShipping.value = "";
  filterStatus.value = "";
}
</script>