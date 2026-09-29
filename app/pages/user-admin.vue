<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>User Admin</h4>
            <h6>Kelola User & Role Toko</h6>
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
          <button class="btn btn-added" @click="openAddModal"><i class="ti ti-plus me-1"></i> Add New User</button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search User Admin..." />
              </div>
            </div>
            <div class="filters d-flex justify-content-end gap-2">
              <select v-model="selectedRole" class="form-select form-select-sm" style="min-width: 130px">
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Staff">Staff</option>
              </select>
              <select v-model="selectedStatus" class="form-select form-select-sm" style="min-width: 130px">
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Store</th>
                  <th>Status</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(u, idx) in filteredAdmins" :key="idx">
                  <td class="fw-bold text-primary">{{ u.id }}</td>
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>
                    <span :class="getRoleBadgeClass(u.role)">{{ u.role }}</span>
                  </td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <span v-for="(store, sIdx) in u.stores" :key="sIdx" class="badge bg-primary text-xs">
                        {{ store }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span :class="u.status === 'Active' ? 'badge bg-outline-success' : 'badge bg-outline-danger'">
                      {{ u.status }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(u)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteAdmin(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredAdmins.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No admin users found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? "Edit Admin User" : "Add Admin User" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveAdmin">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">Full Name</label>
                    <input v-model="currentAdmin.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Email</label>
                    <input v-model="currentAdmin.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Role</label>
                    <select v-model="currentAdmin.role" class="form-select">
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Status</label>
                    <select v-model="currentAdmin.status" class="form-select">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div class="col-lg-12">
                    <label class="form-label d-block fw-semibold mb-2">Assigned Stores</label>
                    <div class="row g-2">
                      <div v-for="st in availableStores" :key="st" class="col-sm-6">
                        <div class="form-check">
                          <input
                            :id="'store-' + st"
                            type="checkbox"
                            class="form-check-input"
                            :value="st"
                            :checked="currentAdmin.stores.includes(st)"
                            @change="toggleStore(st)"
                          />
                          <label :for="'store-' + st" class="form-check-label">{{ st }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer modal-action-footer justify-content-end mt-4 pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save Changes</button>
                </div>
              </form>
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
  title: "User Admin - Kacetak System",
});

const searchQuery = ref("");
const selectedRole = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isEditing = ref(false);

const availableStores = ["Toko Pusat", "Toko Cabang 1", "Toko Cabang 2", "Toko Cabang 3"];

interface AdminItem {
  id: string;
  name: string;
  email: string;
  role: string;
  stores: string[];
  status: string;
}

const admins = ref<AdminItem[]>([
  {
    id: "U001",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    role: "Admin",
    stores: ["Toko Pusat", "Toko Cabang 1"],
    status: "Active",
  },
  {
    id: "U002",
    name: "Siti Aminah",
    email: "siti.aminah@email.com",
    role: "Manager",
    stores: ["Toko Cabang 2"],
    status: "Active",
  },
  {
    id: "U003",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    role: "Supervisor",
    stores: ["Toko Pusat", "Toko Cabang 1", "Toko Cabang 3"],
    status: "Active",
  },
  {
    id: "U004",
    name: "Diana Putri",
    email: "diana.putri@email.com",
    role: "Staff",
    stores: ["Toko Cabang 2"],
    status: "Inactive",
  },
]);

const currentAdmin = ref<AdminItem>({
  id: "",
  name: "",
  email: "",
  role: "Admin",
  stores: [],
  status: "Active",
});

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case "Admin":
      return "badge bg-info";
    case "Manager":
      return "badge bg-warning";
    case "Supervisor":
      return "badge bg-success";
    default:
      return "badge bg-secondary";
  }
};

const filteredAdmins = computed(() => {
  return admins.value.filter((u) => {
    const q = searchQuery.value.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    const matchRole = !selectedRole.value || u.role === selectedRole.value;
    const matchStatus = !selectedStatus.value || u.status === selectedStatus.value;
    return matchQ && matchRole && matchStatus;
  });
});

const toggleStore = (storeName: string) => {
  const idx = currentAdmin.value.stores.indexOf(storeName);
  if (idx === -1) {
    currentAdmin.value.stores.push(storeName);
  } else {
    currentAdmin.value.stores.splice(idx, 1);
  }
};

const openAddModal = () => {
  isEditing.value = false;
  const nextNum = admins.value.length + 1;
  currentAdmin.value = {
    id: `U00${nextNum}`,
    name: "",
    email: "",
    role: "Admin",
    stores: ["Toko Pusat"],
    status: "Active",
  };
  showModal.value = true;
};

const openEditModal = (u: AdminItem) => {
  isEditing.value = true;
  currentAdmin.value = { ...u, stores: [...u.stores] };
  showModal.value = true;
};

const saveAdmin = () => {
  if (isEditing.value) {
    const idx = admins.value.findIndex((a) => a.id === currentAdmin.value.id);
    if (idx !== -1) {
      admins.value[idx] = { ...currentAdmin.value };
    }
  } else {
    admins.value.unshift({ ...currentAdmin.value });
  }
  showModal.value = false;
};

const deleteAdmin = (idx: number) => {
  if (confirm("Are you sure you want to delete this admin user?")) {
    admins.value.splice(idx, 1);
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
