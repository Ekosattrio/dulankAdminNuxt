<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Expenses</h4>
          <h6>Manage your expenses</h6>
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
          <i class="feather-plus-circle me-2"></i>Add New Expense
        </a>
      </div>
    </div>

    <!-- Expenses Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <!-- Filter -->
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <!-- Search Input -->
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search expense..." class="form-control form-control-sm" />
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
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Paid'">Paid</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Unpaid'">Unpaid</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Partial'">Partial</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Canceled'">Canceled</a></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- /Filter -->

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>No Expense</th>
                <th>Date</th>
                <th>Category</th>
                <th>Name</th>
                <th>Status</th>
                <th>Amount (IDR)</th>
                <th>Paid (IDR)</th>
                <th>Due (IDR)</th>
                <th>Description</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredExpenses" :key="item.id">
                <td class="fw-bold">{{ item.noExpense }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-success': item.status === 'Paid',
                      'bg-outline-warning': item.status === 'Partial',
                      'bg-outline-danger': item.status === 'Unpaid',
                      'bg-outline-secondary': item.status === 'Canceled',
                    }"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="fw-semibold">{{ formatNumber(item.amount) }}</td>
                <td class="text-success">{{ formatNumber(item.paid) }}</td>
                <td :class="item.due > 0 ? 'text-danger' : 'text-muted'">{{ formatNumber(item.due) }}</td>
                <td class="small text-muted">{{ item.description }}</td>
                <td class="action-table-data">
                  <div class="edit-delete-action d-flex align-items-center gap-1">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewExpense(item)" title="View">
                      <i class="feather-eye"></i>
                    </a>
                    <a class="p-2 text-info cursor-pointer" @click.prevent="openEditModal(item)" title="Edit">
                      <i class="feather-edit"></i>
                    </a>
                    <a class="p-2 text-danger cursor-pointer" @click.prevent="deleteExpense(item)" title="Delete">
                      <i class="feather-trash-2"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredExpenses.length === 0">
                <td colspan="10" class="text-center py-4 text-muted">No expenses found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Expense Modal -->
    <div v-if="showViewModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Expense Details</h4>
            <button type="button" class="btn-close" @click="showViewModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="selectedExpense">
            <div class="row my-2">
              <div class="col-5 fw-bold">No Expense</div>
              <div class="col-7">{{ selectedExpense.noExpense }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Category</div>
              <div class="col-7">{{ selectedExpense.category }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Date</div>
              <div class="col-7">{{ selectedExpense.date }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Name / Vendor</div>
              <div class="col-7">{{ selectedExpense.name }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Amount</div>
              <div class="col-7 fw-bold">Rp {{ formatNumber(selectedExpense.amount) }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Paid</div>
              <div class="col-7 text-success">Rp {{ formatNumber(selectedExpense.paid) }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Due</div>
              <div class="col-7 text-danger">Rp {{ formatNumber(selectedExpense.due) }}</div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Status</div>
              <div class="col-7">
                <span class="badge bg-outline-primary">{{ selectedExpense.status }}</span>
              </div>
            </div>
            <div class="row my-2">
              <div class="col-5 fw-bold">Description</div>
              <div class="col-7 text-muted">{{ selectedExpense.description }}</div>
            </div>
            <div class="modal-footer p-0 pt-3 border-top justify-content-end mt-4">
              <button type="button" class="btn btn-secondary" @click="showViewModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">{{ isEdit ? "Edit Expense" : "Add New Expense" }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveExpense">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Expense Category</label>
                  <select class="form-select" v-model="formData.category" required>
                    <option>Biaya Gaji & Upah</option>
                    <option>Bahan Baku Utama</option>
                    <option>Perawatan Mesin</option>
                    <option>Biaya Listrik & Air</option>
                    <option>Sewa & Properti</option>
                    <option>Biaya Pemasaran</option>
                    <option>Transportasi & Kurir</option>
                    <option>Alat Tulis Kantor (ATK)</option>
                    <option>Biaya Lain-lain</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Expense Date</label>
                  <input type="date" class="form-control" v-model="formData.date" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Name / Vendor</label>
                  <input type="text" class="form-control" v-model="formData.name" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Status</label>
                  <select class="form-select" v-model="formData.status" @change="recalcDue">
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Partial</option>
                    <option>Canceled</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Amount (IDR)</label>
                  <input type="number" class="form-control" v-model.number="formData.amount" @input="recalcDue" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Paid (IDR)</label>
                  <input type="number" class="form-control" v-model.number="formData.paid" @input="recalcDue" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Due (IDR)</label>
                  <input type="number" class="form-control" v-model.number="formData.due" readonly />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea class="form-control" rows="3" v-model="formData.description"></textarea>
                </div>
              </div>
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

const expenses = ref([
  {
    id: 1,
    noExpense: "EX000001",
    date: "01/10/2025",
    category: "Biaya Gaji & Upah",
    name: "Toko Berkah",
    status: "Paid",
    amount: 1000000,
    paid: 1000000,
    due: 0,
    description: "Pembayaran gaji lembur staf produksi.",
  },
  {
    id: 2,
    noExpense: "EX000002",
    date: "03/10/2025",
    category: "Bahan Baku Utama",
    name: "PT. Maju Jaya",
    status: "Unpaid",
    amount: 1150000,
    paid: 0,
    due: 1150000,
    description: "Pembelian tinta sablon UV.",
  },
  {
    id: 3,
    noExpense: "EX000003",
    date: "05/10/2025",
    category: "Perawatan Mesin",
    name: "Bank Mandiri",
    status: "Unpaid",
    amount: 550000,
    paid: 0,
    due: 550000,
    description: "Servis rutin mesin die-cut.",
  },
  {
    id: 4,
    noExpense: "EX000004",
    date: "07/10/2025",
    category: "Biaya Listrik & Air",
    name: "Ibu Siti",
    status: "Partial",
    amount: 800000,
    paid: 300000,
    due: 500000,
    description: "Pembayaran tagihan listrik bulan September.",
  },
  {
    id: 5,
    noExpense: "EX000005",
    date: "10/10/2025",
    category: "Transportasi & Kurir",
    name: "PT. Maju Jaya",
    status: "Paid",
    amount: 250000,
    paid: 250000,
    due: 0,
    description: "Ongkos kirim pesanan Jakarta.",
  },
]);

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

const filteredExpenses = computed(() => {
  return expenses.value.filter((exp) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      exp.noExpense.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q) ||
      exp.name.toLowerCase().includes(q) ||
      exp.description.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || exp.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});

const showViewModal = ref(false);
const selectedExpense = ref<any>(null);

const recalcDue = () => {
  if (formData.value.status === "Paid") {
    formData.value.paid = formData.value.amount;
    formData.value.due = 0;
  } else if (formData.value.status === "Unpaid") {
    formData.value.paid = 0;
    formData.value.due = formData.value.amount;
  } else {
    formData.value.due = Math.max(0, (formData.value.amount || 0) - (formData.value.paid || 0));
  }
};

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    noExpense: `EX${String(expenses.value.length + 1).padStart(6, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    category: "Biaya Gaji & Upah",
    name: "",
    status: "Paid",
    amount: 0,
    paid: 0,
    due: 0,
    description: "",
  };
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  showModal.value = true;
};

const viewExpense = (item: any) => {
  selectedExpense.value = item;
  showViewModal.value = true;
};

const saveExpense = () => {
  recalcDue();
  if (isEdit.value) {
    const idx = expenses.value.findIndex((e) => e.id === formData.value.id);
    if (idx !== -1) {
      expenses.value[idx] = { ...formData.value };
    }
  } else {
    expenses.value.unshift({
      id: Date.now(),
      ...formData.value,
    });
  }
  showModal.value = false;
};

const deleteExpense = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.noExpense}?`)) {
    expenses.value = expenses.value.filter((e) => e.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const toggleHeader = () => {
  // header toggle
};
</script>
