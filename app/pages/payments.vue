<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="page-title">
          <h4>Payments</h4>
          <h6>Manage payment in and payment out</h6>
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

      <!-- Payment List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search ref no, name..." />
              </div>
            </div>

            <div class="filters d-flex flex-wrap justify-content-end gap-2">
              <select v-model="filterType" class="form-select form-select-sm" style="width: auto">
                <option value="">All Types</option>
                <option value="Payment-In">Payment-In</option>
                <option value="Payment-Out">Payment-Out</option>
              </select>

              <select v-model="filterMethod" class="form-select form-select-sm" style="width: auto">
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Date Payment</th>
                  <th>Ref No</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Payment Method</th>
                  <th class="text-end">Amount (IDR)</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredPayments" :key="item.id">
                  <td>{{ item.date }}</td>
                  <td class="fw-semibold text-primary">{{ item.refNo }}</td>
                  <td class="fw-medium text-dark">{{ item.name }}</td>
                  <td>
                    <span class="badge" :class="item.type === 'Payment-In' ? 'bg-success' : 'bg-danger'">
                      {{ item.type }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.method }}</span>
                  </td>
                  <td class="text-end fw-semibold">{{ formatNumber(item.amount) }}</td>
                  <td>
                    <span class="badge bg-success">{{ item.status }}</span>
                  </td>
                  <td class="text-muted fs-12">{{ item.created }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2 text-info" href="javascript:void(0);" title="View Details" @click="openViewModal(item)">
                        <i class="ti ti-eye"></i>
                      </a>
                      <a class="p-2 text-secondary" href="javascript:void(0);" title="Print Receipt" @click="printReceipt(item)">
                        <i class="ti ti-printer"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPayments.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No payment records found.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold bg-light">
                  <td colspan="5" class="text-start">Total Visible Payments</td>
                  <td class="text-end text-primary fs-15">{{ formatNumber(totalAmount) }}</td>
                  <td colspan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- View Payment Modal -->
      <div
        v-if="showViewModal && viewingItem"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Payment Details - {{ viewingItem.refNo }}</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="row g-2">
                <div class="col-6 text-muted">Date</div>
                <div class="col-6 text-end fw-medium">{{ viewingItem.date }}</div>
                <div class="col-6 text-muted">Ref No</div>
                <div class="col-6 text-end fw-bold text-primary">{{ viewingItem.refNo }}</div>
                <div class="col-6 text-muted">Name / Entity</div>
                <div class="col-6 text-end fw-medium">{{ viewingItem.name }}</div>
                <div class="col-6 text-muted">Type</div>
                <div class="col-6 text-end">
                  <span class="badge" :class="viewingItem.type === 'Payment-In' ? 'bg-success' : 'bg-danger'">
                    {{ viewingItem.type }}
                  </span>
                </div>
                <div class="col-6 text-muted">Method</div>
                <div class="col-6 text-end">{{ viewingItem.method }}</div>
                <div class="col-6 text-muted">Amount</div>
                <div class="col-6 text-end fw-bold fs-16 text-success">Rp {{ formatNumber(viewingItem.amount) }}</div>
                <div class="col-6 text-muted">Status</div>
                <div class="col-6 text-end">
                  <span class="badge bg-success">{{ viewingItem.status }}</span>
                </div>
                <div class="col-6 text-muted">Created By</div>
                <div class="col-6 text-end">{{ viewingItem.created }}</div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Close</button>
              <button type="button" class="btn btn-primary" @click="printReceipt(viewingItem)">
                <i class="ti ti-printer me-1"></i>Print Receipt
              </button>
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
  title: "Payments - Kacetak System",
});

interface PaymentRecord {
  id: number;
  date: string;
  refNo: string;
  name: string;
  type: "Payment-In" | "Payment-Out";
  method: "Cash" | "Transfer";
  amount: number;
  status: string;
  created: string;
}

const payments = ref<PaymentRecord[]>([
  {
    id: 1,
    date: "01/02/2026",
    refNo: "PAY-001",
    name: "Seluruh Staff",
    type: "Payment-In",
    method: "Transfer",
    amount: 4500000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 2,
    date: "02/02/2026",
    refNo: "ADV-010",
    name: "Ahmad (Admin)",
    type: "Payment-In",
    method: "Cash",
    amount: 500000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 3,
    date: "03/02/2026",
    refNo: "PUR-201",
    name: "PT. Maju Jaya",
    type: "Payment-In",
    method: "Transfer",
    amount: 12500000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 4,
    date: "04/02/2026",
    refNo: "EXP-101",
    name: "PLN Persero",
    type: "Payment-Out",
    method: "Transfer",
    amount: 1450000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 5,
    date: "05/02/2026",
    refNo: "SR-012",
    name: "Toko Berkah",
    type: "Payment-In",
    method: "Cash",
    amount: 250000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 6,
    date: "06/02/2026",
    refNo: "ADV-011",
    name: "Rian (Kurir)",
    type: "Payment-Out",
    method: "Cash",
    amount: 300000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 7,
    date: "07/02/2026",
    refNo: "PAY-002",
    name: "Andi",
    type: "Payment-In",
    method: "Transfer",
    amount: 1500000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 8,
    date: "08/02/2026",
    refNo: "PUR-203",
    name: "Distributor ABC",
    type: "Payment-In",
    method: "Cash",
    amount: 850000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 9,
    date: "09/02/2026",
    refNo: "EXP-104",
    name: "Pemilik Ruko",
    type: "Payment-In",
    method: "Transfer",
    amount: 5000000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 10,
    date: "10/02/2026",
    refNo: "ADV-012",
    name: "Siska (Marketing)",
    type: "Payment-In",
    method: "Transfer",
    amount: 2500000,
    status: "Paid",
    created: "Admin",
  },
  {
    id: 11,
    date: "11/02/2026",
    refNo: "EXP-105",
    name: "Toko ATK Jaya",
    type: "Payment-In",
    method: "Cash",
    amount: 420000,
    status: "Paid",
    created: "Admin",
  },
]);

const searchQuery = ref("");
const filterType = ref("");
const filterMethod = ref("");

const filteredPayments = computed(() => {
  return payments.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = !q || item.refNo.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    const matchType = !filterType.value || item.type === filterType.value;
    const matchMethod = !filterMethod.value || item.method === filterMethod.value;
    return matchSearch && matchType && matchMethod;
  });
});

const totalAmount = computed(() => filteredPayments.value.reduce((acc, c) => acc + c.amount, 0));

const formatNumber = (val: number) => {
  return new Intl.NumberFormat("id-ID").format(val || 0);
};

const showViewModal = ref(false);
const viewingItem = ref<PaymentRecord | null>(null);

const openViewModal = (item: PaymentRecord) => {
  viewingItem.value = item;
  showViewModal.value = true;
};

const closeModal = () => {
  showViewModal.value = false;
  viewingItem.value = null;
};

const printReceipt = (item: PaymentRecord) => {
  window.print();
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterType.value = "";
  filterMethod.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
