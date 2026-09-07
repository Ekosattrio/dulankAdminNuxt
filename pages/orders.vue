<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Orders List</h4>
            <h6>Manage sales orders, execution workflows, and fulfillment tracking</h6>
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
      </div>

      <!-- KPI Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
              <i class="ti ti-shopping-cart fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Orders</div>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-info bg-opacity-10 text-info rounded-3">
              <i class="ti ti-users fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Customers</div>
              <h4 class="mb-0 fw-bold">4,385</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-success bg-opacity-10 text-success rounded-3">
              <i class="ti ti-circle-check fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Complete</div>
              <h4 class="mb-0 fw-bold">3,000</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-danger bg-opacity-10 text-danger rounded-3">
              <i class="ti ti-circle-x fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Cancel</div>
              <h4 class="mb-0 fw-bold">1,385</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search order number or customer..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterShipping" class="form-select form-select-sm" style="width: auto">
                <option value="">All Shipping</option>
                <option value="Pickup">Pickup</option>
                <option value="Courier">Courier</option>
                <option value="Express">Express</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">All Statuses</option>
                <option value="Complete">Complete</option>
                <option value="Processing">Processing</option>
                <option value="Waiting">Waiting</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>
          </div>

          <div class="table-responsive mb-4">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No Order</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Order Status</th>
                  <th>Status By</th>
                  <th>Sales Channel</th>
                  <th>Shipping</th>
                  <th class="text-center" style="width: 250px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td class="fw-bold text-primary">{{ order.orderNo }}</td>
                  <td class="fw-semibold text-dark">{{ order.customer }}</td>
                  <td>{{ order.date }}</td>
                  <td>
                    <span :class="getStatusClass(order.status)">{{ order.status }}</span>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ order.statusBy }}</span>
                  </td>
                  <td>{{ order.salesChannel }}</td>
                  <td>
                    <span class="badge bg-secondary bg-opacity-10 text-secondary border">{{ order.shipping }}</span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="d-inline-flex gap-1 flex-wrap justify-content-center">
                      <NuxtLink to="/job-order-detail" class="btn btn-sm btn-info text-white py-0 px-2" style="font-size: 11px">
                        Detail
                      </NuxtLink>
                      <button
                        type="button"
                        class="btn btn-sm btn-success text-white py-0 px-2"
                        style="font-size: 11px"
                        @click="openStatusModal(order)"
                      >
                        Status
                      </button>
                      <NuxtLink
                        to="/edit-job-order"
                        class="btn btn-sm btn-secondary text-white py-0 px-2"
                        style="font-size: 11px"
                      >
                        Add Job Order
                      </NuxtLink>
                      <NuxtLink to="/edit-job-order" class="btn btn-sm btn-warning text-white py-0 px-2" style="font-size: 11px">
                        Edit Job Order
                      </NuxtLink>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredOrders.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">No orders match the selected filters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="statusModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Update Order Status: {{ selectedOrder?.orderNo }}</h5>
            <button type="button" class="btn-close" @click="statusModalVisible = false"></button>
          </div>
          <form @submit.prevent="updateStatus">
            <div class="modal-body pt-0" v-if="selectedOrder">
              <div class="mb-3">
                <label class="form-label">Order Status</label>
                <select v-model="newStatus" class="form-select">
                  <option value="Waiting">Waiting</option>
                  <option value="Processing">Processing</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Status Updated By</label>
                <input v-model="statusBy" type="text" class="form-control" />
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="statusModalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Status</button>
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
  title: "Orders List - Kacetak System",
});

interface Order {
  id: number;
  orderNo: string;
  customer: string;
  date: string;
  status: "Complete" | "Processing" | "Waiting" | "Cancel";
  statusBy: string;
  salesChannel: string;
  shipping: string;
}

const orders = ref<Order[]>([
  {
    id: 1,
    orderNo: "ORD-2510000001",
    customer: "PT Makmur Abadi",
    date: "10/09/2025",
    status: "Complete",
    statusBy: "Admin",
    salesChannel: "Quotation",
    shipping: "Courier",
  },
  {
    id: 2,
    orderNo: "ORD-2510000002",
    customer: "Toko Digital Jaya",
    date: "10/09/2025",
    status: "Processing",
    statusBy: "System",
    salesChannel: "Website",
    shipping: "Express",
  },
  {
    id: 3,
    orderNo: "ORD-2510000003",
    customer: "Klinik Sehat",
    date: "09/09/2025",
    status: "Waiting",
    statusBy: "Admin",
    salesChannel: "Quotation",
    shipping: "Pickup",
  },
  {
    id: 4,
    orderNo: "ORD-2510000004",
    customer: "Sdr. Andri",
    date: "08/09/2025",
    status: "Cancel",
    statusBy: "User",
    salesChannel: "Website",
    shipping: "Courier",
  },
]);

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
