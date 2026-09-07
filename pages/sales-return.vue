<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Sales Return List</h4>
            <h6>Manage return orders, credit notes, and customer refunds</h6>
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
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add New Sales Return
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search return no, sales no, or customer..."
                />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterPaymentStatus" class="form-select form-select-sm" style="width: auto">
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
                  <th>No Return</th>
                  <th>Date</th>
                  <th>No Sales</th>
                  <th>Customer</th>
                  <th>Payment Status</th>
                  <th>Payment Date</th>
                  <th>Payment Method</th>
                  <th class="text-end">Total</th>
                  <th class="text-center" style="width: 130px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ret in filteredReturns" :key="ret.id">
                  <td class="fw-bold text-primary">{{ ret.returnNo }}</td>
                  <td>{{ ret.date }}</td>
                  <td class="text-muted">{{ ret.salesNo }}</td>
                  <td class="fw-semibold text-dark">{{ ret.customer }}</td>
                  <td>
                    <span
                      :class="
                        ret.paymentStatus === 'Paid'
                          ? 'badge bg-success bg-opacity-10 text-success border border-success'
                          : 'badge bg-danger bg-opacity-10 text-danger border border-danger'
                      "
                    >
                      {{ ret.paymentStatus }}
                    </span>
                  </td>
                  <td>{{ ret.paymentDate || "-" }}</td>
                  <td>{{ ret.paymentMethod || "-" }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(ret.total) }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-info" title="View Details" @click="viewReturn(ret)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button
                        v-if="ret.paymentStatus === 'Unpaid'"
                        class="btn btn-sm btn-icon text-success"
                        title="Payment-OUT"
                        @click="openPaymentModal(ret)"
                      >
                        <i class="ti ti-credit-card"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(ret)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteReturn(ret.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredReturns.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No sales returns found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- View Return Details Modal (Printable) -->
    <div v-if="viewModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Return Invoice: {{ selectedReturn?.returnNo }}</h5>
            <button type="button" class="btn-close" @click="viewModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedReturn">
            <div class="row mb-4 p-3 bg-light rounded-3">
              <div class="col-sm-6">
                <div class="text-muted small">Customer</div>
                <div class="fw-bold fs-6">{{ selectedReturn.customer }}</div>
                <div class="text-muted small">Sales Reference: {{ selectedReturn.salesNo }}</div>
              </div>
              <div class="col-sm-6 text-sm-end">
                <div class="text-muted small">Return Date</div>
                <div class="fw-bold">{{ selectedReturn.date }}</div>
                <div class="text-muted small">
                  Status:
                  <span :class="selectedReturn.paymentStatus === 'Paid' ? 'badge bg-success' : 'badge bg-danger'">{{
                    selectedReturn.paymentStatus
                  }}</span>
                </div>
              </div>
            </div>

            <h6 class="fw-bold mb-2">Return Items Summary</h6>
            <div class="table-responsive mb-3">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Product Name</th>
                    <th class="text-center">Qty Order</th>
                    <th class="text-center">Qty Return</th>
                    <th>Unit</th>
                    <th class="text-end">Unit Price</th>
                    <th class="text-end">Return Amount</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedReturn.items" :key="item.name">
                    <td>
                      <div class="fw-bold">{{ item.name }}</div>
                      <div class="small text-muted">{{ item.description }}</div>
                    </td>
                    <td class="text-center">{{ item.qtyOrder }}</td>
                    <td class="text-center fw-bold text-danger">{{ item.qtyReturn }}</td>
                    <td>{{ item.unit }}</td>
                    <td class="text-end">Rp {{ formatNumber(item.price) }}</td>
                    <td class="text-end fw-bold">Rp {{ formatNumber(item.returnAmount) }}</td>
                    <td class="small">{{ item.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded">
              <span class="fw-bold">Total Refund Due:</span>
              <span class="fs-5 fw-bold text-primary">Rp {{ formatNumber(selectedReturn.total) }}</span>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-between">
            <button type="button" class="btn btn-outline-secondary" @click="printTable">
              <i class="ti ti-printer me-1"></i>Print Invoice
            </button>
            <button type="button" class="btn btn-secondary" @click="viewModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment-OUT Modal -->
    <div v-if="paymentModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Payment-OUT Refund: {{ selectedReturn?.returnNo }}</h5>
            <button type="button" class="btn-close" @click="paymentModalVisible = false"></button>
          </div>
          <form @submit.prevent="processPaymentOut">
            <div class="modal-body pt-0" v-if="selectedReturn">
              <div class="mb-3">
                <label class="form-label fw-bold">Payment Method</label>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input id="payCash" v-model="paymentForm.method" type="radio" value="Cash" class="form-check-input" />
                    <label for="payCash" class="form-check-label">Cash</label>
                  </div>
                  <div class="form-check">
                    <input id="payTransfer" v-model="paymentForm.method" type="radio" value="Transfer" class="form-check-input" />
                    <label for="payTransfer" class="form-check-label">Bank Transfer</label>
                  </div>
                </div>
              </div>

              <div v-if="paymentForm.method === 'Transfer'" class="p-3 bg-light rounded-3 border mb-3">
                <div class="mb-2">
                  <label class="form-label small mb-1">Customer Bank Name</label>
                  <input
                    v-model="paymentForm.bankName"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="BCA / Mandiri / BNI"
                    required
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label small mb-1">Account Number</label>
                  <input
                    v-model="paymentForm.accountNumber"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="e.g. 1234567890"
                    required
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label small mb-1">Account Holder</label>
                  <input
                    v-model="paymentForm.accountName"
                    type="text"
                    class="form-control form-control-sm"
                    :placeholder="selectedReturn.customer"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Paying Refund Amount (Rp) <span class="text-danger">*</span></label>
                <input v-model.number="paymentForm.amount" type="number" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea
                  v-model="paymentForm.notes"
                  class="form-control"
                  rows="2"
                  placeholder="Refund notes or reference..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="paymentModalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-warning">Confirm Payment-OUT</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="crudModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? "Edit Sales Return" : "Add New Sales Return" }}</h5>
            <button type="button" class="btn-close" @click="crudModalVisible = false"></button>
          </div>
          <form @submit.prevent="saveCrudReturn">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Sales Invoice No <span class="text-danger">*</span></label>
                <input v-model="crudForm.salesNo" type="text" class="form-control" placeholder="e.g. 2511000001" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Customer Name <span class="text-danger">*</span></label>
                <input v-model="crudForm.customer" type="text" class="form-control" placeholder="Customer name" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Return Date <span class="text-danger">*</span></label>
                  <input v-model="crudForm.date" type="text" class="form-control" placeholder="DD/MM/YYYY" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Total Refund (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="crudForm.total" type="number" class="form-control" min="0" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Payment Status</label>
                <select v-model="crudForm.paymentStatus" class="form-select">
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="crudModalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? "Update Return" : "Save Return" }}</button>
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
  title: "Sales Return List - Kacetak System",
});

interface ReturnItem {
  name: string;
  description: string;
  qtyOrder: number;
  qtyReturn: number;
  unit: string;
  price: number;
  returnAmount: number;
  reason: string;
}

interface SalesReturn {
  id: number;
  returnNo: string;
  date: string;
  salesNo: string;
  customer: string;
  paymentStatus: "Paid" | "Unpaid";
  paymentDate: string;
  paymentMethod: string;
  total: number;
  items: ReturnItem[];
}

const returns = ref<SalesReturn[]>([
  {
    id: 1,
    returnNo: "RTN0001",
    date: "05/10/2025",
    salesNo: "2511000001",
    customer: "PT Makmur Abadi",
    paymentStatus: "Paid",
    paymentDate: "06/10/2025",
    paymentMethod: "Cash",
    total: 900000,
    items: [
      {
        name: "Brosur PPDB SMAN 1 Bandung",
        description: "Brosur Full Color A4 Art Paper 150gr",
        qtyOrder: 2,
        qtyReturn: 1,
        unit: "Ream",
        price: 450000,
        returnAmount: 450000,
        reason: "Salah cetak gambar cover",
      },
    ],
  },
  {
    id: 2,
    returnNo: "RTN0006",
    date: "25/10/2025",
    salesNo: "2510000006",
    customer: "PT Global Solusi",
    paymentStatus: "Paid",
    paymentDate: "27/10/2025",
    paymentMethod: "Cash",
    total: 34000,
    items: [],
  },
  {
    id: 3,
    returnNo: "RTN0007",
    date: "28/10/2025",
    salesNo: "2510000007",
    customer: "Klinik Sehat",
    paymentStatus: "Paid",
    paymentDate: "30/10/2025",
    paymentMethod: "Transfer",
    total: 234000,
    items: [],
  },
  {
    id: 4,
    returnNo: "RTN0009",
    date: "04/11/2025",
    salesNo: "2509000009",
    customer: "Yayasan Lentera",
    paymentStatus: "Unpaid",
    paymentDate: "",
    paymentMethod: "",
    total: 200000,
    items: [
      {
        name: "Stiker Vinyl Matte",
        description: "Die-cut kiss-cut 5x5 cm",
        qtyOrder: 500,
        qtyReturn: 200,
        unit: "Pcs",
        price: 1000,
        returnAmount: 200000,
        reason: "Warna pudar / laminasi terkelupas",
      },
    ],
  },
]);

const searchQuery = ref("");
const filterPaymentStatus = ref("");

const filteredReturns = computed(() => {
  return returns.value.filter((r) => {
    const matchSearch =
      r.returnNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.salesNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchPayment = filterPaymentStatus.value ? r.paymentStatus === filterPaymentStatus.value : true;
    return matchSearch && matchPayment;
  });
});

function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID").format(val);
}

// Details View Modal
const viewModalVisible = ref(false);
const selectedReturn = ref<SalesReturn | null>(null);

function viewReturn(ret: SalesReturn) {
  selectedReturn.value = ret;
  viewModalVisible.value = true;
}

// Payment-OUT Modal
const paymentModalVisible = ref(false);
const paymentForm = reactive({
  method: "Cash",
  bankName: "BCA",
  accountNumber: "",
  accountName: "",
  amount: 0,
  notes: "",
});

function openPaymentModal(ret: SalesReturn) {
  selectedReturn.value = ret;
  paymentForm.method = "Cash";
  paymentForm.amount = ret.total;
  paymentForm.bankName = "BCA";
  paymentForm.accountNumber = "";
  paymentForm.accountName = ret.customer;
  paymentForm.notes = `Refund for ${ret.returnNo}`;
  paymentModalVisible.value = true;
}

function processPaymentOut() {
  if (selectedReturn.value) {
    selectedReturn.value.paymentStatus = "Paid";
    selectedReturn.value.paymentMethod = paymentForm.method;
    selectedReturn.value.paymentDate = new Date().toLocaleDateString("en-GB");
    alert(`Payment-OUT of Rp ${formatNumber(paymentForm.amount)} processed successfully.`);
  }
  paymentModalVisible.value = false;
}

// CRUD Modal
const crudModalVisible = ref(false);
const isEditing = ref(false);
const crudForm = reactive({
  id: 0,
  salesNo: "",
  customer: "",
  date: "",
  total: 0,
  paymentStatus: "Unpaid" as "Paid" | "Unpaid",
});

function openAddModal() {
  isEditing.value = false;
  crudForm.id = 0;
  crudForm.salesNo = "";
  crudForm.customer = "";
  crudForm.date = new Date().toLocaleDateString("en-GB");
  crudForm.total = 0;
  crudForm.paymentStatus = "Unpaid";
  crudModalVisible.value = true;
}

function openEditModal(ret: SalesReturn) {
  isEditing.value = true;
  crudForm.id = ret.id;
  crudForm.salesNo = ret.salesNo;
  crudForm.customer = ret.customer;
  crudForm.date = ret.date;
  crudForm.total = ret.total;
  crudForm.paymentStatus = ret.paymentStatus;
  crudModalVisible.value = true;
}

function saveCrudReturn() {
  if (isEditing.value) {
    const idx = returns.value.findIndex((r) => r.id === crudForm.id);
    if (idx !== -1) {
      returns.value[idx].salesNo = crudForm.salesNo;
      returns.value[idx].customer = crudForm.customer;
      returns.value[idx].date = crudForm.date;
      returns.value[idx].total = crudForm.total;
      returns.value[idx].paymentStatus = crudForm.paymentStatus;
    }
  } else {
    returns.value.unshift({
      id: Date.now(),
      returnNo: "RTN" + Math.floor(1000 + Math.random() * 9000),
      salesNo: crudForm.salesNo,
      customer: crudForm.customer,
      date: crudForm.date,
      paymentStatus: crudForm.paymentStatus,
      paymentDate: crudForm.paymentStatus === "Paid" ? crudForm.date : "",
      paymentMethod: crudForm.paymentStatus === "Paid" ? "Cash" : "",
      total: crudForm.total,
      items: [],
    });
  }
  crudModalVisible.value = false;
}

function deleteReturn(id: number) {
  if (confirm("Are you sure you want to delete this return record?")) {
    returns.value = returns.value.filter((r) => r.id !== id);
  }
}

function exportPdf() {
  alert("Exporting return orders as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterPaymentStatus.value = "";
}
</script>
