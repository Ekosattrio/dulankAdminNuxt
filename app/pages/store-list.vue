<template>
  <div class="page-wrapper">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Store List</h4>
            <h6>Manage branches, outlet stores, and workshop locations</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Store
          </button>
        </div>
      </div>

      <!-- Data Table Card -->
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
                  placeholder="Search store name, user or address..."
                />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || "All Status" }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute">
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = '';
                        statusDropdownOpen = false;
                      "
                      >All Status</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Active';
                        statusDropdownOpen = false;
                      "
                      >Active</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Inactive';
                        statusDropdownOpen = false;
                      "
                      >Inactive</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Store Name</th>
                  <th>Manager / User</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in filteredStores" :key="s.id">
                  <td class="fw-bold text-dark">{{ s.storeName }}</td>
                  <td>{{ s.userName }}</td>
                  <td class="small text-muted">{{ s.address }}</td>
                  <td>{{ s.phone }}</td>
                  <td>{{ s.email }}</td>
                  <td>
                    <span class="badge rounded" :class="s.status === 'Active' ? 'badge-success' : 'badge-secondary'">
                      • {{ s.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Store"
                        @click="openEditModal(s)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Store"
                        @click="deleteStore(s.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredStores.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No store outlets found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Store Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" style="background-color: rgba(0, 0, 0, 0.5)" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? "Edit Store" : "Add Store" }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveStore">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Store Outlet Name <span class="text-danger">*</span></label>
                  <input
                    v-model="form.storeName"
                    type="text"
                    class="form-control"
                    required
                    placeholder="e.g. Workshop Karawang"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">PIC / Manager Username <span class="text-danger">*</span></label>
                  <input v-model="form.userName" type="text" class="form-control" required placeholder="e.g. Thomas21" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone <span class="text-danger">*</span></label>
                  <input v-model="form.phone" type="text" class="form-control" required placeholder="+62 812 3456 789" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input v-model="form.email" type="email" class="form-control" required placeholder="outlet@example.com" />
                </div>
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea
                    v-model="form.address"
                    rows="2"
                    class="form-control"
                    placeholder="Complete address of the outlet"
                  ></textarea>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-2">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="storeSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? "Update Store" : "Submit Store" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface StoreItem {
  id: number;
  storeName: string;
  userName: string;
  address: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
}

const stores = ref<StoreItem[]>([
  {
    id: 1,
    storeName: "Kacetak Pusat Karawang Barat",
    userName: "Thomas21",
    address: "Karawang Barat Kab. Karawang",
    phone: "+62 812 6354 7758",
    email: "thomas@example.com",
    status: "Active",
  },
  {
    id: 2,
    storeName: "Kacetak Cabang Bandung",
    userName: "Cras56",
    address: "Jl. Soekarno Hatta No. 120, Bandung",
    phone: "+62 813 6358 6901",
    email: "rasmussen@example.com",
    status: "Active",
  },
  {
    id: 3,
    storeName: "Workshop Packaging Cikarang",
    userName: "FredJ25",
    address: "Kawasan Industri Jababeka, Cikarang",
    phone: "+62 815 8769 4357",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: 4,
    storeName: "Digital Copy Outlet Jakarta",
    userName: "James524",
    address: "Jl. Percetakan Negara No. 45, Jakarta",
    phone: "+62 816 4163 5098",
    email: "james@example.com",
    status: "Active",
  },
  {
    id: 5,
    storeName: "Gudang Kertas Cikampek",
    userName: "Alex99",
    address: "Jl. Raya Cikampek Timur No. 8",
    phone: "+62 818 9012 3456",
    email: "alex@example.com",
    status: "Inactive",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("");
const statusDropdownOpen = ref(false);

const filteredStores = computed(() => {
  return stores.value.filter((s) => {
    const matchStatus = !filterStatus.value || s.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      s.storeName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const modalVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  storeName: "",
  userName: "",
  address: "",
  phone: "",
  email: "",
  status: "Active" as "Active" | "Inactive",
});

const formActive = computed({
  get: () => form.value.status === "Active",
  set: (val: boolean) => {
    form.value.status = val ? "Active" : "Inactive";
  },
});

function openAddModal() {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    storeName: "",
    userName: "",
    address: "",
    phone: "",
    email: "",
    status: "Active",
  };
  modalVisible.value = true;
}

function openEditModal(s: StoreItem) {
  isEdit.value = true;
  currentId.value = s.id;
  form.value = {
    storeName: s.storeName,
    userName: s.userName,
    address: s.address,
    phone: s.phone,
    email: s.email,
    status: s.status,
  };
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function saveStore() {
  if (isEdit.value && currentId.value !== null) {
    const idx = stores.value.findIndex((s) => s.id === currentId.value);
    if (idx !== -1) {
      stores.value[idx] = {
        ...stores.value[idx],
        ...form.value,
      };
    }
  } else {
    const newId = stores.value.length ? Math.max(...stores.value.map((s) => s.id)) + 1 : 1;
    stores.value.unshift({
      id: newId,
      ...form.value,
    });
  }
  closeModal();
}

function deleteStore(id: number) {
  if (confirm("Are you sure you want to delete this store outlet?")) {
    stores.value = stores.value.filter((s) => s.id !== id);
  }
}

function exportPdf() {
  alert("Exporting stores list as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}
</script>
