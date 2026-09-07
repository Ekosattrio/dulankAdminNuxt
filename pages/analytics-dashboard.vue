<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Analytics Dashboard</h4>
            <h6>Website Traffic & System Performance Metrics</h6>
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

      <!-- Top Stats Widgets -->
      <div class="row mt-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h5 class="mb-1 fw-bold fs-20">13,647</h5>
              <h6 class="text-muted text-sm mb-1">Page Views</h6>
              <span class="text-success small d-flex align-items-center gap-1">
                <i class="ti ti-arrow-up-right"></i> 2.3% <span class="text-muted ms-1">Last Month</span>
              </span>
            </div>
            <div class="dash-widgetimg p-3 bg-light-success rounded-circle">
              <i class="ti ti-eye fs-24 text-success"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h5 class="mb-1 fw-bold fs-20">9,526</h5>
              <h6 class="text-muted text-sm mb-1">Clicks</h6>
              <span class="text-success small d-flex align-items-center gap-1">
                <i class="ti ti-arrow-up-right"></i> 8.1% <span class="text-muted ms-1">Last Month</span>
              </span>
            </div>
            <div class="dash-widgetimg p-3 bg-light-info rounded-circle">
              <i class="ti ti-pointer fs-24 text-info"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h5 class="mb-1 fw-bold fs-20">976</h5>
              <h6 class="text-muted text-sm mb-1">Conversions</h6>
              <span class="text-danger small d-flex align-items-center gap-1">
                <i class="ti ti-arrow-down-right"></i> 0.3% <span class="text-muted ms-1">Last Month</span>
              </span>
            </div>
            <div class="dash-widgetimg p-3 bg-light-primary rounded-circle">
              <i class="ti ti-layers-union fs-24 text-primary"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h5 class="mb-1 fw-bold fs-20">1,248</h5>
              <h6 class="text-muted text-sm mb-1">New Users</h6>
              <span class="text-danger small d-flex align-items-center gap-1">
                <i class="ti ti-arrow-down-right"></i> 10.6% <span class="text-muted ms-1">Last Month</span>
              </span>
            </div>
            <div class="dash-widgetimg p-3 bg-light-warning rounded-circle">
              <i class="ti ti-user-plus fs-24 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Conversion -->
      <div class="row mb-4">
        <!-- Conversions Donut -->
        <div class="col-xl-4 col-md-6 col-12 mb-3">
          <div class="card h-100 border shadow-sm">
            <div class="card-body d-flex flex-column justify-content-between">
              <h6 class="fw-bold mb-3">Conversions Breakdown</h6>
              <div class="text-center my-3">
                <div class="position-relative d-inline-block">
                  <svg width="140" height="140" viewBox="0 0 36 36" class="circular-chart">
                    <path
                      class="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      stroke-width="3.8"
                    />
                    <path
                      class="circle"
                      stroke-dasharray="65.2, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#ff9f43"
                      stroke-width="3.8"
                    />
                  </svg>
                  <div class="position-absolute top-50 start-50 translate-middle text-center">
                    <span class="fs-18 fw-bold">65.2%</span>
                  </div>
                </div>
                <div class="text-muted small mt-2">Returning Customers</div>
              </div>
              <div class="d-flex justify-content-between p-3 bg-light rounded">
                <div>
                  <div class="fw-bold fs-14">This Week</div>
                  <div class="text-success fw-semibold">23.5k</div>
                </div>
                <div class="text-end">
                  <div class="fw-bold fs-14">Last Week</div>
                  <div class="text-muted fw-semibold">41.05k</div>
                </div>
              </div>
              <button class="btn btn-outline-primary btn-sm w-100 mt-3">View Details</button>
            </div>
          </div>
        </div>

        <!-- Performance Visual -->
        <div class="col-xl-8 col-md-6 col-12 mb-3">
          <div class="card h-100 border shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Performance Overview</h6>
                <div class="btn-group btn-group-sm">
                  <button
                    v-for="timeframe in ['ALL', '1M', '6M', '1Y']"
                    :key="timeframe"
                    class="btn"
                    :class="selectedTimeframe === timeframe ? 'btn-primary text-white' : 'btn-light'"
                    @click="selectedTimeframe = timeframe"
                  >
                    {{ timeframe }}
                  </button>
                </div>
              </div>
              <div class="p-4 bg-light rounded text-center">
                <!-- Visual SVG wave chart for performance -->
                <svg viewBox="0 0 500 150" class="w-100" style="height: 180px">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color: #ff9f43; stop-opacity: 0.4" />
                      <stop offset="100%" style="stop-color: #ff9f43; stop-opacity: 0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,100 Q60,30 125,70 T250,50 T375,90 T500,40 L500,150 L0,150 Z" fill="url(#grad)" />
                  <path d="M0,100 Q60,30 125,70 T250,50 T375,90 T500,40" fill="none" stroke="#ff9f43" stroke-width="3" />
                  <!-- Data points -->
                  <circle cx="125" cy="70" r="4" fill="#ff9f43" />
                  <circle cx="250" cy="50" r="4" fill="#ff9f43" />
                  <circle cx="375" cy="90" r="4" fill="#ff9f43" />
                  <circle cx="500" cy="40" r="4" fill="#ff9f43" />
                </svg>
                <div class="d-flex justify-content-between text-muted small mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Analytics Breakdown -->
      <div class="row">
        <!-- Sessions by Browser -->
        <div class="col-xl-4 col-md-6 col-12 mb-3">
          <div class="card h-100 border shadow-sm">
            <div class="card-body">
              <h6 class="fw-bold mb-3">Session By Browser</h6>
              <div class="small">
                <div v-for="b in browserStats" :key="b.name" class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <span class="fw-medium">{{ b.name }}</span>
                    <span
                      >{{ b.percent }}% <span class="text-muted">({{ b.users }})</span></span
                    >
                  </div>
                  <div class="progress" style="height: 6px">
                    <div class="progress-bar" :style="{ width: b.percent + '%', backgroundColor: b.color }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessions by Province -->
        <div class="col-xl-4 col-md-6 col-12 mb-3">
          <div class="card h-100 border shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Sessions by Province</h6>
                <button class="btn btn-light btn-sm">View Data</button>
              </div>
              <div class="small">
                <div
                  v-for="prov in provinceTraffic"
                  :key="prov.name"
                  class="d-flex justify-content-between align-items-center py-2 border-bottom"
                >
                  <span class="fw-semibold text-dark">{{ prov.name }}</span>
                  <span class="badge bg-light text-primary fs-13">{{ prov.traffic }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Pages -->
        <div class="col-xl-4 col-md-12 col-12 mb-3">
          <div class="card h-100 border shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Top Pages</h6>
                <button class="btn btn-light btn-sm">View All</button>
              </div>
              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Page Path</th>
                      <th class="text-center">Views</th>
                      <th class="text-end">Exit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="page in topPages" :key="page.path">
                      <td class="text-primary font-mono text-xs">{{ page.path }}</td>
                      <td class="text-center fw-semibold">{{ page.views }}</td>
                      <td class="text-end text-muted text-xs">{{ page.exitRate }}</td>
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
</template>

<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: "Analytics Dashboard - Kacetak System",
});

const selectedTimeframe = ref("ALL");

const browserStats = ref([
  { name: "Chrome", percent: 62.5, users: "5.06k", color: "#ff9f43" },
  { name: "Firefox", percent: 12.3, users: "1.5k", color: "#ff6b6b" },
  { name: "Safari", percent: 9.8, users: "1.03k", color: "#4dabf7" },
  { name: "Brave", percent: 3.1, users: "0.3k", color: "#ff922b" },
  { name: "Opera", percent: 3.0, users: "0.28k", color: "#fa5252" },
  { name: "Other", percent: 9.3, users: "0.9k", color: "#868e96" },
]);

const provinceTraffic = ref([
  { name: "Jawa Barat", traffic: "659k" },
  { name: "DKI Jakarta", traffic: "485k" },
  { name: "Banten", traffic: "355k" },
  { name: "Jawa Tengah", traffic: "204k" },
  { name: "Jawa Timur", traffic: "180k" },
  { name: "Bali", traffic: "95k" },
]);

const topPages = ref([
  { path: "/pos", views: "4,890", exitRate: "12.4%" },
  { path: "/sales", views: "3,210", exitRate: "18.1%" },
  { path: "/cetak-full-color", views: "2,940", exitRate: "22.6%" },
  { path: "/invoice", views: "2,150", exitRate: "15.3%" },
  { path: "/calender", views: "1,780", exitRate: "28.0%" },
]);

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
