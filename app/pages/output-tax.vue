<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header justify-content-between">
        <div class="page-title">
          <h4>Output Tax (Pajak Keluaran)</h4>
          <h6>Manage your Sales & Output VAT Invoices</h6>
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
      </div>

      <!-- Table List Card -->
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
                  placeholder="Search sales no, e-tax number, customer..."
                />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterTxCode" class="form-select form-select-sm" style="max-width: 320px">
                <option value="">All Transaction Codes</option>
                <option v-for="code in transactionCodeOptions" :key="code" :value="code">{{ code }}</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No Sales</th>
                  <th>E-Tax Date</th>
                  <th>E-tax Invoice Number</th>
                  <th>Customer Name</th>
                  <th class="text-end">Tax Base / DPP</th>
                  <th class="text-end">VAT - Output Tax</th>
                  <th>Transaction Code</th>
                  <th class="text-end">Total</th>
                  <th>Status</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredInvoices" :key="item.id">
                  <td class="fw-semibold text-primary">{{ item.salesNo }}</td>
                  <td>{{ item.etaxDate }}</td>
                  <td class="fw-medium font-monospace">{{ item.etaxNumber }}</td>
                  <td>{{ item.customerName }}</td>
                  <td class="text-end">{{ formatNumber(item.dpp) }}</td>
                  <td class="text-end text-success fw-medium">{{ formatNumber(item.vat) }}</td>
                  <td class="small text-muted">{{ item.txCode }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.total) }}</td>
                  <td>
                    <span class="badge" :class="item.status === 'Issued' ? 'bg-success' : 'bg-secondary'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a
                        class="confirm-text p-2 align-center text-danger"
                        href="javascript:void(0);"
                        @click="deleteItem(item.id)"
                      >
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredInvoices.length === 0">
                  <td colspan="10" class="text-center py-4 text-muted">No output tax invoices found.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold bg-light">
                  <td colspan="4" class="text-start">Total</td>
                  <td class="text-end">{{ formatNumber(totalDpp) }}</td>
                  <td class="text-end text-success">{{ formatNumber(totalVat) }}</td>
                  <td></td>
                  <td class="text-end text-primary fs-15">{{ formatNumber(grandTotal) }}</td>
                  <td colspan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="showEditModal && editingItem"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Output Tax</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateInvoice">
              <div class="modal-body custom-modal-body">
                <div class="row g-2 mb-3">
                  <div class="col-4 text-muted">No Sales</div>
                  <div class="col-8 fw-bold">{{ editingItem.salesNo }}</div>
                  <div class="col-4 text-muted">Customer Name</div>
                  <div class="col-8 fw-bold">{{ editingItem.customerName }}</div>
                  <div class="col-4 text-muted">DPP</div>
                  <div class="col-8 fw-bold">Rp {{ formatNumber(editingItem.dpp) }}</div>
                  <div class="col-4 text-muted">VAT Output</div>
                  <div class="col-8 fw-bold text-success">Rp {{ formatNumber(editingItem.vat) }}</div>
                </div>

                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">E-Tax Invoice Number</label>
                    <input v-model="editForm.etaxNumber" type="text" class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">E-Tax Date</label>
                    <input v-model="editForm.etaxDate" type="text" class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Transaction Code</label>
                    <select v-model="editForm.txCode" class="form-select">
                      <option v-for="c in transactionCodeOptions" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Status</label>
                    <select v-model="editForm.status" class="form-select">
                      <option value="Issued">Issued</option>
                      <option value="Draft">Draft</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useHead({
  title: "Output Tax - Kacetak System",
});

interface OutputTaxItem {
  id: number;
  salesNo: string;
  etaxDate: string;
  etaxNumber: string;
  customerName: string;
  dpp: number;
  vat: number;
  txCode: string;
  total: number;
  status: "Issued" | "Draft" | "Cancelled";
}

const transactionCodeOptions = [
  "01 - To Other party VAT Collector",
  "02 - To Government Institution as VAT Collector",
  "03 - To VAT Collector other than Government Institution",
  "04 - Other Tax Base",
  "05 - Certain Value Tax Base",
  "06 - To Tourist for VAT Refund for Tourist",
  "07 - VAT Uncollected",
  "08 - VAT Exempted",
  "09 - Sale of unrelated to business asset",
  "10 - Other delivery of good/services",
];

const invoices = ref<OutputTaxItem[]>([
  {
    id: 1,
    salesNo: "SLS-001",
    etaxDate: "01-02-2026",
    etaxNumber: "001.26.0001",
    customerName: "CV. Maju Jaya",
    dpp: 12500000,
    vat: 1375000,
    txCode: "04 - Other Tax Base",
    total: 13875000,
    status: "Issued",
  },
  {
    id: 2,
    salesNo: "SLS-002",
    etaxDate: "02-02-2026",
    etaxNumber: "001.26.0002",
    customerName: "PT. Sinar Abadi",
    dpp: 45000000,
    vat: 4950000,
    txCode: "04 - Other Tax Base",
    total: 49950000,
    status: "Issued",
  },
  {
    id: 3,
    salesNo: "SLS-003",
    etaxDate: "03-02-2026",
    etaxNumber: "001.26.0003",
    customerName: "Universitas Terbuka",
    dpp: 18200000,
    vat: 2002000,
    txCode: "04 - Other Tax Base",
    total: 20202000,
    status: "Issued",
  },
  {
    id: 4,
    salesNo: "SLS-004",
    etaxDate: "04-02-2026",
    etaxNumber: "001.26.0004",
    customerName: "Yayasan Pendidikan",
    dpp: 7500000,
    vat: 825000,
    txCode: "04 - Other Tax Base",
    total: 8325000,
    status: "Issued",
  },
]);

const searchQuery = ref("");
const filterTxCode = ref("");

const filteredInvoices = computed(() => {
  return invoices.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q ||
      item.salesNo.toLowerCase().includes(q) ||
      item.etaxNumber.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q);
    const matchTx = !filterTxCode.value || item.txCode.includes(filterTxCode.value);
    return matchSearch && matchTx;
  });
});

const totalDpp = computed(() => filteredInvoices.value.reduce((acc, c) => acc + c.dpp, 0));
const totalVat = computed(() => filteredInvoices.value.reduce((acc, c) => acc + c.vat, 0));
const grandTotal = computed(() => filteredInvoices.value.reduce((acc, c) => acc + c.total, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showEditModal = ref(false);
const editingItem = ref<OutputTaxItem | null>(null);
const editForm = ref({
  etaxNumber: "",
  etaxDate: "",
  txCode: "",
  status: "Issued" as "Issued" | "Draft" | "Cancelled",
});

const openEditModal = (item: OutputTaxItem) => {
  editingItem.value = item;
  editForm.value = {
    etaxNumber: item.etaxNumber,
    etaxDate: item.etaxDate,
    txCode: item.txCode,
    status: item.status,
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showEditModal.value = false;
  editingItem.value = null;
};

const updateInvoice = () => {
  if (!editingItem.value) return;
  const idx = invoices.value.findIndex((i) => i.id === editingItem.value!.id);
  if (idx !== -1) {
    invoices.value[idx].etaxNumber = editForm.value.etaxNumber;
    invoices.value[idx].etaxDate = editForm.value.etaxDate;
    invoices.value[idx].txCode = editForm.value.txCode;
    invoices.value[idx].status = editForm.value.status;
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this invoice record?")) {
    invoices.value = invoices.value.filter((i) => i.id !== id);
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
  filterTxCode.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
