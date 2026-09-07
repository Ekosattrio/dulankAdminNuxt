<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Province List</h4>
            <h6>Manage your Province</h6>
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
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-added" @click="openAddModal"><i class="ti ti-plus me-1"></i> Add New Province</button>
          <button class="btn btn-outline-primary" @click="showImportModal = true">
            <i class="ti ti-download me-1"></i> Import Province
          </button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Province..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="sortOrder" class="form-select form-select-sm" style="min-width: 140px">
                <option value="newest">Sort by Date: Newest</option>
                <option value="oldest">Sort by Date: Oldest</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Added</th>
                  <th>Created by</th>
                  <th class="text-end no-sort">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prov, idx) in filteredProvinces" :key="idx">
                  <td class="fw-semibold text-dark">{{ prov.name }}</td>
                  <td>{{ prov.added }}</td>
                  <td>
                    <div class="userimgname d-flex align-items-center gap-2">
                      <a href="javascript:void(0);" class="product-img">
                        <img
                          :src="prov.avatar"
                          alt="user"
                          class="rounded-circle"
                          style="width: 30px; height: 30px; object-fit: cover"
                        />
                      </a>
                      <span class="text-muted">{{ prov.createdBy }}</span>
                    </div>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-info p-1" title="View" @click="viewProvince(prov)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(prov)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteProvince(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredProvinces.length === 0">
                  <td colspan="4" class="text-center py-4 text-muted">No provinces found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? "Edit Province" : "Add New Province" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveProvince">
                <div class="mb-3">
                  <label class="form-label">Province Name</label>
                  <input v-model="currentProvince.name" type="text" class="form-control" required placeholder="e.g. Jawa Barat" />
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Import Modal -->
      <div v-if="showImportModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>Import Province Data</h4>
              </div>
              <button type="button" class="btn-close" @click="showImportModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="mb-3">
                <label class="form-label">Choose CSV / Excel File</label>
                <input type="file" class="form-control" accept=".csv,.xlsx,.xls" />
              </div>
              <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                <button type="button" class="btn btn-light" @click="showImportModal = false">Cancel</button>
                <button type="button" class="btn btn-warning text-white" @click="showImportModal = false">Import</button>
              </div>
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
  title: "Province List - Kacetak System",
});

const searchQuery = ref("");
const sortOrder = ref("newest");
const showModal = ref(false);
const showImportModal = ref(false);
const isEditing = ref(false);

interface ProvinceItem {
  id?: number;
  name: string;
  added: string;
  createdBy: string;
  avatar: string;
}

const provinces = ref<ProvinceItem[]>([
  { id: 1, name: "DKI Jakarta", added: "2025-08-28", createdBy: "Arroon", avatar: "/assets/img/users/user-30.jpg" },
  { id: 2, name: "Jawa Barat", added: "2025-08-27", createdBy: "Kenneth", avatar: "/assets/img/users/user-13.jpg" },
  { id: 3, name: "Jawa Tengah", added: "2025-08-26", createdBy: "Gart", avatar: "/assets/img/users/user-11.jpg" },
  { id: 4, name: "Jawa Timur", added: "2025-08-25", createdBy: "Steven", avatar: "/assets/img/users/user-01.jpg" },
  { id: 5, name: "Banten", added: "2025-08-24", createdBy: "Susan", avatar: "/assets/img/users/user-02.jpg" },
  { id: 6, name: "DI Yogyakarta", added: "2025-08-23", createdBy: "Robert", avatar: "/assets/img/users/user-03.jpg" },
  { id: 7, name: "Bali", added: "2025-08-22", createdBy: "Janet", avatar: "/assets/img/users/user-06.jpg" },
]);

const currentProvince = ref<ProvinceItem>({
  name: "",
  added: "",
  createdBy: "Admin",
  avatar: "/assets/img/users/user-01.jpg",
});

const filteredProvinces = computed(() => {
  return provinces.value.filter((p) => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const openAddModal = () => {
  isEditing.value = false;
  currentProvince.value = {
    name: "",
    added: new Date().toISOString().split("T")[0],
    createdBy: "Admin",
    avatar: "/assets/img/users/user-01.jpg",
  };
  showModal.value = true;
};

const openEditModal = (p: ProvinceItem) => {
  isEditing.value = true;
  currentProvince.value = { ...p };
  showModal.value = true;
};

const viewProvince = (p: ProvinceItem) => {
  alert(`Province: ${p.name}\nAdded on: ${p.added}\nCreated by: ${p.createdBy}`);
};

const saveProvince = () => {
  if (isEditing.value) {
    const idx = provinces.value.findIndex((p) => p.id === currentProvince.value.id);
    if (idx !== -1) {
      provinces.value[idx] = { ...currentProvince.value };
    }
  } else {
    provinces.value.unshift({
      id: Date.now(),
      name: currentProvince.value.name,
      added: currentProvince.value.added,
      createdBy: currentProvince.value.createdBy,
      avatar: currentProvince.value.avatar,
    });
  }
  showModal.value = false;
};

const deleteProvince = (idx: number) => {
  if (confirm("Are you sure you want to delete this province?")) {
    provinces.value.splice(idx, 1);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
