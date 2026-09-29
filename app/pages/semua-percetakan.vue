<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Percetakan List</h4>
            <h6>Manage registered printing vendors and partners</h6>
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
      </div>

      <!-- Dashboard Stats Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
              <i class="ti ti-printer fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Percetakan</div>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-success bg-opacity-10 text-success rounded-3">
              <i class="ti ti-check fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Subscribed</div>
              <h4 class="mb-0 fw-bold">4,385</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-danger bg-opacity-10 text-danger rounded-3">
              <i class="ti ti-x fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Unsubscribed</div>
              <h4 class="mb-0 fw-bold">3,000</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
              <i class="ti ti-clock fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Expired</div>
              <h4 class="mb-0 fw-bold">1,385</h4>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-info bg-opacity-10 text-info rounded-3">
              <i class="ti ti-color-swatch fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Cetak</div>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-secondary bg-opacity-10 text-secondary rounded-3">
              <i class="ti ti-layers-subtract fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Laminasi</div>
              <h4 class="mb-0 fw-bold">4,385</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
              <i class="ti ti-cut fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Pond</div>
              <h4 class="mb-0 fw-bold">3,000</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
              <i class="ti ti-sparkles fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Poli</div>
              <h4 class="mb-0 fw-bold">1,385</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search percetakan or location..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterSubscription" class="form-select form-select-sm" style="width: auto">
                <option value="">All Subscriptions</option>
                <option value="Yes">Subscription: Yes</option>
                <option value="No">Subscription: No</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Percetakan</th>
                  <th>Alamat</th>
                  <th>Join</th>
                  <th>Subscription</th>
                  <th>Whatsapp</th>
                  <th class="text-center">Kertas</th>
                  <th class="text-center">Cetak</th>
                  <th class="text-center">Laminasi</th>
                  <th class="text-center">Pond</th>
                  <th class="text-center">Poli</th>
                  <th>Header Capabilities</th>
                  <th class="text-center" style="width: 120px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vendor in filteredList" :key="vendor.id">
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img
                        :src="vendor.avatar"
                        alt="percetakan"
                        class="rounded-circle"
                        style="width: 38px; height: 38px; object-fit: cover"
                      />
                      <span class="fw-bold text-dark">{{ vendor.name }}</span>
                    </div>
                  </td>
                  <td class="text-muted small">{{ vendor.address }}</td>
                  <td class="small">{{ vendor.joinDate }}</td>
                  <td>
                    <span :class="vendor.subscribed ? 'badge bg-success' : 'badge bg-secondary'">
                      {{ vendor.subscribed ? "Yes" : "No" }}
                    </span>
                  </td>
                  <td class="small">
                    <a
                      :href="'https://wa.me/' + vendor.whatsapp.replace(/[^0-9]/g, '')"
                      target="_blank"
                      class="text-decoration-none text-success"
                    >
                      <i class="ti ti-brand-whatsapp me-1"></i>{{ vendor.whatsapp }}
                    </a>
                  </td>
                  <td class="text-center">{{ vendor.counts.kertas }}</td>
                  <td class="text-center">{{ vendor.counts.cetak }}</td>
                  <td class="text-center">{{ vendor.counts.laminasi }}</td>
                  <td class="text-center">{{ vendor.counts.pond }}</td>
                  <td class="text-center">{{ vendor.counts.poli }}</td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <span
                        v-for="cap in vendor.capabilities"
                        :key="cap"
                        class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25"
                      >
                        {{ cap }}
                      </span>
                    </div>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-info" title="Detail" @click="viewDetail(vendor)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-warning" title="Manage / Action" @click="openManageModal(vendor)">
                        <i class="ti ti-settings"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteVendor(vendor.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="12" class="text-center py-4 text-muted">No percetakan found matching your criteria.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Percetakan Modal -->
    <div v-if="manageModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Manage Percetakan: {{ selectedVendor?.name }}</h5>
            <button type="button" class="btn-close" @click="manageModalVisible = false"></button>
          </div>
          <form @submit.prevent="submitManage">
            <div class="modal-body pt-0">
              <p class="text-muted small mb-3">
                Pilih tindakan yang akan dilakukan terhadap percetakan ini. Anda bisa mengirim peringatan, mem-ban, atau
                membekukan sementara akun.
              </p>

              <div class="mb-3">
                <label class="form-label">Tindakan <span class="text-danger">*</span></label>
                <select v-model="manageForm.actionType" class="form-select" required>
                  <option value="warning">Peringatan</option>
                  <option value="ban">Ban Permanen</option>
                  <option value="freeze">Bekukan Sementara</option>
                </select>
              </div>

              <div v-if="manageForm.actionType === 'freeze'" class="mb-3">
                <label class="form-label">Durasi Bekukan (hari) <span class="text-danger">*</span></label>
                <input
                  v-model.number="manageForm.freezeDays"
                  type="number"
                  min="1"
                  class="form-control"
                  placeholder="Masukkan jumlah hari"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Notifikasi</label>
                <select v-model="manageForm.notifyUsers" class="form-select">
                  <option value="no">Jangan kirim notifikasi</option>
                  <option value="whatsapp">Kirim notifikasi ke WhatsApp</option>
                  <option value="email">Kirim notifikasi via Email</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Pesan / Peringatan <span class="text-danger">*</span></label>
                <textarea
                  v-model="manageForm.message"
                  class="form-control"
                  rows="4"
                  placeholder="Tulis pesan/peringatan untuk percetakan..."
                  required
                ></textarea>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="manageModalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-warning">Submit Tindakan</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Informasi Percetakan</h5>
            <button type="button" class="btn-close" @click="detailModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedVendor">
            <div class="text-center mb-3">
              <img
                :src="selectedVendor.avatar"
                class="rounded-circle mb-2"
                style="width: 72px; height: 72px; object-fit: cover"
              />
              <h5 class="fw-bold mb-0">{{ selectedVendor.name }}</h5>
              <div class="text-muted small">{{ selectedVendor.address }}</div>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Status Langganan</span>
                <span :class="selectedVendor.subscribed ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ selectedVendor.subscribed ? "Active Subscription" : "Inactive" }}
                </span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Tanggal Bergabung</span>
                <span>{{ selectedVendor.joinDate }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">WhatsApp PIC</span>
                <span>{{ selectedVendor.whatsapp }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Total Listing Kertas</span>
                <span class="fw-bold">{{ selectedVendor.counts.kertas }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Mesin & Fasilitas</span>
                <span
                  >Cetak ({{ selectedVendor.counts.cetak }}), Laminasi ({{ selectedVendor.counts.laminasi }}), Pond ({{
                    selectedVendor.counts.pond
                  }}), Poli ({{ selectedVendor.counts.poli }})</span
                >
              </li>
            </ul>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="detailModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Percetakan List - Kacetak System",
});

interface PercetakanVendor {
  id: number;
  name: string;
  avatar: string;
  address: string;
  joinDate: string;
  subscribed: boolean;
  whatsapp: string;
  counts: {
    kertas: number;
    cetak: number;
    laminasi: number;
    pond: number;
    poli: number;
  };
  capabilities: string[];
}

const vendors = ref<PercetakanVendor[]>([
  {
    id: 1,
    name: "Percetakan Cahaya Abadi",
    avatar: "/assets/img/users/user-23.jpg",
    address: "Jakarta, Jakarta Barat, Palmerah",
    joinDate: "01/05/2025",
    subscribed: true,
    whatsapp: "081234567890",
    counts: { kertas: 150, cetak: 6, laminasi: 3, pond: 5, poli: 9 },
    capabilities: ["Berat Kertas", "Potong Kertas"],
  },
  {
    id: 2,
    name: "Sinar Digital Printing",
    avatar: "/assets/img/users/user-24.jpg",
    address: "Surabaya, Jawa Timur, Gubeng",
    joinDate: "10/03/2025",
    subscribed: true,
    whatsapp: "085678901234",
    counts: { kertas: 98, cetak: 4, laminasi: 2, pond: 3, poli: 7 },
    capabilities: ["Percetakan"],
  },
  {
    id: 3,
    name: "Bandung Offset Cemerlang",
    avatar: "/assets/img/users/user-31.jpg",
    address: "Bandung, Jawa Barat, Asia Afrika",
    joinDate: "28/07/2024",
    subscribed: true,
    whatsapp: "089678901234",
    counts: { kertas: 140, cetak: 6, laminasi: 2, pond: 5, poli: 7 },
    capabilities: ["Berat Kertas", "Pond", "Poli"],
  },
  {
    id: 4,
    name: "Percetakan Utama Selindo",
    avatar: "/assets/img/users/user-31.jpg",
    address: "Jakarta, Jakarta Timur, Jatinegara",
    joinDate: "17/09/2025",
    subscribed: true,
    whatsapp: "081598765432",
    counts: { kertas: 115, cetak: 5, laminasi: 3, pond: 4, poli: 6 },
    capabilities: ["Percetakan"],
  },
]);

const searchQuery = ref("");
const filterSubscription = ref("");

const filteredList = computed(() => {
  return vendors.value.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.whatsapp.includes(searchQuery.value);
    const matchSub =
      !filterSubscription.value ||
      (filterSubscription.value === "Yes" && v.subscribed) ||
      (filterSubscription.value === "No" && !v.subscribed);
    return matchSearch && matchSub;
  });
});

const manageModalVisible = ref(false);
const detailModalVisible = ref(false);
const selectedVendor = ref<PercetakanVendor | null>(null);

const manageForm = reactive({
  actionType: "warning",
  freezeDays: 7,
  notifyUsers: "whatsapp",
  message: "",
});

function openManageModal(vendor: PercetakanVendor) {
  selectedVendor.value = vendor;
  manageForm.actionType = "warning";
  manageForm.freezeDays = 7;
  manageForm.notifyUsers = "whatsapp";
  manageForm.message = "";
  manageModalVisible.value = true;
}

function viewDetail(vendor: PercetakanVendor) {
  selectedVendor.value = vendor;
  detailModalVisible.value = true;
}

function submitManage() {
  alert(`Tindakan "${manageForm.actionType}" berhasil diproses untuk ${selectedVendor.value?.name}`);
  manageModalVisible.value = false;
}

function deleteVendor(id: number) {
  if (confirm("Are you sure you want to remove this percetakan?")) {
    vendors.value = vendors.value.filter((v) => v.id !== id);
  }
}

function exportPdf() {
  alert("Exporting PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterSubscription.value = "";
}
</script>
