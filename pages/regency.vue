<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Regency List</h4>
            <h6>Manage your Regency</h6>
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
          <button class="btn btn-added" @click="openAddModal"><i class="ti ti-plus me-1"></i> Add New Regency</button>
          <button class="btn btn-outline-primary" @click="showImportModal = true">
            <i class="ti ti-download me-1"></i> Import Regency
          </button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Regency or Province..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="selectedProvince" class="form-select form-select-sm" style="min-width: 150px">
                <option value="">All Provinces</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Banten">Banten</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Regency</th>
                  <th>Added</th>
                  <th>Created by</th>
                  <th class="text-end no-sort">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(reg, idx) in filteredRegencies" :key="idx">
                  <td class="text-muted">{{ reg.province }}</td>
                  <td class="fw-semibold text-dark">{{ reg.name }}</td>
                  <td>{{ reg.added }}</td>
                  <td>
                    <div class="userimgname d-flex align-items-center gap-2">
                      <a href="javascript:void(0);" class="product-img">
                        <img
                          :src="reg.avatar"
                          alt="user"
                          class="rounded-circle"
                          style="width: 30px; height: 30px; object-fit: cover"
                        />
                      </a>
                      <span class="text-muted">{{ reg.createdBy }}</span>
                    </div>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-info p-1" title="View" @click="viewRegency(reg)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(reg)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteRegency(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredRegencies.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">No regencies found.</td>
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
                <h4>{{ isEditing ? "Edit Regency" : "Add New Regency" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveRegency">
                <div class="mb-3">
                  <label class="form-label">Province</label>
                  <select v-model="currentRegency.province" class="form-select" required>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Banten">Banten</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Regency / City Name</label>
                  <input
                    v-model="currentRegency.name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="e.g. Jakarta Selatan"
                  />
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
                <h4>Import Regency Data</h4>
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
  title: "Regency List - Kacetak System",
});

const searchQuery = ref("");
const selectedProvince = ref("");
const showModal = ref(false);
const showImportModal = ref(false);
const isEditing = ref(false);

interface RegencyItem {
  id?: number;
  province: string;
  name: string;
  added: string;
  createdBy: string;
  avatar: string;
}

const regencies = ref<RegencyItem[]>([
  {
    id: 1,
    province: "DKI Jakarta",
    name: "Jakarta Selatan",
    added: "2025-08-28",
    createdBy: "Arroon",
    avatar: "/assets/img/users/user-30.jpg",
  },
  {
    id: 2,
    province: "Jawa Barat",
    name: "Bandung",
    added: "2025-08-27",
    createdBy: "Kenneth",
    avatar: "/assets/img/users/user-13.jpg",
  },
  {
    id: 3,
    province: "Jawa Tengah",
    name: "Semarang",
    added: "2025-08-26",
    createdBy: "Gart",
    avatar: "/assets/img/users/user-11.jpg",
  },
  {
    id: 4,
    province: "Jawa Timur",
    name: "Surabaya",
    added: "2025-08-25",
    createdBy: "Steven",
    avatar: "/assets/img/users/user-01.jpg",
  },
  {
    id: 5,
    province: "Banten",
    name: "Tangerang",
    added: "2025-08-24",
    createdBy: "Susan",
    avatar: "/assets/img/users/user-02.jpg",
  },
  {
    id: 6,
    province: "DKI Jakarta",
    name: "Jakarta Barat",
    added: "2025-08-23",
    createdBy: "Robert",
    avatar: "/assets/img/users/user-03.jpg",
  },
  {
    id: 7,
    province: "Jawa Barat",
    name: "Bogor",
    added: "2025-08-22",
    createdBy: "Janet",
    avatar: "/assets/img/users/user-06.jpg",
  },
]);

const currentRegency = ref<RegencyItem>({
  province: "DKI Jakarta",
  name: "",
  added: "",
  createdBy: "Admin",
  avatar: "/assets/img/users/user-01.jpg",
});

const filteredRegencies = computed(() => {
  return regencies.value.filter((r) => {
    const q = searchQuery.value.toLowerCase();
    const matchQ = r.name.toLowerCase().includes(q) || r.province.toLowerCase().includes(q);
    const matchProv = !selectedProvince.value || r.province === selectedProvince.value;
    return matchQ && matchProv;
  });
});

const openAddModal = () => {
  isEditing.value = false;
  currentRegency.value = {
    province: selectedProvince.value || "DKI Jakarta",
    name: "",
    added: new Date().toISOString().split("T")[0],
    createdBy: "Admin",
    avatar: "/assets/img/users/user-01.jpg",
  };
  showModal.value = true;
};

const openEditModal = (r: RegencyItem) => {
  isEditing.value = true;
  currentRegency.value = { ...r };
  showModal.value = true;
};

const viewRegency = (r: RegencyItem) => {
  alert(`Regency: ${r.name}\nProvince: ${r.province}\nAdded on: ${r.added}`);
};

const saveRegency = () => {
  if (isEditing.value) {
    const idx = regencies.value.findIndex((r) => r.id === currentRegency.value.id);
    if (idx !== -1) {
      regencies.value[idx] = { ...currentRegency.value };
    }
  } else {
    regencies.value.unshift({
      id: Date.now(),
      province: currentRegency.value.province,
      name: currentRegency.value.name,
      added: currentRegency.value.added,
      createdBy: currentRegency.value.createdBy,
      avatar: currentRegency.value.avatar,
    });
  }
  showModal.value = false;
};

const deleteRegency = (idx: number) => {
  if (confirm("Are you sure you want to delete this regency?")) {
    regencies.value.splice(idx, 1);
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
