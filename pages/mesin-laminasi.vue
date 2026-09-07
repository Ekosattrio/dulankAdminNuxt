<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Laminating Machines (Marketplace)</h4>
            <h6>Directory of laminating and coating capabilities across vendor networks</h6>
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
          <NuxtLink to="/mesin-laminasi-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Mesin Laminasi Sendiri
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
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search laminating type or partner..."
                />
              </div>
            </div>
          </div>

          <div class="table-responsive mb-4">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Sumber Percetakan</th>
                  <th>Jenis Laminasi</th>
                  <th>Ukuran Max</th>
                  <th class="text-end">Tarif per cm²</th>
                  <th class="text-end">Ongkos Minim</th>
                  <th>Last Update</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="l in filteredLaminates" :key="l.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="l.avatar"
                        :alt="l.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 34px; height: 34px"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ l.sumber }}</span>
                        <span class="text-muted fs-11">{{ l.lokasi }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="fw-bold text-dark">{{ l.name }}</td>
                  <td>
                    <span class="badge bg-light text-dark border font-monospace">{{ l.maxSize }}</span>
                  </td>
                  <td class="text-end fw-semibold">Rp {{ formatNumber(l.rateCm) }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(l.minim) }}</td>
                  <td>{{ l.update }}</td>
                  <td>
                    <span class="badge bg-success me-1">Publish</span>
                    <span class="badge bg-info">Active</span>
                  </td>
                </tr>
                <tr v-if="filteredLaminates.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No laminating services found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface VendorLaminate {
  id: number;
  sumber: string;
  lokasi: string;
  avatar: string;
  name: string;
  maxSize: string;
  rateCm: number;
  minim: number;
  update: string;
}

const laminates = ref<VendorLaminate[]>([
  {
    id: 1,
    sumber: "Percetakan Cahaya Abadi",
    lokasi: "Jakarta Barat",
    avatar: "/assets/img/users/user-23.jpg",
    name: "Laminasi Thermal Doff 1 Sisi",
    maxSize: "65 x 100 cm",
    rateCm: 22,
    minim: 220000,
    update: "12/10/24 10:00",
  },
  {
    id: 2,
    sumber: "Sinar Digital Printing",
    lokasi: "Surabaya",
    avatar: "/assets/img/users/user-24.jpg",
    name: "Laminasi Thermal Glossy 1 Sisi",
    maxSize: "65 x 100 cm",
    rateCm: 20,
    minim: 200000,
    update: "12/10/24 11:30",
  },
  {
    id: 3,
    sumber: "Mitra Grafika Gemilang",
    lokasi: "Bandung",
    avatar: "/assets/img/users/user-25.jpg",
    name: "UV Varnish Coating",
    maxSize: "72 x 102 cm",
    rateCm: 12,
    minim: 120000,
    update: "12/10/24 14:15",
  },
  {
    id: 4,
    sumber: "Aneka Surya Offset",
    lokasi: "Semarang",
    avatar: "/assets/img/users/user-26.jpg",
    name: "Spot UV Screen",
    maxSize: "52 x 72 cm",
    rateCm: 35,
    minim: 300000,
    update: "12/10/24 16:00",
  },
]);

const searchQuery = ref("");

const filteredLaminates = computed(() => {
  return laminates.value.filter((l) => {
    return (
      !searchQuery.value ||
      l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function exportPdf() {
  alert("Exporting laminating rates as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
}
</script>
