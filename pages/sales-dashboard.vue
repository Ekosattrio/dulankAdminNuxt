<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <!-- Greeting & Top Controls -->
      <div class="welcome d-lg-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center welcome-text mb-3 mb-lg-0">
          <h3 class="d-flex align-items-center mb-0">
            <img src="/assets/img/icons/hi.svg" alt="img" class="me-2" /> Hi John Smilga,
          </h3>
          <span class="text-muted ms-2">here's what's happening with your store today.</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="dropdown">
            <button
              class="btn btn-white border dropdown-toggle d-flex align-items-center gap-1"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="ti ti-calendar"></i>
              <span>{{ selectedPeriod }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="javascript:void(0);" @click="selectedPeriod = 'Today'">Today</a></li>
              <li>
                <a class="dropdown-item" href="javascript:void(0);" @click="selectedPeriod = '7 Hari Terakhir'"
                  >7 Hari Terakhir</a
                >
              </li>
              <li><a class="dropdown-item" href="javascript:void(0);" @click="selectedPeriod = 'Bulan Ini'">Bulan Ini</a></li>
              <li><a class="dropdown-item" href="javascript:void(0);" @click="selectedPeriod = 'Tahun Ini'">Tahun Ini</a></li>
            </ul>
          </div>
          <button type="button" class="btn btn-outline-secondary" title="Refresh" @click="refreshData">
            <i class="ti ti-rotate"></i>
          </button>
        </div>
      </div>

      <!-- Sales KPI Cards -->
      <div class="row sales-cards g-3 mb-4">
        <div class="col-xl-6 col-sm-12">
          <div class="card p-4 border-0 shadow-sm d-flex flex-row align-items-center justify-content-between h-100">
            <div>
              <h6 class="text-muted mb-1">Weekly Earning</h6>
              <h3 class="fw-bold text-dark mb-2">$95,000.45</h3>
              <p class="mb-0 text-muted small">
                <span class="text-success fw-semibold"><i class="ti ti-trending-up me-1"></i>48%</span> increase compared to last
                week
              </p>
            </div>
            <img src="/assets/img/icons/weekly-earning.svg" alt="weekly earning" style="width: 72px" />
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-4 border-0 shadow-sm bg-primary text-white h-100">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <img src="/assets/img/icons/total-sales.svg" alt="sales" style="width: 40px; filter: brightness(0) invert(1)" />
              <button class="btn btn-sm btn-link text-white p-0" @click="refreshData"><i class="ti ti-rotate"></i></button>
            </div>
            <h3 class="fw-bold mb-1">10,000+</h3>
            <p class="mb-0 opacity-75 small">No of Total Sales</p>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-4 border-0 shadow-sm bg-secondary text-white h-100">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <img
                src="/assets/img/icons/purchased-earnings.svg"
                alt="purchased"
                style="width: 40px; filter: brightness(0) invert(1)"
              />
              <button class="btn btn-sm btn-link text-white p-0" @click="refreshData"><i class="ti ti-rotate"></i></button>
            </div>
            <h3 class="fw-bold mb-1">800+</h3>
            <p class="mb-0 opacity-75 small">Orders Fulfilled</p>
          </div>
        </div>
      </div>

      <!-- Best Seller & Recent Transactions -->
      <div class="row g-3 mb-4">
        <!-- Best Seller -->
        <div class="col-xl-4 col-12">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-bold">Best Seller</h5>
              <NuxtLink to="/best-seller" class="text-primary small fw-semibold text-decoration-none d-flex align-items-center">
                View All <i class="ti ti-arrow-right ms-1"></i>
              </NuxtLink>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <tbody>
                    <tr v-for="item in bestSellers" :key="item.id">
                      <td class="ps-3">
                        <div class="d-flex align-items-center gap-2">
                          <img
                            :src="item.image"
                            alt="product"
                            class="rounded"
                            style="width: 44px; height: 44px; object-fit: cover"
                          />
                          <div>
                            <div class="fw-semibold text-dark small">{{ item.name }}</div>
                            <div class="text-muted small">${{ item.price }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-end pe-3">
                        <div class="text-muted small">Sales</div>
                        <div class="fw-bold text-dark">{{ item.sales }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="col-xl-8 col-12">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-bold">Recent Transactions</h5>
              <NuxtLink to="/sales" class="text-primary small fw-semibold text-decoration-none d-flex align-items-center">
                View All <i class="ti ti-arrow-right ms-1"></i>
              </NuxtLink>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-3">#</th>
                      <th>Order Details</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th class="text-end pe-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(tx, idx) in recentTransactions" :key="tx.id">
                      <td class="ps-3 text-muted small">{{ idx + 1 }}</td>
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <img :src="tx.image" alt="item" class="rounded" style="width: 38px; height: 38px; object-fit: cover" />
                          <div>
                            <div class="fw-semibold text-dark small">{{ tx.name }}</div>
                            <div class="text-muted small d-flex align-items-center">
                              <i class="ti ti-clock me-1"></i>{{ tx.time }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="fw-semibold small">{{ tx.paymentMethod }}</div>
                        <div class="text-primary small">{{ tx.reference }}</div>
                      </td>
                      <td>
                        <span :class="getStatusBadge(tx.status)">{{ tx.status }}</span>
                      </td>
                      <td class="text-end pe-3 fw-bold text-dark">${{ tx.amount.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Analytics & Geography breakdown -->
      <div class="row g-3">
        <div class="col-lg-7 col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-bold">Sales Analytics</h5>
              <span class="badge bg-light text-muted border">2025 Annual</span>
            </div>
            <div class="card-body">
              <!-- Visual Bar Chart Representation -->
              <div class="d-flex align-items-end justify-content-between pt-4" style="height: 220px">
                <div v-for="bar in analyticsBars" :key="bar.month" class="text-center flex-fill">
                  <div class="d-flex justify-content-center gap-1 align-items-end" style="height: 180px">
                    <div
                      class="bg-primary rounded-top"
                      :style="{ height: bar.sales + '%', width: '12px' }"
                      :title="'Sales: ' + bar.sales"
                    ></div>
                    <div
                      class="bg-secondary bg-opacity-25 rounded-top"
                      :style="{ height: bar.revenue + '%', width: '12px' }"
                      :title="'Revenue: ' + bar.revenue"
                    ></div>
                  </div>
                  <div class="text-muted small mt-2">{{ bar.month }}</div>
                </div>
              </div>
              <div class="d-flex justify-content-center gap-4 mt-3 small">
                <span class="d-flex align-items-center"><span class="badge bg-primary me-1 p-1"> </span> Total Sales</span>
                <span class="d-flex align-items-center"
                  ><span class="badge bg-secondary bg-opacity-25 me-1 p-1"> </span> Revenue</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5 col-12">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-bold">Sales by Countries</h5>
              <span class="text-muted small">This Month</span>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <div v-for="geo in countrySales" :key="geo.country">
                  <div class="d-flex justify-content-between small mb-1">
                    <span class="fw-semibold text-dark">{{ geo.country }}</span>
                    <span class="text-muted">{{ geo.percentage }}% (${{ geo.amount }})</span>
                  </div>
                  <div class="progress" style="height: 6px">
                    <div class="progress-bar bg-primary" :style="{ width: geo.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
              <div class="mt-4 p-3 bg-light rounded text-center small text-muted">
                Global distribution across top 5 active customer regions.
              </div>
            </div>
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
  title: "Sales Dashboard - Kacetak System",
});

const selectedPeriod = ref("7 Hari Terakhir");

const bestSellers = ref([
  { id: 1, name: "Lenovo 3rd Generation", price: 4420, sales: 6547, image: "/assets/img/products/stock-img-01.png" },
  { id: 2, name: "Bold V3.2 Printing Sheet", price: 1474, sales: 3474, image: "/assets/img/products/stock-img-06.png" },
  { id: 3, name: "Nike Jordan Poster Pack", price: 8784, sales: 1478, image: "/assets/img/products/stock-img-02.png" },
  { id: 4, name: "Apple Series 5 Watch Box", price: 3240, sales: 987, image: "/assets/img/products/stock-img-03.png" },
  { id: 5, name: "Amazon Echo Dot Label", price: 597, sales: 784, image: "/assets/img/products/stock-img-04.png" },
]);

const recentTransactions = ref([
  {
    id: 1,
    name: "Lobar Handy",
    time: "15 Mins",
    paymentMethod: "Paypal",
    reference: "#416645453773",
    status: "Success",
    amount: 1099.0,
    image: "/assets/img/products/stock-img-05.png",
  },
  {
    id: 2,
    name: "Red Premium Handy",
    time: "10 Mins",
    paymentMethod: "Apple Pay",
    reference: "#147784454554",
    status: "Canceled",
    amount: 600.55,
    image: "/assets/img/products/expire-product-01.png",
  },
  {
    id: 3,
    name: "Iphone 14 Pro Hardbox",
    time: "10 Mins",
    paymentMethod: "Stripe",
    reference: "#147784454554",
    status: "Pending",
    amount: 1099.0,
    image: "/assets/img/products/expire-product-02.png",
  },
  {
    id: 4,
    name: "Black Slim 200 Card",
    time: "10 Mins",
    paymentMethod: "PayU",
    reference: "#147784454554",
    status: "Success",
    amount: 1569.0,
    image: "/assets/img/products/expire-product-03.png",
  },
  {
    id: 5,
    name: "Woodcraft Sandal Catalog",
    time: "15 Mins",
    paymentMethod: "Paytm",
    reference: "#147784454554",
    status: "Success",
    amount: 1478.0,
    image: "/assets/img/products/expire-product-04.png",
  },
]);

const analyticsBars = ref([
  { month: "Jan", sales: 45, revenue: 60 },
  { month: "Feb", sales: 60, revenue: 50 },
  { month: "Mar", sales: 75, revenue: 80 },
  { month: "Apr", sales: 50, revenue: 45 },
  { month: "May", sales: 85, revenue: 90 },
  { month: "Jun", sales: 65, revenue: 70 },
  { month: "Jul", sales: 90, revenue: 95 },
  { month: "Aug", sales: 70, revenue: 65 },
  { month: "Sep", sales: 80, revenue: 85 },
  { month: "Oct", sales: 95, revenue: 90 },
  { month: "Nov", sales: 60, revenue: 75 },
  { month: "Dec", sales: 85, revenue: 80 },
]);

const countrySales = ref([
  { country: "Indonesia", percentage: 55, amount: "52,250" },
  { country: "United States", percentage: 20, amount: "19,000" },
  { country: "Singapore", percentage: 12, amount: "11,400" },
  { country: "Malaysia", percentage: 8, amount: "7,600" },
  { country: "Others", percentage: 5, amount: "4,750" },
]);

function getStatusBadge(status: string) {
  if (status === "Success") return "badge bg-success bg-opacity-10 text-success border border-success";
  if (status === "Canceled") return "badge bg-danger bg-opacity-10 text-danger border border-danger";
  return "badge bg-warning bg-opacity-10 text-warning border border-warning";
}

function refreshData() {
  alert("Sales data refreshed.");
}
</script>
