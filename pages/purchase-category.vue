<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Category</h4>
          <h6>Manage your purchase categories</h6>
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
          <i class="feather-plus-circle me-2"></i>Add Purchase Product
        </a>
      </div>
    </div>

    <!-- Category List Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <!-- Filter -->
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <!-- Search Input -->
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search category..." class="form-control form-control-sm" />
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
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Active'">Active</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Deactive'">Deactive</a></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- /Filter -->

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Product (Category Name)</th>
                <th>Created</th>
                <th>Status</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredCategories" :key="item.id">
                <td class="fw-bold">{{ item.name }}</td>
                <td>{{ item.created }}</td>
                <td>
                  <span class="badge" :class="item.status === 'Active' ? 'bg-outline-success' : 'bg-outline-danger'">
                    {{ item.status }}
                  </span>
                </td>
                <td class="action-table-data">
                  <div class="edit-delete-action d-flex align-items-center gap-2">
                    <a class="p-2 text-info cursor-pointer" @click.prevent="openEditModal(item)" title="Edit">
                      <i class="feather-edit"></i>
                    </a>
                    <a class="p-2 text-danger cursor-pointer" @click.prevent="deleteCategory(item)" title="Delete">
                      <i class="feather-trash-2"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCategories.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">No categories found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">{{ isEdit ? "Edit Purchase Category" : "Add Purchase Category" }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label class="form-label fw-semibold">Category Name</label>
                <input type="text" class="form-control" v-model="formData.name" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Status</label>
                <select class="form-select" v-model="formData.status">
                  <option>Active</option>
                  <option>Deactive</option>
                </select>
              </div>
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

const categories = ref([
  { id: 1, name: "Kertas & Bahan Baku Cetak", created: "Admin, 02/01/2026, 08:00", status: "Active" },
  { id: 2, name: "Tinta & Toner", created: "Admin, 02/01/2026, 08:15", status: "Active" },
  { id: 3, name: "Bahan Finishing & Jilid", created: "Admin, 02/01/2026, 08:30", status: "Active" },
  { id: 4, name: "Sparepart Mesin", created: "Admin, 02/01/2026, 08:45", status: "Active" },
  { id: 5, name: "Packaging & Kemasan", created: "Admin, 02/01/2026, 09:00", status: "Deactive" },
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
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredCategories = computed(() => {
  return categories.value.filter((c) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q);
    const matchesStatus = !statusFilter.value || c.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({ name: "", status: "Active" });

const openAddModal = () => {
  isEdit.value = false;
  formData.value = { name: "", status: "Active" };
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  showModal.value = true;
};

const saveCategory = () => {
  if (isEdit.value) {
    const idx = categories.value.findIndex((c) => c.id === formData.value.id);
    if (idx !== -1) {
      categories.value[idx] = { ...formData.value };
    }
  } else {
    categories.value.unshift({
      id: Date.now(),
      name: formData.value.name,
      created: `Admin, ${new Date().toLocaleDateString("id-ID")}`,
      status: formData.value.status,
    });
  }
  showModal.value = false;
};

const deleteCategory = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    categories.value = categories.value.filter((c) => c.id !== item.id);
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
