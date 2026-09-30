<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Printing Presses (Marketplace)</h4>
            <h6>Directory of offset and digital printing machines from partner print houses</h6>
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
          <NuxtLink to="/mesin-cetak-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Mesin Sendiri
          </NuxtLink>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search press name or partner..." />
              </div>
            </div>
          </div>

          <div class="table-responsive mb-4">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Sumber Percetakan</th>
                  <th>Nama Mesin & Warna</th>
                  <th>Ongkos Cetak (Minim & Druck)</th>
                  <th>Last Update</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in filteredMachines" :key="m.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="m.avatar"
                        :alt="m.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 36px; height: 36px"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ m.sumber }}</span>
                        <span class="text-muted fs-11">{{ m.lokasi }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="fw-bold text-dark d-block">{{ m.name }}</span>
                    <span class="badge bg-light text-dark border">{{ m.colors }} Warna</span>
                  </td>
                  <td>
                    <span class="d-block text-dark fw-semibold">Minim: Rp {{ formatNumber(m.minim) }}</span>
                    <span class="text-muted small">Druck: Rp {{ formatNumber(m.druck) }} / lbr</span>
                  </td>
                  <td>{{ m.update }}</td>
                  <td>
                    <span class="badge bg-success me-1">Publish</span>
                    <span class="badge bg-info">Active</span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="View details"
                        @click="viewDetails(m)"
                      >
                        <i class="ti ti-eye fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMachines.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">No printing presses found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: mesinCetakData } = await useFetch<VendorPress[]>('/api/mesin-cetak')
const machines = ref<VendorPress[]>(mesinCetakData.value ?? [])
useMockSync('mesin-cetak', machines);

const searchQuery = ref("");

const filteredMachines = computed(() => {
  return machines.value.filter((m) => {
    return (
      !searchQuery.value ||
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function viewDetails(m: VendorPress) {
  alert(`Press: ${m.name} (${m.colors} Colors) - Min Charge: Rp ${formatNumber(m.minim)}, Druck: Rp ${formatNumber(m.druck)}`);
}

function exportPdf() {
  alert("Exporting printing presses as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
}</script>
