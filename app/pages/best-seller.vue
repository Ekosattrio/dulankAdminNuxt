<<<<<<< HEAD
<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Bestseller Products Report</h4>
            <h6>View Reports of Best Selling Products</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printReport"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
      </div>

      <!-- Filter and Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search bestseller product..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="catDropdownOpen = !catDropdownOpen"
                >
                  Category: {{ filterCategory || 'All Categories' }}
                </button>
                <ul v-if="catDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute;">
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = ''; catDropdownOpen = false">All Categories</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Packaging'; catDropdownOpen = false">Packaging</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Marketing'; catDropdownOpen = false">Marketing</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Publishing'; catDropdownOpen = false">Publishing</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Stationery'; catDropdownOpen = false">Stationery</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0);" @click="filterCategory = 'Outdoor Media'; catDropdownOpen = false">Outdoor Media</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th class="text-center" style="width: 70px;">Rank</th>
                  <th>Category</th>
                  <th>Product</th>
                  <th class="text-end">Sold Qty</th>
                  <th>Unit</th>
                  <th class="text-end">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredProducts" :key="item.rank">
                  <td class="text-center">
                    <span
                      class="badge rounded-circle p-2 fs-12 fw-bold"
                      :class="{
                        'bg-warning text-dark': item.rank === 1,
                        'bg-secondary text-white': item.rank === 2,
                        'bg-danger bg-opacity-75 text-white': item.rank === 3,
                        'bg-light text-dark border': item.rank > 3
                      }"
                    >
                      #{{ item.rank }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.category }}</span>
                  </td>
                  <td class="fw-semibold text-dark">{{ item.product }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.sold) }}</td>
                  <td>{{ item.unit }}</td>
                  <td class="text-end fw-bold text-dark">Rp {{ formatNumber(item.total) }}</td>
                </tr>
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No bestseller records found.
                  </td>
                </tr>
              </tbody>
              <tfoot class="table-light">
                <tr class="fw-bold">
                  <td colspan="3" class="text-start">Total</td>
                  <td class="text-end">{{ formatNumber(totalSold) }}</td>
                  <td></td>
                  <td class="text-end">Rp {{ formatNumber(totalRevenue) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: bestSellerData } = await useFetch<BestsellerItem[]>('/api/best-seller')
const products = ref<BestsellerItem[]>(bestSellerData.value ?? [])
useMockSync('best-seller', products)

const searchQuery = ref('')
const filterCategory = ref('')
const catDropdownOpen = ref(false)

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCat = !filterCategory.value || p.category === filterCategory.value
    const matchSearch = !searchQuery.value ||
      p.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
  })
})

const totalSold = computed(() => filteredProducts.value.reduce((sum, p) => sum + p.sold, 0))
const totalRevenue = computed(() => filteredProducts.value.reduce((sum, p) => sum + p.total, 0))

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function exportPdf() {
  alert('Exporting Bestseller report as PDF...')
}

function printReport() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterCategory.value = ''
}</script>

=======
<script setup lang="ts">
import BestSellerWorkspace from '~/components/pages/reports/BestSellerWorkspace.vue'

useHead({
  title: 'Bestseller Products Report - Kacetak System'
})
</script>

<template>
  <div class="dulank-page dulank-page-best-seller">
    <BestSellerWorkspace />
  </div>
</template>
>>>>>>> origin/eko
