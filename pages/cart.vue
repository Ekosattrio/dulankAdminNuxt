<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Cart List</h4>
            <h6>Manage customer carts and abandoned checkout tracking</h6>
          </div>
        </div>
      </div>

      <!-- Dashboard Metric Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-shopping-cart fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Cart Amount</h6>
              <h4 class="fw-bold mb-0">Rp {{ formatNumber(totalCartAmount) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash1 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-activity fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Cart Active</h6>
              <h4 class="fw-bold mb-0">{{ activeCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash2 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-info bg-opacity-10 p-3 rounded">
              <i class="ti ti-credit-card fs-2 text-info"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Cart Checkout</h6>
              <h4 class="fw-bold mb-0">{{ checkoutCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash3 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-danger bg-opacity-10 p-3 rounded">
              <i class="ti ti-trash fs-2 text-danger"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Cart Deleted</h6>
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search product or customer email..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="catDropdownOpen = !catDropdownOpen"
                >
                  Category: {{ filterCategory || 'All' }}
                </button>
                <ul v-if="catDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = ''; catDropdownOpen = false">All Categories</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Brochure'; catDropdownOpen = false">Brochure</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Flyer'; catDropdownOpen = false">Flyer</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Packaging'; catDropdownOpen = false">Packaging</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Stationery'; catDropdownOpen = false">Stationery</a></li>
                </ul>
              </div>
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || 'All' }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = ''; statusDropdownOpen = false">All Status</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Active'; statusDropdownOpen = false">Active</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Checkout'; statusDropdownOpen = false">Checkout</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterStatus = 'Delete'; statusDropdownOpen = false">Delete</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Product</th>
                  <th>Customer User</th>
                  <th>Category</th>
                  <th class="text-end">Unit Price</th>
                  <th class="text-center">Qty</th>
                  <th class="text-end">Total Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredCarts" :key="item.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        :src="item.image"
                        :alt="item.product"
                        class="rounded me-2 border object-fit-cover"
                        style="width: 44px; height: 44px;"
                      />
                      <span class="fw-semibold text-dark">{{ item.product }}</span>
                    </div>
                  </td>
                  <td>{{ item.user }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.category }}</span>
                  </td>
                  <td class="text-end">Rp {{ formatNumber(item.price) }}</td>
                  <td class="text-center fw-bold">{{ item.qty }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(item.totalPrice) }}</td>
                  <td>{{ item.date }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="{
                        'badge-success': item.status === 'Active',
                        'badge-info': item.status === 'Checkout',
                        'badge-danger': item.status === 'Delete'
                      }"
                    >
                      • {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete item"
                        @click="deleteCartItem(item.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCarts.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">
                    No cart records found.
                  </td>
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
import { ref, computed } from 'vue'

interface CartItem {
  id: number
  product: string
  image: string
  user: string
  category: string
  price: number
  qty: number
  totalPrice: number
  date: string
  status: 'Active' | 'Checkout' | 'Delete'
}

const carts = ref<CartItem[]>([
  {
    id: 1,
    product: 'Brosur Full Color A4 Art Paper 150g',
    image: '/assets/img/products/stock-img-01.png',
    user: 'ekosatrio@gmail.com',
    category: 'Brochure',
    price: 25000,
    qty: 100,
    totalPrice: 2500000,
    date: '24/04/2025',
    status: 'Active'
  },
  {
    id: 2,
    product: 'Custom Box Packaging Ivory 300g',
    image: '/assets/img/products/stock-img-06.png',
    user: 'budi.santoso@yahoo.com',
    category: 'Packaging',
    price: 18000,
    qty: 140,
    totalPrice: 2520000,
    date: '24/04/2025',
    status: 'Active'
  },
  {
    id: 3,
    product: 'Flyer DL Lipat 3 Full Color',
    image: '/assets/img/products/stock-img-02.png',
    user: 'linda.wijaya@gmail.com',
    category: 'Flyer',
    price: 3200,
    qty: 780,
    totalPrice: 2496000,
    date: '24/04/2025',
    status: 'Checkout'
  },
  {
    id: 4,
    product: 'Buku Agenda Custom Hardcover',
    image: '/assets/img/products/stock-img-03.png',
    user: 'rudi.printing@corp.id',
    category: 'Stationery',
    price: 55000,
    qty: 450,
    totalPrice: 24750000,
    date: '24/04/2025',
    status: 'Active'
  },
  {
    id: 5,
    product: 'Kartu Nama Foil Emas Box Plastik',
    image: '/assets/img/products/stock-img-04.png',
    user: 'sarah.j@outlook.com',
    category: 'Stationery',
    price: 65000,
    qty: 10,
    totalPrice: 650000,
    date: '23/04/2025',
    status: 'Delete'
  }
])

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const catDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const totalCartAmount = computed(() => carts.value.reduce((sum, item) => sum + item.totalPrice, 0))
const activeCount = computed(() => carts.value.filter(item => item.status === 'Active').length)
const checkoutCount = computed(() => carts.value.filter(item => item.status === 'Checkout').length)
const deleteCount = computed(() => carts.value.filter(item => item.status === 'Delete').length)

const filteredCarts = computed(() => {
  return carts.value.filter(c => {
    const matchCat = !filterCategory.value || c.category === filterCategory.value
    const matchStatus = !filterStatus.value || c.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      c.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.user.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchStatus && matchSearch
  })
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function deleteCartItem(id: number) {
  if (confirm('Delete this cart record?')) {
    carts.value = carts.value.filter(c => c.id !== id)
  }
}
</script>
