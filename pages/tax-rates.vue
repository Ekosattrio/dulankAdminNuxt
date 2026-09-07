<template>
  <div class="page-wrapper mt-3">
    <div class="content settings-content">
      <div class="page-header settings-pg-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100" style="max-width: 900px">
              <div class="setting-title d-flex align-items-center justify-content-between mb-3">
                <h4>Tax Rates</h4>
                <button type="button" class="btn btn-primary btn-added" @click="openAddModal">
                  <i class="ti ti-circle-plus me-2"></i>Add New Tax Rate
                </button>
              </div>

              <div class="card table-list-card">
                <div class="card-body">
                  <div class="table-top mb-3">
                    <div class="search-set">
                      <div class="search-input">
                        <span class="btn-searchset"><i class="ti ti-search"></i></span>
                        <input v-model="searchQuery" type="text" class="form-control" placeholder="Search tax rate..." />
                      </div>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table datanew">
                      <thead class="thead-light">
                        <tr>
                          <th>Name</th>
                          <th>Tax Rates %</th>
                          <th>Created On</th>
                          <th>Status</th>
                          <th class="no-sort text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in filteredTaxes" :key="item.id">
                          <td class="fw-semibold text-dark">{{ item.name }}</td>
                          <td>{{ item.rate }}%</td>
                          <td>{{ item.createdOn }}</td>
                          <td>
                            <span class="badge" :class="item.status === 'Active' ? 'bg-success' : 'bg-danger'">
                              {{ item.status }}
                            </span>
                          </td>
                          <td class="action-table-data text-end">
                            <div class="edit-delete-action justify-content-end">
                              <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                                <i class="ti ti-edit"></i>
                              </a>
                              <a
                                class="confirm-text p-2 align-center text-danger"
                                href="javascript:void(0);"
                                @click="deleteItem(item.id)"
                              >
                                <i class="ti ti-trash"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="filteredTaxes.length === 0">
                          <td colspan="5" class="text-center py-4 text-muted">No tax rates found.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Tax Rate Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add Tax Rate</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveTax">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Name <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. PPN 11% / VAT" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Tax Rate % <span class="text-danger">*</span></label>
                    <input
                      v-model.number="formData.rate"
                      type="number"
                      step="0.1"
                      class="form-control"
                      placeholder="11"
                      required
                    />
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input
                        id="addTaxStatus"
                        v-model="formData.isActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                      <label class="form-check-label" for="addTaxStatus">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Tax Rate Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Tax Rate</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateTax">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Name <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Tax Rate % <span class="text-danger">*</span></label>
                    <input v-model.number="formData.rate" type="number" step="0.1" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input
                        id="editTaxStatus"
                        v-model="formData.isActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                      <label class="form-check-label" for="editTaxStatus">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
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

useHead({
  title: "Tax Rates - Kacetak System",
});

interface TaxRateItem {
  id: number;
  name: string;
  rate: number;
  createdOn: string;
  status: "Active" | "Inactive";
}

const taxRates = ref<TaxRateItem[]>([
  { id: 1, name: "VAT", rate: 16, createdOn: "12 Jul 2023", status: "Active" },
  { id: 2, name: "TGST", rate: 14, createdOn: "17 Jul 2023", status: "Active" },
  { id: 3, name: "HST", rate: 12, createdOn: "23 Jul 2023", status: "Active" },
  { id: 4, name: "PPN 11%", rate: 11, createdOn: "01 Jan 2024", status: "Active" },
  { id: 5, name: "PPN 12%", rate: 12, createdOn: "01 Jan 2025", status: "Active" },
]);

const searchQuery = ref("");

const filteredTaxes = computed(() => {
  return taxRates.value.filter((item) => {
    return searchQuery.value === "" || item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<number | null>(null);

const defaultFormData = () => ({
  name: "",
  rate: 11,
  isActive: true,
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: TaxRateItem) => {
  editingId.value = item.id;
  formData.value = {
    name: item.name,
    rate: item.rate,
    isActive: item.status === "Active",
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
};

const saveTax = () => {
  const newId = Math.max(0, ...taxRates.value.map((t) => t.id)) + 1;
  const now = new Date();
  taxRates.value.push({
    id: newId,
    name: formData.value.name,
    rate: formData.value.rate,
    createdOn: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    status: formData.value.isActive ? "Active" : "Inactive",
  });
  closeModal();
};

const updateTax = () => {
  if (editingId.value === null) return;
  const idx = taxRates.value.findIndex((t) => t.id === editingId.value);
  if (idx !== -1) {
    taxRates.value[idx] = {
      ...taxRates.value[idx],
      name: formData.value.name,
      rate: formData.value.rate,
      status: formData.value.isActive ? "Active" : "Inactive",
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this tax rate?")) {
    taxRates.value = taxRates.value.filter((t) => t.id !== id);
  }
};

const refresh = () => {
  searchQuery.value = "";
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
