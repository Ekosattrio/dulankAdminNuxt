<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Supplier List</h4>
            <h6>Manage material vendors, raw paper suppliers, and chemical providers</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add New Supplier
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
                  placeholder="Search supplier ID, name, or contact..."
                />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>ID Supplier</th>
                  <th>Supplier Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>PIC Name</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th class="text-center" style="width: 120px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sup in filteredSuppliers" :key="sup.id">
                  <td class="fw-bold text-primary">{{ sup.code }}</td>
                  <td class="fw-bold text-dark">{{ sup.name }}</td>
                  <td class="small text-muted">{{ sup.email }}</td>
                  <td>{{ sup.contact }}</td>
                  <td class="fw-semibold">{{ sup.picName }}</td>
                  <td>
                    <span
                      :class="
                        sup.status === 'Active'
                          ? 'badge bg-success bg-opacity-10 text-success border border-success'
                          : 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary'
                      "
                    >
                      {{ sup.status }}
                    </span>
                  </td>
                  <td class="small text-muted">{{ sup.date }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(sup)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteSupplier(sup.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredSuppliers.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">No suppliers found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? "Edit Supplier" : "Add New Supplier" }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveSupplier">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Supplier Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input v-model="formData.email" type="email" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Contact / Phone <span class="text-danger">*</span></label>
                  <input v-model="formData.contact" type="text" class="form-control" required />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">PIC Name <span class="text-danger">*</span></label>
                  <input v-model="formData.picName" type="text" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="formData.status" class="form-select">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? "Update Supplier" : "Save Supplier" }}</button>
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
  title: "Supplier List - Kacetak System",
});

interface SupplierItem {
  id: number;
  code: string;
  name: string;
  email: string;
  contact: string;
  picName: string;
  status: "Active" | "Inactive";
  date: string;
}

const suppliers = ref<SupplierItem[]>([
  {
    id: 1,
    code: "ID0001",
    name: "PT Kertas Jaya Makmur",
    email: "info@kertasjaya.co.id",
    contact: "+6221-8091234",
    picName: "Budi Santoso",
    status: "Active",
    date: "05/12/2025 9:15",
  },
  {
    id: 2,
    code: "ID0002",
    name: "CV Kimia Prima Terang",
    email: "sales@kimiaprima.com",
    contact: "+6281233445566",
    picName: "Siti Nurhaliza",
    status: "Active",
    date: "08/12/2025 10:30",
  },
  {
    id: 3,
    code: "ID0003",
    name: "UD Sukses Makmur Kertas",
    email: "ud.sukses@gmail.com",
    contact: "031-5566778",
    picName: "Ahmad Wijaya",
    status: "Active",
    date: "11/12/2025 14:45",
  },
  {
    id: 4,
    code: "ID0004",
    name: "Global Inkindo Pratama",
    email: "admin@globalinkindo.id",
    contact: "+6281122334455",
    picName: "Dewi Handayani",
    status: "Active",
    date: "14/12/2025 11:20",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("");

const filteredSuppliers = computed(() => {
  return suppliers.value.filter((s) => {
    const matchSearch =
      s.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.picName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStat = filterStatus.value ? s.status === filterStatus.value : true;
    return matchSearch && matchStat;
  });
});

const modalVisible = ref(false);
const isEditing = ref(false);
const formData = reactive({
  id: 0,
  name: "",
  email: "",
  contact: "",
  picName: "",
  status: "Active" as "Active" | "Inactive",
});

function openAddModal() {
  isEditing.value = false;
  formData.id = 0;
  formData.name = "";
  formData.email = "";
  formData.contact = "";
  formData.picName = "";
  formData.status = "Active";
  modalVisible.value = true;
}

function openEditModal(sup: SupplierItem) {
  isEditing.value = true;
  formData.id = sup.id;
  formData.name = sup.name;
  formData.email = sup.email;
  formData.contact = sup.contact;
  formData.picName = sup.picName;
  formData.status = sup.status;
  modalVisible.value = true;
}

function saveSupplier() {
  if (isEditing.value) {
    const idx = suppliers.value.findIndex((s) => s.id === formData.id);
    if (idx !== -1) {
      suppliers.value[idx] = {
        ...suppliers.value[idx],
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        picName: formData.picName,
        status: formData.status,
      };
    }
  } else {
    suppliers.value.unshift({
      id: Date.now(),
      code: "ID000" + (suppliers.value.length + 1),
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      picName: formData.picName,
      status: formData.status,
      date:
        new Date().toLocaleDateString("en-GB") +
        " " +
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    });
  }
  modalVisible.value = false;
}

function deleteSupplier(id: number) {
  if (confirm("Are you sure you want to remove this supplier?")) {
    suppliers.value = suppliers.value.filter((s) => s.id !== id);
  }
}

function exportPdf() {
  alert("Exporting Supplier PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}
</script>
