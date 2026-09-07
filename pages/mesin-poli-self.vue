<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Hot Stamping / Poly Foil</h4>
            <h6>Configure workshop foil stamping dies, per-cm rates, and setup minimums</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Poly Service
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search foil name..." />
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
                  <th>Nama Poly / Foil</th>
                  <th>Ukuran Max</th>
                  <th class="text-end">Tarif per cm²</th>
                  <th class="text-end">Ongkos Minim</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in filteredPolis" :key="p.id">
                  <td class="fw-bold text-dark">{{ p.name }}</td>
                  <td>
                    <span class="badge bg-light text-dark border font-monospace">{{ p.maxSize }}</span>
                  </td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(p.rateCm) }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(p.minim) }}</td>
                  <td>{{ p.update }}</td>
                  <td>
                    <span class="badge rounded" :class="p.status === 'Active' ? 'badge-success' : 'badge-secondary'">
                      • {{ p.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit Poly"
                        @click="openEditModal(p)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Poly"
                        @click="deletePoli(p.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPolis.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No poly services configured.</td>
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
            <h5 class="modal-title">{{ isEdit ? "Edit Poly Service" : "Add Poly Service" }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="savePoli">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Foil Name / Type <span class="text-danger">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="e.g. Standard Gold Foil, Silver, Hologram"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Max Stamping Area (cm)</label>
                  <input v-model="form.maxSize" type="text" class="form-control" placeholder="30×15 cm" />
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
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="poliActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? "Update Poly" : "Save Poly" }}
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

interface SelfPoli {
  id: number;
  name: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
  status: "Active" | "Deactive";
}

const polis = ref<SelfPoli[]>([
  {
    id: 1,
    name: "Poly Emas Standard (Gold)",
    maxSize: "30×15 cm",
    rateCm: 20,
    minim: 200000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 2,
    name: "Poly Perak (Silver)",
    maxSize: "30×15 cm",
    rateCm: 18,
    minim: 180000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 3,
    name: "Hologram Hot Stamp",
    maxSize: "30×15 cm",
    rateCm: 35,
    minim: 300000,
    update: "20/12/24 23:12",
    status: "Deactive",
  },
  {
    id: 4,
    name: "Rose Gold Metallic",
    maxSize: "30×20 cm",
    rateCm: 28,
    minim: 250000,
    update: "22/12/24 14:00",
    status: "Active",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("");
const statusDropdownOpen = ref(false);

const filteredPolis = computed(() => {
  return polis.value.filter((p) => {
    const matchStatus = !filterStatus.value || p.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.maxSize.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const modalVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  name: "",
  maxSize: "30×15 cm",
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
    maxSize: "30×15 cm",
    rateCm: 20,
    minim: 200000,
    status: "Active",
  };
  modalVisible.value = true;
}

function openEditModal(p: SelfPoli) {
  isEdit.value = true;
  currentId.value = p.id;
  form.value = { ...p };
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function savePoli() {
  const now =
    new Date().toLocaleDateString("en-GB") + " " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (isEdit.value && currentId.value !== null) {
    const idx = polis.value.findIndex((p) => p.id === currentId.value);
    if (idx !== -1) {
      polis.value[idx] = { ...polis.value[idx], ...form.value, update: now };
    }
  } else {
    const newId = polis.value.length ? Math.max(...polis.value.map((p) => p.id)) + 1 : 1;
    polis.value.unshift({ id: newId, ...form.value, update: now });
  }
  closeModal();
}

function deletePoli(id: number) {
  if (confirm("Are you sure you want to delete this poly service?")) {
    polis.value = polis.value.filter((p) => p.id !== id);
  }
}

function exportPdf() {
  alert("Exporting poly rates as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}
</script>
