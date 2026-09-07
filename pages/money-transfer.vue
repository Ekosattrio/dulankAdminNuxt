<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header transfer">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Money Transfer</h4>
            <h6>Manage Money Transfer List</h6>
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
        <div class="d-flex purchase-pg-btn">
          <div class="page-btn">
            <button type="button" class="btn btn-added btn-primary" @click="openAddModal">
              <i class="ti ti-circle-plus me-2"></i>Add New Transfer
            </button>
          </div>
        </div>
      </div>

      <!-- Transfer List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search transfer no, account, note..."
                />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Date</th>
                  <th>No Transfer</th>
                  <th>From Account</th>
                  <th>To Account</th>
                  <th class="text-end">Amount (IDR)</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredTransfers" :key="item.id">
                  <td>{{ item.date }}</td>
                  <td class="fw-semibold text-primary">{{ item.no }}</td>
                  <td class="small fw-medium">{{ item.fromAccount }}</td>
                  <td class="small fw-medium">{{ item.toAccount }}</td>
                  <td class="text-end fw-semibold">{{ formatNumber(item.amount) }}</td>
                  <td class="text-muted">{{ item.description }}</td>
                  <td>{{ item.createdBy }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2 text-info" href="javascript:void(0);" title="View" @click="openViewModal(item)">
                        <i class="ti ti-eye"></i>
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
                <tr v-if="filteredTransfers.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">No money transfers found.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold bg-light">
                  <td colspan="4" class="text-start">Total Transferred Amount</td>
                  <td class="text-end text-primary fs-15">{{ formatNumber(totalAmount) }}</td>
                  <td colspan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Transfer Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add New Transfer</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveTransfer">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">Date <span class="text-danger">*</span></label>
                    <input v-model="formData.date" type="text" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Amount (IDR) <span class="text-danger">*</span></label>
                    <input v-model.number="formData.amount" type="number" class="form-control" required min="1" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">From Account <span class="text-danger">*</span></label>
                    <select v-model="formData.fromAccount" class="form-select" required>
                      <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">To Account <span class="text-danger">*</span></label>
                    <select v-model="formData.toAccount" class="form-select" required>
                      <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description / Note</label>
                    <textarea
                      v-model="formData.description"
                      class="form-control"
                      rows="3"
                      placeholder="Transfer purpose..."
                    ></textarea>
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

      <!-- Edit Transfer Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Money Transfer</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateTransfer">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">Date <span class="text-danger">*</span></label>
                    <input v-model="formData.date" type="text" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Amount (IDR) <span class="text-danger">*</span></label>
                    <input v-model.number="formData.amount" type="number" class="form-control" required min="1" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">From Account <span class="text-danger">*</span></label>
                    <select v-model="formData.fromAccount" class="form-select" required>
                      <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">To Account <span class="text-danger">*</span></label>
                    <select v-model="formData.toAccount" class="form-select" required>
                      <option v-for="acc in accountOptions" :key="acc" :value="acc">{{ acc }}</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description / Note</label>
                    <textarea v-model="formData.description" class="form-control" rows="3"></textarea>
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
                <h4>Transfer Details - {{ activeItem.no }}</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="row g-2">
                <div class="col-4 text-muted">No Transfer</div>
                <div class="col-8 fw-bold text-primary">{{ activeItem.no }}</div>
                <div class="col-4 text-muted">Date</div>
                <div class="col-8">{{ activeItem.date }}</div>
                <div class="col-4 text-muted">From Account</div>
                <div class="col-8 small">{{ activeItem.fromAccount }}</div>
                <div class="col-4 text-muted">To Account</div>
                <div class="col-8 small">{{ activeItem.toAccount }}</div>
                <div class="col-4 text-muted">Amount</div>
                <div class="col-8 fw-bold fs-16 text-success">Rp {{ formatNumber(activeItem.amount) }}</div>
                <div class="col-4 text-muted">Description</div>
                <div class="col-8">{{ activeItem.description }}</div>
                <div class="col-4 text-muted">Created By</div>
                <div class="col-8">{{ activeItem.createdBy }}</div>
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
  title: "Money Transfer - Kacetak System",
});

interface TransferRecord {
  id: number;
  date: string;
  no: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  description: string;
  createdBy: string;
}

const accountOptions = [
  "Cash Account Cash Account - 1001",
  "Bank BNI 0876543210123 - PT Dulank Semesta Cida",
  "Bank BCA 4567891230 - Cecep Sudirman",
  "Bank Mandiri 1230009876543 - PT Dulank Semesta Cida",
  "Bank BRI 1020304050607 - Cecep Sudirman",
];

const transfers = ref<TransferRecord[]>([
  {
    id: 1,
    date: "19/11/2025 10:49",
    no: "TF00001",
    fromAccount: "Cash Account Cash Account - 1001",
    toAccount: "Bank BNI 0876543210123 - PT Dulank Semesta Cida",
    amount: 269061,
    description: "Gaji Bulanan Cecep Sudirman",
    createdBy: "Admin",
  },
  {
    id: 2,
    date: "27/11/2025 12:50",
    no: "TF00002",
    fromAccount: "Bank BCA 4567891230 - Cecep Sudirman",
    toAccount: "Cash Account Cash Account - 1001",
    amount: 1772418,
    description: "Pembayaran Invoice Supplier PT Kertas Jaya",
    createdBy: "Admin",
  },
  {
    id: 3,
    date: "05/12/2025 13:19",
    no: "TF00003",
    fromAccount: "Bank Mandiri 1230009876543 - PT Dulank Semesta Cida",
    toAccount: "Cash Account Cash Account - 1001",
    amount: 3084398,
    description: "Biaya Kurir dan Pengiriman",
    createdBy: "Staff",
  },
  {
    id: 4,
    date: "29/12/2025 16:47",
    no: "TF00004",
    fromAccount: "Bank BRI 1020304050607 - Cecep Sudirman",
    toAccount: "Cash Account Cash Account - 1001",
    amount: 2192170,
    description: "Pengembalian Dana Konsumen (Refund)",
    createdBy: "Admin",
  },
]);

const searchQuery = ref("");

const filteredTransfers = computed(() => {
  return transfers.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    return (
      !q ||
      item.no.toLowerCase().includes(q) ||
      item.fromAccount.toLowerCase().includes(q) ||
      item.toAccount.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });
});

const totalAmount = computed(() => filteredTransfers.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const editingId = ref<number | null>(null);
const activeItem = ref<TransferRecord | null>(null);

const defaultFormData = () => ({
  date: "20/01/2026 14:00",
  fromAccount: "Cash Account Cash Account - 1001",
  toAccount: "Bank BCA 4567891230 - Cecep Sudirman",
  amount: 500000,
  description: "",
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: TransferRecord) => {
  editingId.value = item.id;
  formData.value = {
    date: item.date,
    fromAccount: item.fromAccount,
    toAccount: item.toAccount,
    amount: item.amount,
    description: item.description,
  };
  showEditModal.value = true;
};

const openViewModal = (item: TransferRecord) => {
  activeItem.value = item;
  showViewModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showViewModal.value = false;
  editingId.value = null;
  activeItem.value = null;
};

const saveTransfer = () => {
  const newId = Math.max(0, ...transfers.value.map((t) => t.id)) + 1;
  const count = transfers.value.length + 1;
  const no = `TF${String(count).padStart(5, "0")}`;
  transfers.value.unshift({
    id: newId,
    date: formData.value.date,
    no,
    fromAccount: formData.value.fromAccount,
    toAccount: formData.value.toAccount,
    amount: formData.value.amount,
    description: formData.value.description,
    createdBy: "Admin",
  });
  closeModal();
};

const updateTransfer = () => {
  if (editingId.value === null) return;
  const idx = transfers.value.findIndex((t) => t.id === editingId.value);
  if (idx !== -1) {
    transfers.value[idx] = {
      ...transfers.value[idx],
      date: formData.value.date,
      fromAccount: formData.value.fromAccount,
      toAccount: formData.value.toAccount,
      amount: formData.value.amount,
      description: formData.value.description,
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this money transfer?")) {
    transfers.value = transfers.value.filter((t) => t.id !== id);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
