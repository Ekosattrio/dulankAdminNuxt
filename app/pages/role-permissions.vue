<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Roles & Permission</h4>
            <h6>Manage your roles</h6>
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
          <button class="btn btn-added" @click="openAddModal"><i class="ti ti-plus me-1"></i> Add New Role</button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Role..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="sortOrder" class="form-select form-select-sm" style="min-width: 140px">
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Created On</th>
                  <th class="text-end no-sort">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in filteredRoles" :key="idx">
                  <td class="fw-semibold text-dark">{{ r.name }}</td>
                  <td>{{ r.createdOn }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit Role" @click="openEditModal(r)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <NuxtLink to="/permissions" class="btn btn-sm btn-outline-info p-1" title="Permissions Matrix">
                        <i class="ti ti-shield"></i>
                      </NuxtLink>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete Role" @click="deleteRole(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredRoles.length === 0">
                  <td colspan="3" class="text-center py-4 text-muted">No roles found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add/Edit Role Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? "Edit Role" : "Create Role" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveRole">
                <div class="mb-3">
                  <label class="form-label">Role Name</label>
                  <input v-model="currentRole.name" type="text" class="form-control" required placeholder="e.g. Supervisor" />
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Submit</button>
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
  title: "Roles & Permission - Kacetak System",
});

const searchQuery = ref("");
const sortOrder = ref("newest");
const showModal = ref(false);
const isEditing = ref(false);

interface RoleItem {
  id?: number;
  name: string;
  createdOn: string;
}

const roles = ref<RoleItem[]>([
  { id: 1, name: "Admin", createdOn: "25 May 2023" },
  { id: 2, name: "Customer", createdOn: "30 May 2023" },
  { id: 3, name: "Shop Owner", createdOn: "20 Apr 2023" },
  { id: 4, name: "Manager", createdOn: "12 Jan 2023" },
]);

const currentRole = ref<RoleItem>({
  name: "",
  createdOn: "",
});

const filteredRoles = computed(() => {
  return roles.value.filter((r) => r.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const openAddModal = () => {
  isEditing.value = false;
  currentRole.value = {
    name: "",
    createdOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  };
  showModal.value = true;
};

const openEditModal = (r: RoleItem) => {
  isEditing.value = true;
  currentRole.value = { ...r };
  showModal.value = true;
};

const saveRole = () => {
  if (isEditing.value) {
    const idx = roles.value.findIndex((r) => r.id === currentRole.value.id);
    if (idx !== -1) {
      roles.value[idx] = { ...currentRole.value };
    }
  } else {
    roles.value.unshift({
      id: Date.now(),
      name: currentRole.value.name,
      createdOn: currentRole.value.createdOn,
    });
  }
  showModal.value = false;
};

const deleteRole = (idx: number) => {
  if (confirm("Are you sure you want to delete this role?")) {
    roles.value.splice(idx, 1);
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
