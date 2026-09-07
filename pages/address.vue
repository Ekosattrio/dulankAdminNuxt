<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Address List</h4>
            <h6>Manage Customer & Supplier Addresses</h6>
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

      <!-- KPI Widgets -->
      <div class="row mt-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Address</h6>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-primary rounded-circle">
              <i class="ti ti-map-pin fs-24 text-primary"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Province</h6>
              <h4 class="mb-0 fw-bold text-success">4,385</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-success rounded-circle">
              <i class="ti ti-world fs-24 text-success"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total City</h6>
              <h4 class="mb-0 fw-bold text-info">3,855</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-info rounded-circle">
              <i class="ti ti-building fs-24 text-info"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Pos Code</h6>
              <h4 class="mb-0 fw-bold text-warning">4,000</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-warning rounded-circle">
              <i class="ti ti-mailbox fs-24 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="tabs-set mb-3">
            <ul class="nav nav-tabs border-bottom">
              <li class="nav-item">
                <button
                  class="nav-link py-2 px-4"
                  :class="{ active: activeTab === 'customers' }"
                  @click="activeTab = 'customers'"
                >
                  <i class="ti ti-users me-1"></i> Customers
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link py-2 px-4" :class="{ active: activeTab === 'supplier' }" @click="activeTab = 'supplier'">
                  <i class="ti ti-truck me-1"></i> Supplier
                </button>
              </li>
            </ul>
          </div>

          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Address, Name or Contact..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="selectedStatus" class="form-select form-select-sm" style="min-width: 140px">
                <option value="">All Statuses</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>ID Address</th>
                  <th>ID Entity</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Province</th>
                  <th>City</th>
                  <th>District</th>
                  <th>Detail Address</th>
                  <th>Other Detail</th>
                  <th>Tag / Type</th>
                  <th>Date</th>
                  <th class="text-end no-sort">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(addr, idx) in currentList" :key="idx">
                  <td class="fw-semibold text-primary">{{ addr.id }}</td>
                  <td>{{ addr.entityId }}</td>
                  <td class="fw-semibold text-dark">{{ addr.name }}</td>
                  <td>{{ addr.contact }}</td>
                  <td>{{ addr.province }}</td>
                  <td>{{ addr.city }}</td>
                  <td>{{ addr.district }}</td>
                  <td class="text-truncate" style="max-width: 180px">{{ addr.detail }}</td>
                  <td class="text-muted text-xs">{{ addr.otherDetail }}</td>
                  <td>
                    <span class="badge bg-outline-primary">{{ addr.tag }}</span>
                  </td>
                  <td>{{ addr.date }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-info p-1" title="View" @click="viewAddress(addr)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="editAddress(addr)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteAddress(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="currentList.length === 0">
                  <td colspan="12" class="text-center py-4 text-muted">No addresses found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- View/Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isViewing ? "Address Details" : "Edit Address" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveAddress">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Address ID</label>
                    <input v-model="selectedAddr.id" type="text" class="form-control" disabled />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Recipient / Entity Name</label>
                    <input v-model="selectedAddr.name" type="text" class="form-control" :disabled="isViewing" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Contact Number</label>
                    <input v-model="selectedAddr.contact" type="text" class="form-control" :disabled="isViewing" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Tag / Type</label>
                    <select v-model="selectedAddr.tag" class="form-select" :disabled="isViewing">
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Province</label>
                    <input v-model="selectedAddr.province" type="text" class="form-control" :disabled="isViewing" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">City</label>
                    <input v-model="selectedAddr.city" type="text" class="form-control" :disabled="isViewing" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">District</label>
                    <input v-model="selectedAddr.district" type="text" class="form-control" :disabled="isViewing" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Detail Address</label>
                    <textarea v-model="selectedAddr.detail" class="form-control" rows="2" :disabled="isViewing"></textarea>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Other Detail / Landmark</label>
                    <input v-model="selectedAddr.otherDetail" type="text" class="form-control" :disabled="isViewing" />
                  </div>
                </div>
                <div class="modal-footer modal-action-footer justify-content-end mt-4 pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">
                    {{ isViewing ? "Close" : "Cancel" }}
                  </button>
                  <button v-if="!isViewing" type="submit" class="btn btn-warning text-white">Save Changes</button>
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
  title: "Address List - Kacetak System",
});

const activeTab = ref<"customers" | "supplier">("customers");
const searchQuery = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isViewing = ref(false);

interface AddressItem {
  id: string;
  entityId: string;
  name: string;
  contact: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  otherDetail: string;
  tag: string;
  date: string;
}

const customerAddresses = ref<AddressItem[]>([
  {
    id: "ADR00000001",
    entityId: "ID000001",
    name: "Aditya Pratama",
    contact: "+6281234567890",
    province: "DKI Jakarta",
    city: "Jakarta Timur",
    district: "Kramat Jati",
    detail: "Perumahan Jati Asri, Kel. Dukuh",
    otherDetail: "Pagar hitam, depan masjid",
    tag: "Home",
    date: "02/12/2025 8:30",
  },
  {
    id: "ADR00000002",
    entityId: "ID000001",
    name: "Aditya Pratama",
    contact: "021-8091234",
    province: "DKI Jakarta",
    city: "Jakarta Pusat",
    district: "Gambir",
    detail: "Gedung Menara Puas jl. 5, Kel. Cideng",
    otherDetail: "Lobby Utama, Dekat Off",
    tag: "Office",
    date: "05/12/2025 10:15",
  },
  {
    id: "ADR00000003",
    entityId: "ID000002",
    name: "PT Maju Jaya",
    contact: "+6281298765432",
    province: "Jawa Barat",
    city: "Bandung",
    district: "Lengkong",
    detail: "Jl. Asia Afrika No. 108",
    otherDetail: "Gedung Kantor Lantai 3",
    tag: "Office",
    date: "06/12/2025 14:20",
  },
]);

const supplierAddresses = ref<AddressItem[]>([
  {
    id: "ADR00000101",
    entityId: "SUP00001",
    name: "PT Surya Kencana Paper",
    contact: "+6221-5551234",
    province: "Banten",
    city: "Tangerang",
    district: "Batuceper",
    detail: "Kawasan Industri Batuceper Blok C-5",
    otherDetail: "Gudang Utama No. 8",
    tag: "Warehouse",
    date: "01/11/2025 09:00",
  },
]);

const selectedAddr = ref<AddressItem>({
  id: "",
  entityId: "",
  name: "",
  contact: "",
  province: "",
  city: "",
  district: "",
  detail: "",
  otherDetail: "",
  tag: "Home",
  date: "",
});

const currentList = computed(() => {
  const list = activeTab.value === "customers" ? customerAddresses.value : supplierAddresses.value;
  return list.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchQ =
      item.name.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.contact.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q);
    const matchStatus = !selectedStatus.value || item.tag === selectedStatus.value;
    return matchQ && matchStatus;
  });
});

const viewAddress = (addr: AddressItem) => {
  isViewing.value = true;
  selectedAddr.value = { ...addr };
  showModal.value = true;
};

const editAddress = (addr: AddressItem) => {
  isViewing.value = false;
  selectedAddr.value = { ...addr };
  showModal.value = true;
};

const saveAddress = () => {
  const targetList = activeTab.value === "customers" ? customerAddresses.value : supplierAddresses.value;
  const idx = targetList.findIndex((a) => a.id === selectedAddr.value.id);
  if (idx !== -1) {
    targetList[idx] = { ...selectedAddr.value };
  }
  showModal.value = false;
};

const deleteAddress = (idx: number) => {
  if (confirm("Are you sure you want to delete this address?")) {
    const targetList = activeTab.value === "customers" ? customerAddresses.value : supplierAddresses.value;
    targetList.splice(idx, 1);
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
