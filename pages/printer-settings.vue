<template>
  <div class="page-wrapper">
    <div class="content settings-content">
      <div class="page-header settings-pg-header mt-3">
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
            <div class="settings-page-wrap w-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="setting-title mb-0">
                  <h4 class="fs-18 fw-bold">Printer Settings</h4>
                </div>
                <button class="btn btn-added" @click="openAddModal"><i class="ti ti-plus me-1"></i> Add New Printer</button>
              </div>

              <div class="card table-list-card border shadow-sm">
                <div class="card-body">
                  <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div class="search-set d-block d-md-flex align-items-center gap-2">
                      <div class="search-input position-relative">
                        <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Printer..." />
                      </div>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table datanew">
                      <thead>
                        <tr>
                          <th>Printer Name</th>
                          <th>Connection Type</th>
                          <th>IP Address</th>
                          <th>Port</th>
                          <th class="text-end no-sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(p, idx) in filteredPrinters" :key="idx">
                          <td class="fw-semibold text-dark">{{ p.name }}</td>
                          <td>
                            <span class="badge bg-light-primary text-primary">{{ p.connectionType }}</span>
                          </td>
                          <td class="font-mono text-sm">{{ p.ipAddress }}</td>
                          <td>{{ p.port }}</td>
                          <td class="action-table-data text-end">
                            <div class="edit-delete-action d-inline-flex gap-2">
                              <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(p)">
                                <i class="ti ti-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deletePrinter(idx)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="filteredPrinters.length === 0">
                          <td colspan="5" class="text-center py-4 text-muted">No printers configured.</td>
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

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? "Edit Printer" : "Add Printer" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="savePrinter">
                <div class="mb-3">
                  <label class="form-label">Printer Name</label>
                  <input
                    v-model="currentPrinter.name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="e.g. Epson TM-T82"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Connection Type</label>
                  <select v-model="currentPrinter.connectionType" class="form-select">
                    <option value="Network">Network (LAN/Wi-Fi)</option>
                    <option value="USB">USB Direct</option>
                    <option value="Bluetooth">Bluetooth</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">IP Address</label>
                  <input v-model="currentPrinter.ipAddress" type="text" class="form-control" placeholder="192.168.1.100" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Port</label>
                  <input v-model="currentPrinter.port" type="text" class="form-control" placeholder="9100" />
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
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
  title: "Printer Settings - Kacetak System",
});

const searchQuery = ref("");
const showModal = ref(false);
const isEditing = ref(false);

interface PrinterItem {
  id?: number;
  name: string;
  connectionType: string;
  ipAddress: string;
  port: string;
}

const printers = ref<PrinterItem[]>([
  { id: 1, name: "HP LaserJet Pro MFP", connectionType: "Network", ipAddress: "192.168.1.22", port: "9100" },
  { id: 2, name: "Epson TM-T82 Thermal POS", connectionType: "Network", ipAddress: "192.168.1.25", port: "9100" },
  { id: 3, name: "Canon imagePRESS C650", connectionType: "Network", ipAddress: "192.168.1.50", port: "9100" },
]);

const currentPrinter = ref<PrinterItem>({
  name: "",
  connectionType: "Network",
  ipAddress: "",
  port: "9100",
});

const filteredPrinters = computed(() => {
  return printers.value.filter((p) => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const openAddModal = () => {
  isEditing.value = false;
  currentPrinter.value = {
    name: "",
    connectionType: "Network",
    ipAddress: "",
    port: "9100",
  };
  showModal.value = true;
};

const openEditModal = (p: PrinterItem) => {
  isEditing.value = true;
  currentPrinter.value = { ...p };
  showModal.value = true;
};

const savePrinter = () => {
  if (isEditing.value) {
    const idx = printers.value.findIndex((p) => p.id === currentPrinter.value.id);
    if (idx !== -1) {
      printers.value[idx] = { ...currentPrinter.value };
    }
  } else {
    printers.value.unshift({
      id: Date.now(),
      ...currentPrinter.value,
    });
  }
  showModal.value = false;
};

const deletePrinter = (idx: number) => {
  if (confirm("Are you sure you want to delete this printer?")) {
    printers.value.splice(idx, 1);
  }
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
