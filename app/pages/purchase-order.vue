<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Order List</h4>
          <h6>Manage your Purchase Orders</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printList">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click.prevent="refreshList">
            <i class="feather-rotate-ccw"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
      <div class="page-btn">
        <a href="#" class="btn btn-added" @click.prevent="openAddModal">
          <i class="feather-plus-circle me-2"></i>Add Purchase Order
        </a>
      </div>
    </div>

    <!-- PO List Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <!-- Filter -->
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <!-- Search Input -->
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search..." class="form-control form-control-sm" />
            </div>
            <!-- Date Range -->
            <div class="my-2">
              <div class="pemilihrentang-container position-relative">
                <input
                  type="text"
                  class="pemilihrentang-input form-control form-control-sm cursor-pointer"
                  readonly
                  placeholder="Date"
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
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('tahunLalu')">Tahun Lalu</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer text-muted" @click="setDateRange('semua')">Semua</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filters d-flex justify-content-end gap-2">
            <div class="dropdown">
              <button
                class="btn btn-outline-primary dropdown-toggle btn-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ statusFilter || "Status" }}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = ''">All Status</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Sent'">Sent</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Draft'">Draft</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Cancel'">Cancel</a></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- /Filter -->

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>No PO</th>
                <th>Date</th>
                <th>Created</th>
                <th>No Purchase</th>
                <th>Supplier</th>
                <th>Amount (IDR)</th>
                <th>PO Status</th>
                <th>Goods Receiving Status</th>
                <th>Goods Receiving Date</th>
                <th>Goods Receiving By</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredOrders" :key="item.id">
                <td class="fw-bold">{{ item.noPO }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.created }}</td>
                <td>{{ item.noPurchase }}</td>
                <td>{{ item.supplier }}</td>
                <td class="fw-semibold">{{ formatNumber(item.amount) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-success': item.poStatus === 'Sent',
                      'bg-outline-warning': item.poStatus === 'Draft',
                      'bg-outline-danger': item.poStatus === 'Cancel',
                    }"
                  >
                    {{ item.poStatus }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-success': item.goodsStatus === 'Complete',
                      'bg-outline-warning': item.goodsStatus === 'Scheduled',
                      'bg-outline-danger': item.goodsStatus === 'Cancel',
                    }"
                  >
                    {{ item.goodsStatus }}
                  </span>
                </td>
                <td>{{ item.goodsDate || "-" }}</td>
                <td>{{ item.goodsBy || "-" }}</td>
                <td class="action-table-data">
                  <div class="edit-delete-action d-flex align-items-center gap-1">
                    <NuxtLink class="p-2 text-primary" to="/purchase-order-detail" title="View Detail">
                      <i class="feather-eye"></i>
                    </NuxtLink>
                    <a class="p-2 text-info cursor-pointer" @click.prevent="openEditModal(item)" title="Edit">
                      <i class="feather-edit"></i>
                    </a>
                    <a class="p-2 text-danger cursor-pointer" @click.prevent="deleteOrder(item)" title="Delete">
                      <i class="feather-trash-2"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="11" class="text-center py-4 text-muted">No purchase orders found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Purchase Order Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">{{ isEdit ? "Edit Purchase Order" : "Add Purchase Order" }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveOrder">
              <!-- Header Form -->
              <div class="row g-3 mb-4">
                <div class="col-md-3">
                  <label class="form-label small fw-bold">Supplier</label>
                  <select class="form-select form-select-sm" v-model="formData.supplier">
                    <option>PT Kertas Jaya</option>
                    <option>PT Cipta Kreasi</option>
                    <option>Global Inkindo</option>
                    <option>Indo Material</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">No Purchase</label>
                  <input type="text" class="form-control form-control-sm" v-model="formData.noPurchase" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">No PO</label>
                  <input type="text" class="form-control form-control-sm" v-model="formData.noPO" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="formData.date" />
                </div>
              </div>

              <!-- Line Items -->
              <h5 class="fw-bold mb-3">Order Items</h5>
              <div class="table-responsive mb-3">
                <table class="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th style="width: 40px">#</th>
                      <th>Product Name</th>
                      <th style="width: 120px" class="text-center">Qty</th>
                      <th style="width: 100px" class="text-center">Unit</th>
                      <th style="width: 140px" class="text-end">Price</th>
                      <th style="width: 140px" class="text-end">Amount</th>
                      <th style="width: 40px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(p, idx) in orderItems" :key="idx">
                      <td>{{ idx + 1 }}</td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="p.name" />
                      </td>
                      <td>
                        <input type="number" class="form-control form-control-sm text-center" v-model.number="p.qty" min="1" />
                      </td>
                      <td>
                        <select class="form-select form-select-sm" v-model="p.unit">
                          <option>Kg</option>
                          <option>Ream</option>
                          <option>Pcs</option>
                          <option>Box</option>
                        </select>
                      </td>
                      <td>
                        <input type="number" class="form-control form-control-sm text-end" v-model.number="p.price" />
                      </td>
                      <td class="text-end fw-bold">
                        {{ formatNumber(p.qty * p.price) }}
                      </td>
                      <td class="text-center">
                        <a href="javascript:void(0);" class="text-danger" @click="removeItem(idx)">
                          <i class="feather-trash-2"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button type="button" class="btn btn-outline-primary btn-sm mb-4" @click="addItem">
                <i class="feather-plus-circle me-1"></i> Add Product
              </button>

              <!-- Goods Receive Section -->
              <h5 class="fw-bold mb-3">Goods Receive</h5>
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label class="form-label small fw-bold">PO Document Status</label>
                  <select class="form-select form-select-sm" v-model="formData.poStatus">
                    <option>Sent</option>
                    <option>Draft</option>
                    <option>Cancel</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Goods Receive Status</label>
                  <select class="form-select form-select-sm" v-model="formData.goodsStatus">
                    <option>Scheduled</option>
                    <option>Complete</option>
                    <option>Cancel</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Goods Receive Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="formData.goodsDate" />
                </div>
              </div>

              <!-- Footer -->
              <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top gap-2">
                <button type="button" class="btn btn-dark" @click="showModal = false">Cancel</button>
                <button type="submit" class="btn btn-warning text-white fw-bold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

// Sample Purchase Orders
const orders = ref([
  {
    id: 1,
    noPO: "PO-000001",
    date: "05/10/2025",
    created: "Sales Staff",
    noPurchase: "PR-000001",
    supplier: "PT Kertas Jaya",
    amount: 1500000,
    poStatus: "Sent",
    goodsStatus: "Complete",
    goodsDate: "05/10/2025",
    goodsBy: "Admin",
  },
  {
    id: 2,
    noPO: "PO-000002",
    date: "08/10/2025",
    created: "Sales Staff",
    noPurchase: "PR-000003",
    supplier: "Global Inkindo",
    amount: 850000,
    poStatus: "Sent",
    goodsStatus: "Scheduled",
    goodsDate: "",
    goodsBy: "",
  },
  {
    id: 3,
    noPO: "PO-000003",
    date: "15/10/2025",
    created: "Sales Staff",
    noPurchase: "PR-000005",
    supplier: "Indo Material",
    amount: 1950000,
    poStatus: "Cancel",
    goodsStatus: "Cancel",
    goodsDate: "15/10/2025",
    goodsBy: "Admin",
  },
  {
    id: 4,
    noPO: "PO-000004",
    date: "20/10/2025",
    created: "Sales Staff",
    noPurchase: "PR-000008",
    supplier: "Global Inkindo",
    amount: 3300000,
    poStatus: "Sent",
    goodsStatus: "Complete",
    goodsDate: "21/10/2025",
    goodsBy: "Admin",
  },
]);

// Search & Filter
const searchQuery = ref("");
const statusFilter = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else if (range === "tahunLalu") selectedDateRangeLabel.value = "Tahun Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q || o.noPO.toLowerCase().includes(q) || o.noPurchase.toLowerCase().includes(q) || o.supplier.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || o.poStatus.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

// Modal Form State
const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});
const orderItems = ref<any[]>([]);

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    noPO: `PO-${String(orders.value.length + 1).padStart(6, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    created: "Sales Staff",
    noPurchase: "PR-2512000001",
    supplier: "PT Kertas Jaya",
    poStatus: "Sent",
    goodsStatus: "Scheduled",
    goodsDate: "",
    goodsBy: "Admin",
  };
  orderItems.value = [
    { name: "Tinta Neotex 1Kg Cyan", qty: 2, unit: "Kg", price: 450000 },
    { name: "Kertas Art Paper 150gr", qty: 1, unit: "Ream", price: 600000 },
  ];
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  orderItems.value = [
    { name: "Tinta Neotex 1Kg Cyan", qty: 2, unit: "Kg", price: 450000 },
    { name: "Kertas Art Paper 150gr", qty: 1, unit: "Ream", price: 600000 },
  ];
  showModal.value = true;
};

const addItem = () => {
  orderItems.value.push({ name: "", qty: 1, unit: "Pcs", price: 0 });
};

const removeItem = (idx: number) => {
  orderItems.value.splice(idx, 1);
};

const saveOrder = () => {
  const totalAmount = orderItems.value.reduce((acc, p) => acc + (p.qty || 0) * (p.price || 0), 0);
  if (isEdit.value) {
    const idx = orders.value.findIndex((o) => o.id === formData.value.id);
    if (idx !== -1) {
      orders.value[idx] = {
        ...formData.value,
        amount: totalAmount,
      };
    }
  } else {
    orders.value.unshift({
      id: Date.now(),
      ...formData.value,
      amount: totalAmount,
    });
  }
  showModal.value = false;
};

const deleteOrder = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.noPO}?`)) {
    orders.value = orders.value.filter((o) => o.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const refreshList = () => {
  searchQuery.value = "";
  statusFilter.value = "";
};

const toggleHeader = () => {
  // header toggle
};
</script>
