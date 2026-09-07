<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Product Report</h4>
          <h6>Manage your product performance and sales report</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printReport">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printReport">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click.prevent="refreshReport">
            <i class="feather-rotate-ccw"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search product..." class="form-control form-control-sm" />
            </div>
            <div class="category-filter">
              <select class="form-select form-select-sm" v-model="categoryFilter">
                <option value="">All Categories</option>
                <option>Large Format</option>
                <option>Offset</option>
                <option>Digital Print</option>
                <option>Apparel</option>
                <option>Merchandise</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th class="text-center">Total Order</th>
                <th>Unit</th>
                <th class="text-end">Amount (IDR)</th>
                <th class="text-end">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredProducts" :key="item.product">
                <td class="fw-bold">{{ item.product }}</td>
                <td>{{ item.category }}</td>
                <td class="text-center">{{ item.order }}</td>
                <td>{{ item.unit }}</td>
                <td class="text-end fw-bold text-success">{{ formatNumber(item.amount) }}</td>
                <td class="text-end">{{ item.percentage }}%</td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">No products found.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold table-light">
                <td colspan="2">Total</td>
                <td class="text-center">{{ totalOrders }}</td>
                <td></td>
                <td class="text-end text-primary">{{ formatNumber(totalAmount) }}</td>
                <td class="text-end">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const products = ref([
  {
    product: "Banner Outdoor 280gr",
    category: "Large Format",
    order: 1250,
    unit: "Meter",
    amount: 31250000,
    percentage: "25.15",
  },
  { product: "Buku Kenangan Hardcover", category: "Offset", order: 250, unit: "Pcs", amount: 30000000, percentage: "24.14" },
  { product: "Brosur A4 HVS 80gr", category: "Digital Print", order: 45, unit: "Rim", amount: 15750000, percentage: "12.68" },
  {
    product: "Stiker Vinyl Ritrama",
    category: "Digital Print",
    order: 120,
    unit: "Lembar",
    amount: 14400000,
    percentage: "11.59",
  },
  { product: "Kartu Nama Laminating", category: "Digital Print", order: 400, unit: "Box", amount: 14000000, percentage: "11.27" },
  { product: "Kaos DTF Custom", category: "Apparel", order: 120, unit: "Pcs", amount: 10200000, percentage: "8.21" },
  { product: "Banner Indoor Albatros", category: "Large Format", order: 65, unit: "Meter", amount: 4225000, percentage: "3.40" },
  {
    product: "Poster A3+ Art Carton",
    category: "Digital Print",
    order: 350,
    unit: "Lembar",
    amount: 2625000,
    percentage: "2.11",
  },
  { product: "Pin Peniti 58mm", category: "Merchandise", order: 250, unit: "Pcs", amount: 1250000, percentage: "1.01" },
  { product: "ID Card PVC", category: "Digital Print", order: 55, unit: "Pcs", amount: 550000, percentage: "0.44" },
]);

const searchQuery = ref("");
const categoryFilter = ref("");

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || p.product.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter.value || p.category === categoryFilter.value;
    return matchesSearch && matchesCategory;
  });
});

const totalOrders = computed(() => filteredProducts.value.reduce((acc, p) => acc + p.order, 0));
const totalAmount = computed(() => filteredProducts.value.reduce((acc, p) => acc + p.amount, 0));

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
  categoryFilter.value = "";
};

const toggleHeader = () => {
  // toggle
};
</script>
