<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Laminating & Coating</h4>
            <h6>Configure workshop laminating machines, area-based calculations, and minimum charges</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Laminating Service
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search laminating type..." />
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
                        filterStatus = 'Deactive';
                        statusDropdownOpen = false;
                      "
                      >Deactive</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive mb-4">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Jenis Laminasi / Mesin</th>
                  <th>Ukuran Minim</th>
                  <th>Ukuran Max</th>
                  <th class="text-end">Tarif per cm²</th>
                  <th class="text-end">Ongkos Minim</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="l in filteredLaminates" :key="l.id">
                  <td class="fw-bold text-dark">{{ l.name }}</td>
                  <td>
                    <span class="badge bg-light text-dark border font-monospace">{{ l.minSize }}</span>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border font-monospace">{{ l.maxSize }}</span>
                  </td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(l.rateCm) }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(l.minim) }}</td>
                  <td>{{ l.update }}</td>
                  <td>
                    <span class="badge rounded" :class="l.status === 'Active' ? 'badge-success' : 'badge-secondary'">
                      • {{ l.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Laminate"
                        @click="openEditModal(l)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Laminate"
                        @click="deleteLaminate(l.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredLaminates.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">No laminating configurations found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" style="background-color: rgba(0, 0, 0, 0.5)" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? "Edit Laminating Service" : "Add Laminating Service" }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveLaminate">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Service / Finishing Name <span class="text-danger">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="e.g. Laminasi Doff, Glossy, Soft Touch"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Min Size (cm)</label>
                  <input v-model="form.minSize" type="text" class="form-control" placeholder="25 x 15 cm" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Max Size (cm)</label>
                  <input v-model="form.maxSize" type="text" class="form-control" placeholder="65 x 100 cm" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Rate per cm² (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.rateCm" type="number" step="0.1" class="form-control" required placeholder="20" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Minim Charge (Rp) <span class="text-danger">*</span></label>
                  <input v-model.number="form.minim" type="number" class="form-control" required placeholder="200000" />
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="lamActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? "Update Service" : "Save Service" }}
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

interface SelfLaminate {
  id: number;
  name: string;
  minSize: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
  status: "Active" | "Deactive";
}

const laminates = ref<SelfLaminate[]>([
  {
    id: 1,
    name: "Laminasi Doff Thermal",
    minSize: "25×15 cm",
    maxSize: "65×100 cm",
    rateCm: 20,
    minim: 200000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 2,
    name: "Laminasi Glossy Thermal",
    minSize: "25×15 cm",
    maxSize: "65×100 cm",
    rateCm: 18,
    minim: 180000,
    update: "20/12/24 23:12",
    status: "Deactive",
  },
  {
    id: 3,
    name: "UV Vernish Coating",
    minSize: "25×15 cm",
    maxSize: "72×102 cm",
    rateCm: 10,
    minim: 100000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 4,
    name: "Spot UV Screen Doff Base",
    minSize: "25×15 cm",
    maxSize: "52×72 cm",
    rateCm: 32,
    minim: 280000,
    update: "21/12/24 10:00",
    status: "Active",
  },
  {
    id: 5,
    name: "Soft Touch Velvet Lamination",
    minSize: "30×20 cm",
    maxSize: "65×100 cm",
    rateCm: 45,
    minim: 450000,
    update: "21/12/24 11:30",
    status: "Active",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("");
const statusDropdownOpen = ref(false);

const filteredLaminates = computed(() => {
  return laminates.value.filter((l) => {
    const matchStatus = !filterStatus.value || l.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.minSize.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.maxSize.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const modalVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  name: "",
  minSize: "25×15 cm",
  maxSize: "65×100 cm",
  rateCm: 20,
  minim: 200000,
  status: "Active" as "Active" | "Deactive",
});

const formActive = computed({
  get: () => form.value.status === "Active",
  set: (val: boolean) => {
    form.value.status = val ? "Active" : "Deactive";
  },
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function openAddModal() {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    name: "",
    minSize: "25×15 cm",
    maxSize: "65×100 cm",
    rateCm: 20,
    minim: 200000,
    status: "Active",
  };
  modalVisible.value = true;
}

function openEditModal(l: SelfLaminate) {
  isEdit.value = true;
  currentId.value = l.id;
  form.value = { ...l };
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function saveLaminate() {
  const now =
    new Date().toLocaleDateString("en-GB") + " " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (isEdit.value && currentId.value !== null) {
    const idx = laminates.value.findIndex((l) => l.id === currentId.value);
    if (idx !== -1) {
      laminates.value[idx] = { ...laminates.value[idx], ...form.value, update: now };
    }
  } else {
    const newId = laminates.value.length ? Math.max(...laminates.value.map((l) => l.id)) + 1 : 1;
    laminates.value.unshift({ id: newId, ...form.value, update: now });
  }
  closeModal();
}

function deleteLaminate(id: number) {
  if (confirm("Are you sure you want to delete this laminating service?")) {
    laminates.value = laminates.value.filter((l) => l.id !== id);
  }
}

function exportPdf() {
  alert("Exporting laminating rates as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}
</script>
