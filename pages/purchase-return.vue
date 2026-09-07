<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Return List</h4>
          <h6>Manage your Returns</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printList">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printList">
            <i class="feather-printer"></i>
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
          <i class="feather-plus-circle me-2"></i>Add Purchase Return
        </a>
      </div>
    </div>

    <!-- Purchase Return Table Card -->
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
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Refunded'">Refunded</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Pending'">Pending</a></li>
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
                <th>No PR</th>
                <th>Date</th>
                <th>Created</th>
                <th>No Purchase</th>
                <th>Supplier</th>
                <th>Amount (IDR)</th>
                <th>Paid (IDR)</th>
                <th>Due (IDR)</th>
                <th>Status</th>
                <th>Status By</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredReturns" :key="item.id">
                <td class="fw-bold">{{ item.noPR }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.created }}</td>
                <td>{{ item.noPurchase }}</td>
                <td>{{ item.supplier }}</td>
                <td class="fw-semibold">{{ formatNumber(item.amount) }}</td>
                <td class="text-success">{{ formatNumber(item.paid) }}</td>
                <td :class="item.due > 0 ? 'text-danger' : 'text-muted'">{{ formatNumber(item.due) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-success': item.status === 'Refunded',
                      'bg-outline-warning': item.status === 'Pending',
                      'bg-outline-danger': item.status === 'Cancel',
                    }"
                  >
                    {{ item.status || "-" }}
                  </span>
                </td>
                <td>{{ item.statusBy || "-" }}</td>
                <td class="action-table-data">
                  <div class="edit-delete-action d-flex align-items-center gap-1">
                    <NuxtLink class="p-2 text-primary" to="/purchase-return-detail" title="View Detail">
                      <i class="feather-eye"></i>
                    </NuxtLink>
                    <a class="p-2 text-info cursor-pointer" @click.prevent="openEditModal(item)" title="Edit">
                      <i class="feather-edit"></i>
                    </a>
                    <a class="p-2 text-danger cursor-pointer" @click.prevent="deleteReturn(item)" title="Delete">
                      <i class="feather-trash-2"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredReturns.length === 0">
                <td colspan="11" class="text-center py-4 text-muted">No purchase returns found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Purchase Return Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">{{ isEdit ? "Edit Purchase Return" : "Add Purchase Return" }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveReturn">
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
                  <label class="form-label small fw-bold">No Purchase Return</label>
                  <input type="text" class="form-control form-control-sm" v-model="formData.noPR" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">No Purchase Order / Ref</label>
                  <input type="text" class="form-control form-control-sm" v-model="formData.noPurchase" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small fw-bold">Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="formData.date" />
                </div>
              </div>

              <!-- Return Items Table -->
              <h5 class="fw-bold mb-3">Return Items</h5>
              <div class="table-responsive mb-3">
                <table class="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th style="width: 80px" class="text-center">Qty</th>
                      <th style="width: 120px" class="text-center">Qty Return</th>
                      <th style="width: 80px" class="text-center">Unit</th>
                      <th style="width: 140px" class="text-end">Price</th>
                      <th style="width: 140px" class="text-end">Amount</th>
                      <th style="width: 220px">Description of return</th>
                      <th style="width: 40px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in returnItems" :key="idx">
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="item.name" />
                      </td>
                      <td class="text-center">{{ item.qty }}</td>
                      <td>
                        <input
                          type="number"
                          class="form-control form-control-sm text-center"
                          v-model.number="item.qtyReturn"
                          min="1"
                        />
                      </td>
                      <td class="text-center">{{ item.unit }}</td>
                      <td>
                        <input type="number" class="form-control form-control-sm text-end" v-model.number="item.price" />
                      </td>
                      <td class="text-end fw-bold">
                        {{ formatNumber(item.qtyReturn * item.price) }}
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="item.reason" placeholder="Reason..." />
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
                <i class="feather-plus-circle me-1"></i> Add Return Item
              </button>

              <!-- Bank & Totals -->
              <div class="row mt-3">
                <div class="col-sm-7">
                  <p class="small mb-1"><strong>Refund To Bank</strong> : Bank BCA PT Dulank Semesta Cida - 1091956271</p>
                  <div class="mb-3 col-md-6">
                    <label class="form-label small fw-bold">Payment Return Status</label>
                    <select class="form-select form-select-sm" v-model="formData.status">
                      <option>Refunded</option>
                      <option>Pending</option>
                      <option>Cancel</option>
                    </select>
                  </div>
                </div>
                <div class="col-sm-5">
                  <div class="float-end" style="min-width: 240px">
                    <div class="d-flex justify-content-between fw-bold">
                      <div>Sub Total</div>
                      <div>Rp. {{ formatNumber(subTotal) }}</div>
                    </div>
                    <div class="d-flex justify-content-between fw-bold mt-2">
                      <div>Tax (PPN 11%)</div>
                      <div>0</div>
                    </div>
                    <div class="d-flex justify-content-between fw-bold mt-2 pt-2 border-top text-primary fs-5">
                      <div>Total</div>
                      <div>Rp. {{ formatNumber(subTotal) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top gap-2 mt-4">
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

// Sample Purchase Return Data
const returns = ref([
  {
    id: 1,
    noPR: "PRT-0011",
    date: "17/10/2025",
    created: "Sales Staff",
    noPurchase: "PUR000003",
    supplier: "Global Inkindo",
    amount: 850000,
    paid: 0,
    due: 850000,
    status: "Pending",
    statusBy: "Admin",
  },
  {
    id: 2,
    noPR: "PRT-0012",
    date: "21/10/2025",
    created: "Sales Staff",
    noPurchase: "PUR000005",
    supplier: "Indo Material",
    amount: 1950000,
    paid: 1950000,
    due: 0,
    status: "Refunded",
    statusBy: "Admin",
  },
  {
    id: 3,
    noPR: "PRT-0013",
    date: "25/10/2025",
    created: "Sales Staff",
    noPurchase: "PUR000008",
    supplier: "PT Kertas Jaya",
    amount: 600000,
    paid: 600000,
    due: 0,
    status: "Refunded",
    statusBy: "Admin",
  },
]);

// Filter & Search
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

const filteredReturns = computed(() => {
  return returns.value.filter((r) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q || r.noPR.toLowerCase().includes(q) || r.noPurchase.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || r.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

// Modal Form State
const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});
const returnItems = ref<any[]>([]);

const subTotal = computed(() => {
  return returnItems.value.reduce((acc, item) => acc + (item.qtyReturn || 0) * (item.price || 0), 0);
});

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    noPR: `PRT-00${String(returns.value.length + 11).padStart(2, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    created: "Sales Staff",
    noPurchase: "PUR000001",
    supplier: "PT Cipta Kreasi",
    status: "Pending",
    statusBy: "Admin",
    paid: 0,
    due: 0,
  };
  returnItems.value = [
    { name: "Tinta Cemani Cyan 1 Kg", qty: 2, qtyReturn: 2, unit: "Kg", price: 450000, reason: "Sudah Expired" },
  ];
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  returnItems.value = [
    { name: "Tinta Cemani Cyan 1 Kg", qty: 2, qtyReturn: 2, unit: "Kg", price: 450000, reason: "Sudah Expired" },
    { name: "Kertas Art Paper 150gr", qty: 1, qtyReturn: 1, unit: "Ream", price: 600000, reason: "Salah Ukuran" },
  ];
  showModal.value = true;
};

const addItem = () => {
  returnItems.value.push({ name: "", qty: 1, qtyReturn: 1, unit: "Pcs", price: 0, reason: "" });
};

const removeItem = (idx: number) => {
  returnItems.value.splice(idx, 1);
};

const saveReturn = () => {
  const total = subTotal.value;
  if (isEdit.value) {
    const idx = returns.value.findIndex((r) => r.id === formData.value.id);
    if (idx !== -1) {
      returns.value[idx] = {
        ...formData.value,
        amount: total,
        due: formData.value.status === "Refunded" ? 0 : total,
        paid: formData.value.status === "Refunded" ? total : 0,
      };
    }
  } else {
    returns.value.unshift({
      id: Date.now(),
      ...formData.value,
      amount: total,
      due: formData.value.status === "Refunded" ? 0 : total,
      paid: formData.value.status === "Refunded" ? total : 0,
    });
  }
  showModal.value = false;
};

const deleteReturn = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.noPR}?`)) {
    returns.value = returns.value.filter((r) => r.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const toggleHeader = () => {
  // header toggle
};
</script>
