<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Die Cut / Pond Machines (Marketplace)</h4>
            <h6>Network directory of die-cutting, creasing, and kiss-cut capabilities</h6>
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
          <NuxtLink to="/mesin-pond-self" class="btn btn-outline-primary me-2">
            <i class="ti ti-building-warehouse me-1"></i>Kelola Mesin Pond Sendiri
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
                  placeholder="Search die-cut machine or partner..."
                />
              </div>
            </div>
          </div>

          <div class="table-responsive mb-4">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Sumber Percetakan</th>
                  <th>Nama Mesin</th>
                  <th>Ukuran Max</th>
                  <th>Pond Putus (Per Lbr / Minim)</th>
                  <th>Setengah Putus (Kiss-cut)</th>
                  <th>Last Update</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in filteredPonds" :key="p.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="p.avatar"
                        :alt="p.sumber"
                        class="rounded-circle me-2 border object-fit-cover"
                        style="width: 34px; height: 34px"
                      />
                      <div>
                        <span class="fw-semibold text-dark d-block">{{ p.sumber }}</span>
                        <span class="text-muted fs-11">{{ p.lokasi }}</span>
                      </div>
                    </div>
                  </td>
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
                    <span class="badge bg-success me-1">Publish</span>
                    <span class="badge bg-info">Active</span>
                  </td>
                </tr>
                <tr v-if="filteredPonds.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No die-cut machines found.</td>
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

interface VendorPond {
  id: number;
  sumber: string;
  lokasi: string;
  avatar: string;
  name: string;
  maxSize: string;
  putusRate: number;
  putusMinim: number;
  kissRate: number;
  kissMinim: number;
  update: string;
}

const ponds = ref<VendorPond[]>([
  {
    id: 1,
    sumber: "Percetakan Cahaya Abadi",
    lokasi: "Jakarta Barat",
    avatar: "/assets/img/users/user-23.jpg",
    name: "Mesin Pond PYQ 650",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "18/10/24 10:00",
  },
  {
    id: 2,
    sumber: "Sinar Digital Printing",
    lokasi: "Surabaya",
    avatar: "/assets/img/users/user-24.jpg",
    name: "Mesin Pond ML900",
    maxSize: "650 x 900 mm",
    putusRate: 50,
    putusMinim: 50000,
    kissRate: 100,
    kissMinim: 100000,
    update: "18/10/24 11:30",
  },
  {
    id: 3,
    sumber: "Mitra Grafika Gemilang",
    lokasi: "Bandung",
    avatar: "/assets/img/users/user-25.jpg",
    name: "Mesin Pond Automatic TYMB",
    maxSize: "750 x 1050 mm",
    putusRate: 65,
    putusMinim: 75000,
    kissRate: 120,
    kissMinim: 120000,
    update: "18/10/24 14:15",
  },
]);

const searchQuery = ref("");

const filteredPonds = computed(() => {
  return ponds.value.filter((p) => {
    return (
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function exportPdf() {
  alert("Exporting die-cut rates as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
}
</script>
