<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Internal Die Cut / Pond Machinery</h4>
            <h6>Configure workshop creasing, embossing, and kiss-cutting machines and pricing models</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Pond Machine
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search die-cut machine name..." />
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
                  <th>Nama Mesin Pond</th>
                  <th>Ukuran Max (mm)</th>
                  <th>Pond Putus (Full Cut)</th>
                  <th>Setengah Putus (Kiss Cut)</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in filteredPonds" :key="p.id">
                  <td class="fw-bold text-dark">{{ p.name }}</td>
                  <td>
                    <span class="badge bg-light text-dark border font-monospace">{{ p.maxSize }}</span>
                  </td>
                  <td>
                    <span class="d-block text-dark fw-semibold">Rp {{ formatNumber(p.putusRate) }} / lbr</span>
                    <span class="text-muted small">Minim: Rp {{ formatNumber(p.putusMinim) }}</span>
                  </td>
                  <td>
                    <span class="d-block text-dark fw-semibold">Rp {{ formatNumber(p.kissRate) }} / lbr</span>
                    <span class="text-muted small">Minim: Rp {{ formatNumber(p.kissMinim) }}</span>
                  </td>
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
                        title="Edit Machine"
                        @click="openEditModal(p)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete Machine"
                        @click="deletePond(p.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredPonds.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No die-cut machines configured.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" style="background-color: rgba(0, 0, 0, 0.5)" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? "Edit Pond Machine" : "Add Pond Machine" }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="savePond">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Machine Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Mesin Pond PYQ 65" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Max Bed Size (mm) <span class="text-danger">*</span></label>
                  <input v-model="form.maxSize" type="text" class="form-control" required placeholder="650 x 900 mm" />
                </div>

                <!-- Pond Putus Specs -->
                <div class="col-md-6">
                  <label class="form-label">Pond Putus: Tarif per Lembar (Rp)</label>
                  <input v-model.number="form.putusRate" type="number" class="form-control" placeholder="50" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Pond Putus: Minim Ongkos (Rp)</label>
                  <input v-model.number="form.putusMinim" type="number" class="form-control" placeholder="50000" />
                </div>

                <!-- Kiss Cut Specs -->
                <div class="col-md-6">
                  <label class="form-label">Setengah Putus (Kiss-cut): Tarif per Lembar (Rp)</label>
                  <input v-model.number="form.kissRate" type="number" class="form-control" placeholder="100" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Setengah Putus: Minim Ongkos (Rp)</label>
                  <input v-model.number="form.kissMinim" type="number" class="form-control" placeholder="100000" />
                </div>

                <div class="col-md-6">
                  <div class="d-flex align-items-center my-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input v-model="formActive" class="form-check-input" type="checkbox" role="switch" id="pondActiveSwitch" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? "Update Machine" : "Save Machine" }}
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

interface SelfPond {
  id: number;
  name: string;
  maxSize: string;
  putusRate: number;
  putusMinim: number;
  kissRate: number;
  kissMinim: number;
  update: string;
  status: "Active" | "Deactive";
}

const ponds = ref<SelfPond[]>([
  {
    id: 1,
    name: "PYQ 650",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 2,
    name: "ML900 Platen",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "20/12/24 23:12",
    status: "Active",
  },
  {
    id: 3,
    name: "PYQ 660 Heavy Duty",
    maxSize: "750 x 1050 mm",
    putusRate: 65,
    putusMinim: 75000,
    kissRate: 120,
    kissMinim: 120000,
    update: "20/12/24 23:12",
    status: "Deactive",
  },
]);

const searchQuery = ref("");
const filterStatus = ref("");
const statusDropdownOpen = ref(false);

const filteredPonds = computed(() => {
  return ponds.value.filter((p) => {
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
  maxSize: "650 x 900 mm",
  putusRate: 50,
  putusMinim: 50000,
  kissRate: 100,
  kissMinim: 100000,
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
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    status: "Active",
  };
  modalVisible.value = true;
}

function openEditModal(p: SelfPond) {
  isEdit.value = true;
  currentId.value = p.id;
  form.value = { ...p };
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function savePond() {
  const now =
    new Date().toLocaleDateString("en-GB") + " " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (isEdit.value && currentId.value !== null) {
    const idx = ponds.value.findIndex((p) => p.id === currentId.value);
    if (idx !== -1) {
      ponds.value[idx] = { ...ponds.value[idx], ...form.value, update: now };
    }
  } else {
    const newId = ponds.value.length ? Math.max(...ponds.value.map((p) => p.id)) + 1 : 1;
    ponds.value.unshift({ id: newId, ...form.value, update: now });
  }
  closeModal();
}

function deletePond(id: number) {
  if (confirm("Are you sure you want to delete this die-cut machine?")) {
    ponds.value = ponds.value.filter((p) => p.id !== id);
  }
}

function exportPdf() {
  alert("Exporting pond machines as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterStatus.value = "";
}
</script>
