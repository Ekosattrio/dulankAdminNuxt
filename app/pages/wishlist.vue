<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Wishlist List</h4>
            <h6>Manage customer wishlist items and product interests</h6>
          </div>
        </div>
      </div>

      <!-- Dashboard Metric Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-heart fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Wishlist Value</h6>
              <h4 class="fw-bold mb-0">Rp {{ formatNumber(totalWishlistAmount) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash1 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-heart-check fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Active Wishlists</h6>
              <h4 class="fw-bold mb-0">{{ activeCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash2 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-info bg-opacity-10 p-3 rounded">
              <i class="ti ti-shopping-cart-check fs-2 text-info"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Converted to Order</h6>
              <h4 class="fw-bold mb-0">{{ checkoutCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash3 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-danger bg-opacity-10 p-3 rounded">
              <i class="ti ti-heart-broken fs-2 text-danger"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Removed from Wishlist</h6>
              <h4 class="fw-bold mb-0">{{ deleteCount }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search product or user email..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" @click="catDropdownOpen = !catDropdownOpen">
                  Category: {{ filterCategory || "All" }}
                </button>
                <ul v-if="catDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute">
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterCategory = '';
                        catDropdownOpen = false;
                      "
                      >All Categories</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterCategory = 'Packaging';
                        catDropdownOpen = false;
                      "
                      >Packaging</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterCategory = 'Brochure';
                        catDropdownOpen = false;
                      "
                      >Brochure</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterCategory = 'Stationery';
                        catDropdownOpen = false;
                      "
                      >Stationery</a
                    >
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || "All" }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute">
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = '';
                        statusDropdownOpen = false;
                      "
                      >All Status</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Active';
                        statusDropdownOpen = false;
                      "
                      >Active</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Checkout';
                        statusDropdownOpen = false;
                      "
                      >Checkout</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Delete';
                        statusDropdownOpen = false;
                      "
                      >Delete</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Product</th>
                  <th>User</th>
                  <th>Category</th>
                  <th class="text-end">Price</th>
                  <th class="text-center">Qty</th>
                  <th class="text-end">Total Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="w in filteredWishlist" :key="w.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="w.image"
                        :alt="w.product"
                        class="rounded me-2 border object-fit-cover"
                        style="width: 44px; height: 44px"
                      />
                      <span class="fw-semibold text-dark">{{ w.product }}</span>
                    </div>
                  </td>
                  <td>{{ w.user }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ w.category }}</span>
                  </td>
                  <td class="text-end">Rp {{ formatNumber(w.price) }}</td>
                  <td class="text-center fw-bold">{{ w.qty }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(w.totalPrice) }}</td>
                  <td>{{ w.date }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="{
                        'badge-success': w.status === 'Active',
                        'badge-info': w.status === 'Checkout',
                        'badge-danger': w.status === 'Delete',
                      }"
                    >
                      • {{ w.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete from wishlist"
                        @click="deleteItem(w.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredWishlist.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No wishlist items found.</td>
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

interface WishlistItem {
  id: number;
  product: string;
  image: string;
  user: string;
  category: string;
  price: number;
  qty: number;
  totalPrice: number;
  date: string;
  status: "Active" | "Checkout" | "Delete";
}

const wishlist = ref<WishlistItem[]>([
  {
    id: 1,
    product: "Dus Kemasan Corrugated Custom Full Color",
    image: "/assets/img/products/stock-img-01.png",
    user: "ekosatrio@gmail.com",
    category: "Packaging",
    price: 12500,
    qty: 1000,
    totalPrice: 12500000,
    date: "24/04/2025",
    status: "Active",
  },
  {
    id: 2,
    product: "Buku Katalog Produk Kertas Art Paper 210g",
    image: "/assets/img/products/stock-img-06.png",
    user: "maria.designer@studio.com",
    category: "Brochure",
    price: 45000,
    qty: 100,
    totalPrice: 4500000,
    date: "22/04/2025",
    status: "Active",
  },
  {
    id: 3,
    product: "Paper Bag Kraft Sablon 1 Warna",
    image: "/assets/img/products/stock-img-02.png",
    user: "hendra.clothing@brand.co",
    category: "Packaging",
    price: 3500,
    qty: 500,
    totalPrice: 1750000,
    date: "20/04/2025",
    status: "Checkout",
  },
  {
    id: 4,
    product: "Kartu Nama Kertas Linen Emboss Logo",
    image: "/assets/img/products/stock-img-03.png",
    user: "lawfirm.partner@legal.id",
    category: "Stationery",
    price: 85000,
    qty: 10,
    totalPrice: 850000,
    date: "18/04/2025",
    status: "Delete",
  },
]);

const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const catDropdownOpen = ref(false);
const statusDropdownOpen = ref(false);

const totalWishlistAmount = computed(() => wishlist.value.reduce((sum, item) => sum + item.totalPrice, 0));
const activeCount = computed(() => wishlist.value.filter((item) => item.status === "Active").length);
const checkoutCount = computed(() => wishlist.value.filter((item) => item.status === "Checkout").length);
const deleteCount = computed(() => wishlist.value.filter((item) => item.status === "Delete").length);

const filteredWishlist = computed(() => {
  return wishlist.value.filter((w) => {
    const matchCat = !filterCategory.value || w.category === filterCategory.value;
    const matchStatus = !filterStatus.value || w.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      w.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      w.user.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function deleteItem(id: number) {
  if (confirm("Delete this item from wishlist?")) {
    wishlist.value = wishlist.value.filter((w) => w.id !== id);
  }
}
</script>
