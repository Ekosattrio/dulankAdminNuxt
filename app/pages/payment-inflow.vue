<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Payment Inflow</h4>
            <h6>Manage your Payment Inflow report</h6>
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
        <div class="page-btn">
          <button type="button" class="btn btn-added btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-2"></i>Add Payment Inflow
          </button>
        </div>
      </div>

      <!-- Balance Summary Card -->
      <div class="card balance-summary-card mb-4 border">
        <div class="card-body">
          <div
            class="d-flex align-items-center justify-content-between cursor-pointer"
            @click="showBalanceSummary = !showBalanceSummary"
          >
            <div class="d-flex align-items-center gap-2">
              <i class="ti ti-wallet fs-20 text-primary"></i>
              <h5 class="mb-0 fw-bold">Balance Summary (Kas & Rekening Bank)</h5>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary">
              <i class="ti" :class="showBalanceSummary ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
            </button>
          </div>
          <div v-if="showBalanceSummary" class="mt-3 pt-3 border-top">
            <div class="table-responsive">
              <table class="table table-sm balance-summary-table mb-0">
                <thead class="thead-light">
                  <tr>
                    <th>Bank Account</th>
                    <th>Account Name</th>
                    <th class="text-end">Amount Balance (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="fw-medium">Cash Box</td>
                    <td>Kasir Dulank</td>
                    <td class="text-end fw-semibold text-success">1.350.500</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Bank Mandiri</td>
                    <td>PT. Dulank Semesta Cida</td>
                    <td class="text-end fw-semibold">0</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">Bank BCA</td>
                    <td>PT. Dulank Semesta Cida</td>
                    <td class="text-end fw-semibold text-danger">-750.000</td>
                  </tr>
                  <tr>
                    <td class="fw-medium">QRIS Mandiri</td>
                    <td>Percetakan Dulank</td>
                    <td class="text-end fw-semibold text-success">250.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Inflow Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search ref no, customer name..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterSource" class="form-select form-select-sm" style="width: auto">
                <option value="">All Sources</option>
                <option value="Sales">Sales</option>
                <option value="Income">Income</option>
                <option value="Purchase Return">Purchase Return</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Date</th>
                  <th>Ref No</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th class="text-end">Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Note</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredInflows" :key="item.id">
                  <td>{{ item.date }}</td>
                  <td class="fw-semibold text-primary">{{ item.refNo }}</td>
                  <td class="fw-medium text-dark">{{ item.name }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.source }}</span>
                  </td>
                  <td class="text-end fw-semibold">{{ formatNumber(item.amount) }}</td>
                  <td>{{ item.dueDate }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="{
                        'bg-success': item.status === 'Paid',
                        'bg-warning': item.status === 'Partial',
                        'bg-danger': item.status === 'Unpaid',
                      }"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td>{{ item.method || "-" }}</td>
                  <td class="text-muted text-truncate" style="max-width: 200px">{{ item.note || "-" }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2 text-info" href="javascript:void(0);" title="View" @click="openViewModal(item)">
                        <i class="ti ti-eye"></i>
                      </a>
                      <a
                        class="me-2 p-2 text-success"
                        href="javascript:void(0);"
                        title="Make Payment"
                        @click="openPayModal(item)"
                      >
                        <i class="ti ti-currency-dollar"></i>
                      </a>
                      <a class="me-2 p-2" href="javascript:void(0);" title="Edit" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a
                        class="confirm-text p-2 align-center text-danger"
                        href="javascript:void(0);"
                        title="Delete"
                        @click="deleteItem(item.id)"
                      >
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredInflows.length === 0">
                  <td colspan="10" class="text-center py-4 text-muted">No inflow records found.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold bg-light">
                  <td colspan="4" class="text-start">Total Visible Inflows</td>
                  <td class="text-end text-success fs-15">{{ formatNumber(totalAmount) }}</td>
                  <td colspan="5"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Payment Inflow Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add Payment Inflow</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveInflow">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">Date <span class="text-danger">*</span></label>
                    <input v-model="formData.date" type="date" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Due Date</label>
                    <input v-model="formData.dueDate" type="date" class="form-control" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Customer / Entity Name <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" placeholder="Enter customer name" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Source <span class="text-danger">*</span></label>
                    <select v-model="formData.source" class="form-select" required>
                      <option value="Sales">Sales</option>
                      <option value="Income">Income</option>
                      <option value="Purchase Return">Purchase Return</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Amount (IDR) <span class="text-danger">*</span></label>
                    <input v-model.number="formData.amount" type="number" class="form-control" required min="1" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Payment Method</label>
                    <select v-model="formData.method" class="form-select">
                      <option value="Transfer">Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Balanced">Balanced</option>
                    </select>
                  </div>
                  <div v-if="formData.method === 'Transfer'" class="col-12">
                    <label class="form-label">Destination Bank Account</label>
                    <select v-model="formData.bankAccount" class="form-select">
                      <option value="Dulank Semesta Cida PT / BCA / 1092993242">Dulank Semesta Cida PT / BCA / 1092993242</option>
                      <option value="Dulank Semesta Cida PT / Mandiri / 1320009982282">
                        Dulank Semesta Cida PT / Mandiri / 1320009982282
                      </option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Note</label>
                    <textarea v-model="formData.note" class="form-control" rows="3" placeholder="Notes..."></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- View Modal -->
      <div
        v-if="showViewModal && activeItem"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Payment Inflow - {{ activeItem.refNo }}</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="row g-2">
                <div class="col-6 text-muted">Date</div>
                <div class="col-6 text-end">{{ activeItem.date }}</div>
                <div class="col-6 text-muted">Customer / Entity</div>
                <div class="col-6 text-end fw-bold">{{ activeItem.name }}</div>
                <div class="col-6 text-muted">Source</div>
                <div class="col-6 text-end">{{ activeItem.source }}</div>
                <div class="col-6 text-muted">Amount</div>
                <div class="col-6 text-end fw-bold fs-16 text-success">Rp {{ formatNumber(activeItem.amount) }}</div>
                <div class="col-6 text-muted">Due Date</div>
                <div class="col-6 text-end">{{ activeItem.dueDate }}</div>
                <div class="col-6 text-muted">Status</div>
                <div class="col-6 text-end">
                  <span class="badge bg-success">{{ activeItem.status }}</span>
                </div>
                <div class="col-6 text-muted">Payment Method</div>
                <div class="col-6 text-end">{{ activeItem.method || "-" }}</div>
                <div class="col-12 mt-2">
                  <label class="text-muted small">Notes</label>
                  <p class="p-2 bg-light rounded mb-0">{{ activeItem.note || "-" }}</p>
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
  title: "Payment Inflow - Kacetak System",
});

interface InflowRecord {
  id: number;
  date: string;
  refNo: string;
  name: string;
  source: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Partial" | "Unpaid";
  method: string;
  note: string;
}

const showBalanceSummary = ref(true);

const inflows = ref<InflowRecord[]>([
  {
    id: 1,
    date: "01/02/2026",
    refNo: "INV-001",
    name: "Toko Berkah",
    source: "Sales",
    amount: 2500000,
    dueDate: "01/02/2026",
    status: "Paid",
    method: "Transfer",
    note: "Pelunasan Penjualan",
  },
  {
    id: 2,
    date: "08/02/2026",
    refNo: "INV-004",
    name: "PT. Sumber Rejeki",
    source: "Sales",
    amount: 7200000,
    dueDate: "01/03/2026",
    status: "Unpaid",
    method: "",
    note: "-",
  },
  {
    id: 3,
    date: "10/02/2026",
    refNo: "INC-012",
    name: "PT. Logistik",
    source: "Income",
    amount: 350000,
    dueDate: "10/02/2026",
    status: "Paid",
    method: "Transfer",
    note: "Klaim Asuransi Pengiriman",
  },
  {
    id: 4,
    date: "11/02/2026",
    refNo: "INV-005",
    name: "Toko Berkah",
    source: "Sales",
    amount: 1800000,
    dueDate: "11/02/2026",
    status: "Paid",
    method: "Transfer",
    note: "Pembayaran Invoice #005",
  },
  {
    id: 5,
    date: "12/02/2026",
    refNo: "RET-890",
    name: "Distributor ABC",
    source: "Purchase Return",
    amount: 250000,
    dueDate: "12/02/2026",
    status: "Paid",
    method: "Transfer",
    note: "Refund Selisih Harga",
  },
  {
    id: 6,
    date: "13/02/2026",
    refNo: "INC-015",
    name: "Bapak Budi",
    source: "Income",
    amount: 150000,
    dueDate: "13/02/2026",
    status: "Paid",
    method: "Cash",
    note: "Sewa Alat Kantor",
  },
  {
    id: 7,
    date: "14/02/2026",
    refNo: "INV-006",
    name: "Toko Laris",
    source: "Sales",
    amount: 5500000,
    dueDate: "14/02/2026",
    status: "Partial",
    method: "Transfer",
    note: "DP Penjualan",
  },
]);

const searchQuery = ref("");
const filterSource = ref("");
const filterStatus = ref("");

const filteredInflows = computed(() => {
  return inflows.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q || item.refNo.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.note.toLowerCase().includes(q);
    const matchSource = !filterSource.value || item.source === filterSource.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchSource && matchStatus;
  });
});

const totalAmount = computed(() => filteredInflows.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showAddModal = ref(false);
const showViewModal = ref(false);
const activeItem = ref<InflowRecord | null>(null);

const defaultFormData = () => ({
  date: new Date().toISOString().split("T")[0],
  dueDate: "",
  name: "",
  source: "Sales",
  amount: 0,
  method: "Transfer",
  bankAccount: "Dulank Semesta Cida PT / BCA / 1092993242",
  note: "",
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openViewModal = (item: InflowRecord) => {
  activeItem.value = item;
  showViewModal.value = true;
};

const openPayModal = (item: InflowRecord) => {
  if (confirm(`Confirm marked as fully paid for ${item.refNo}?`)) {
    item.status = "Paid";
  }
};

const openEditModal = (item: InflowRecord) => {
  const newAmount = prompt("Enter new amount:", String(item.amount));
  if (newAmount) {
    item.amount = Number(newAmount);
  }
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this payment inflow?")) {
    inflows.value = inflows.value.filter((i) => i.id !== id);
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showViewModal.value = false;
  activeItem.value = null;
};

const saveInflow = () => {
  const newId = Math.max(0, ...inflows.value.map((i) => i.id)) + 1;
  const count = inflows.value.length + 1;
  const refNo = `INV-${String(count).padStart(3, "0")}`;
  inflows.value.unshift({
    id: newId,
    date: formData.value.date,
    refNo,
    name: formData.value.name,
    source: formData.value.source,
    amount: formData.value.amount,
    dueDate: formData.value.dueDate || formData.value.date,
    status: "Paid",
    method: formData.value.method,
    note: formData.value.note,
  });
  closeModal();
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterSource.value = "";
  filterStatus.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
