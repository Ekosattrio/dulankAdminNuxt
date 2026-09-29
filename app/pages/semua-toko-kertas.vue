<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Toko Kertas List</h4>
            <h6>Manage registered paper suppliers and merchant partners</h6>
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
              <i class="ti ti-building-store fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Stores</div>
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
              <i class="ti ti-file-text fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Katalog Kertas</div>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-secondary bg-opacity-10 text-secondary rounded-3">
              <i class="ti ti-folder fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Paper Group</div>
              <h4 class="mb-0 fw-bold">4,385</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
              <i class="ti ti-dimensions fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Ukuran Plano</div>
              <h4 class="mb-0 fw-bold">3,000</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
              <i class="ti ti-tag fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Jenis Kertas</div>
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search toko kertas or address..." />
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
                  <th>Toko Kertas</th>
                  <th>Alamat</th>
                  <th>Join</th>
                  <th>Subscription</th>
                  <th class="text-center">Kertas</th>
                  <th class="text-center">Group</th>
                  <th class="text-center">Ukuran</th>
                  <th class="text-center">Jenis</th>
                  <th class="text-center" style="width: 120px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="shop in filteredList" :key="shop.id">
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img
                        :src="shop.avatar"
                        alt="toko kertas"
                        class="rounded-circle"
                        style="width: 38px; height: 38px; object-fit: cover"
                      />
                      <span class="fw-bold text-dark">{{ shop.name }}</span>
                    </div>
                  </td>
                  <td class="text-muted small">{{ shop.address }}</td>
                  <td class="small">{{ shop.joinDate }}</td>
                  <td>
                    <span :class="shop.subscribed ? 'badge bg-success' : 'badge bg-secondary'">
                      {{ shop.subscribed ? "Yes" : "No" }}
                    </span>
                  </td>
                  <td class="text-center fw-semibold">{{ shop.counts.kertas }}</td>
                  <td class="text-center">{{ shop.counts.group }}</td>
                  <td class="text-center">{{ shop.counts.ukuran }}</td>
                  <td class="text-center">{{ shop.counts.jenis }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-info" title="Detail" @click="viewDetail(shop)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-warning" title="Manage / Action" @click="openManageModal(shop)">
                        <i class="ti ti-settings"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteShop(shop.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No paper merchant found matching your criteria.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Shop Modal -->
    <div v-if="manageModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Manage Toko Kertas: {{ selectedShop?.name }}</h5>
            <button type="button" class="btn-close" @click="manageModalVisible = false"></button>
          </div>
          <form @submit.prevent="submitManage">
            <div class="modal-body pt-0">
              <p class="text-muted small mb-3">
                Pilih tindakan yang akan dilakukan terhadap toko kertas ini. Anda bisa mengirim peringatan, mem-ban, atau
                membekukan akun sementara.
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
                  placeholder="Tulis pesan/peringatan untuk toko kertas..."
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
            <h5 class="modal-title font-bold">Informasi Toko Kertas</h5>
            <button type="button" class="btn-close" @click="detailModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedShop">
            <div class="text-center mb-3">
              <img :src="selectedShop.avatar" class="rounded-circle mb-2" style="width: 72px; height: 72px; object-fit: cover" />
              <h5 class="fw-bold mb-0">{{ selectedShop.name }}</h5>
              <div class="text-muted small">{{ selectedShop.address }}</div>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Status Langganan</span>
                <span :class="selectedShop.subscribed ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ selectedShop.subscribed ? "Active Subscription" : "Inactive" }}
                </span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Tanggal Bergabung</span>
                <span>{{ selectedShop.joinDate }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Total Listing Kertas</span>
                <span class="fw-bold">{{ selectedShop.counts.kertas }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Paper Groups</span>
                <span>{{ selectedShop.counts.group }} Groups</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Varian Ukuran</span>
                <span>{{ selectedShop.counts.ukuran }} Plano</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Jenis Bahan Kertas</span>
                <span>{{ selectedShop.counts.jenis }} Jenis</span>
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
  title: "Toko Kertas List - Kacetak System",
});

interface TokoKertas {
  id: number;
  name: string;
  avatar: string;
  address: string;
  joinDate: string;
  subscribed: boolean;
  counts: {
    kertas: number;
    group: number;
    ukuran: number;
    jenis: number;
  };
}

const shops = ref<TokoKertas[]>([
  {
    id: 1,
    name: "Toko Kertasindo",
    avatar: "/assets/img/users/user-23.jpg",
    address: "Jakarta, Jakarta Pusat, Kemayoran",
    joinDate: "15/12/2025",
    subscribed: true,
    counts: { kertas: 117, group: 114, ukuran: 197, jenis: 4 },
  },
  {
    id: 2,
    name: "Toko Paperindo",
    avatar: "/assets/img/users/user-24.jpg",
    address: "Bandung, Jawa Barat",
    joinDate: "15/12/2025",
    subscribed: true,
    counts: { kertas: 92, group: 95, ukuran: 65, jenis: 3 },
  },
  {
    id: 3,
    name: "Surabaya Kertas Utama",
    avatar: "/assets/img/users/user-31.jpg",
    address: "Surabaya, Jawa Timur, Rungkut",
    joinDate: "01/02/2025",
    subscribed: true,
    counts: { kertas: 145, group: 120, ukuran: 210, jenis: 5 },
  },
]);

const searchQuery = ref("");
const filterSubscription = ref("");

const filteredList = computed(() => {
  return shops.value.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchSub =
      !filterSubscription.value ||
      (filterSubscription.value === "Yes" && s.subscribed) ||
      (filterSubscription.value === "No" && !s.subscribed);
    return matchSearch && matchSub;
  });
});

const manageModalVisible = ref(false);
const detailModalVisible = ref(false);
const selectedShop = ref<TokoKertas | null>(null);

const manageForm = reactive({
  actionType: "warning",
  freezeDays: 7,
  notifyUsers: "whatsapp",
  message: "",
});

function openManageModal(shop: TokoKertas) {
  selectedShop.value = shop;
  manageForm.actionType = "warning";
  manageForm.freezeDays = 7;
  manageForm.notifyUsers = "whatsapp";
  manageForm.message = "";
  manageModalVisible.value = true;
}

function viewDetail(shop: TokoKertas) {
  selectedShop.value = shop;
  detailModalVisible.value = true;
}

function submitManage() {
  alert(`Tindakan "${manageForm.actionType}" berhasil diproses untuk ${selectedShop.value?.name}`);
  manageModalVisible.value = false;
}

function deleteShop(id: number) {
  if (confirm("Are you sure you want to remove this paper merchant?")) {
    shops.value = shops.value.filter((s) => s.id !== id);
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
