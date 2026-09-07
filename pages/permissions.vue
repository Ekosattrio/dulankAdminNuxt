<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Permission</h4>
            <h6>Manage your permissions</h6>
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
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Module..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" @click="showFilter = !showFilter">
                <i class="ti ti-filter"></i> Filter
              </button>
              <select v-model="selectedRole" class="form-select form-select-sm" style="min-width: 140px">
                <option value="Admin">Admin</option>
                <option value="Shop Owner">Shop Owner</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

          <!-- Filter Panel -->
          <div v-show="showFilter" class="card bg-light border p-3 mb-3">
            <div class="row g-3">
              <div class="col-lg-4 col-sm-6">
                <label class="form-label text-xs fw-bold">Select Role</label>
                <select v-model="selectedRole" class="form-select form-select-sm">
                  <option value="Admin">Admin</option>
                  <option value="Shop Owner">Shop Owner</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div class="col-lg-4 col-sm-6">
                <label class="form-label text-xs fw-bold">Effective Date</label>
                <input v-model="filterDate" type="date" class="form-control form-control-sm" />
              </div>
              <div class="col-lg-4 col-sm-12 d-flex align-items-end">
                <button class="btn btn-warning btn-sm text-white w-100" @click="applyFilter">
                  <i class="ti ti-search me-1"></i> Apply Filter
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Modules</th>
                  <th class="text-center">Create</th>
                  <th class="text-center">Edit</th>
                  <th class="text-center">Delete</th>
                  <th class="text-center">View</th>
                  <th class="text-center no-sort">Allow all</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(mod, idx) in filteredModules" :key="idx">
                  <td class="fw-semibold text-dark">{{ mod.name }}</td>
                  <td class="text-center">
                    <input v-model="mod.create" type="checkbox" class="form-check-input" />
                  </td>
                  <td class="text-center">
                    <input v-model="mod.edit" type="checkbox" class="form-check-input" />
                  </td>
                  <td class="text-center">
                    <input v-model="mod.delete" type="checkbox" class="form-check-input" />
                  </td>
                  <td class="text-center">
                    <input v-model="mod.view" type="checkbox" class="form-check-input" />
                  </td>
                  <td class="text-center">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :checked="isModuleAllAllowed(mod)"
                      @change="toggleAllowAll(mod)"
                    />
                  </td>
                </tr>
                <tr v-if="filteredModules.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">No modules found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" class="btn btn-light" @click="resetMatrix">Reset</button>
            <button type="button" class="btn btn-warning text-white" @click="saveMatrix">Save Permissions</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useHead({
  title: "Permissions - Kacetak System",
});

const searchQuery = ref("");
const selectedRole = ref("Admin");
const showFilter = ref(false);
const filterDate = ref("");

interface ModulePerm {
  name: string;
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

const modules = ref<ModulePerm[]>([
  { name: "Inventory", create: true, edit: true, delete: false, view: true },
  { name: "Expense", create: true, edit: true, delete: false, view: true },
  { name: "Product", create: true, edit: true, delete: true, view: true },
  { name: "Category", create: true, edit: true, delete: false, view: true },
  { name: "Sub Category", create: true, edit: true, delete: false, view: true },
  { name: "Unit", create: true, edit: true, delete: false, view: true },
  { name: "Sales", create: true, edit: true, delete: false, view: true },
  { name: "Purchases", create: true, edit: true, delete: false, view: true },
  { name: "Payment", create: true, edit: true, delete: false, view: true },
  { name: "Orders", create: true, edit: true, delete: false, view: true },
  { name: "Reports", create: false, edit: false, delete: false, view: true },
  { name: "User Management", create: true, edit: true, delete: true, view: true },
]);

const filteredModules = computed(() => {
  return modules.value.filter((m) => m.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const isModuleAllAllowed = (mod: ModulePerm) => {
  return mod.create && mod.edit && mod.delete && mod.view;
};

const toggleAllowAll = (mod: ModulePerm) => {
  const allow = !isModuleAllAllowed(mod);
  mod.create = allow;
  mod.edit = allow;
  mod.delete = allow;
  mod.view = allow;
};

const applyFilter = () => {
  showFilter.value = false;
};

const resetMatrix = () => {
  modules.value.forEach((m) => {
    m.create = true;
    m.edit = true;
    m.delete = false;
    m.view = true;
  });
};

const saveMatrix = () => {
  alert(`Permissions for ${selectedRole.value} saved successfully!`);
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
