<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Cart List" subtitle="Manage customer carts and abandoned checkout tracking" />

    <!-- Dashboard Metric Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Cart Amount" :value="`Rp ${formatNumber(totalCartAmount)}`" icon="shopping-cart" tone="primary" />
      <CommonStatCard label="Total Cart Active" :value="String(activeCount)" icon="activity" tone="success" />
      <CommonStatCard label="Total Cart Checkout" :value="String(checkoutCount)" icon="credit-card" tone="sky" />
      <CommonStatCard label="Total Cart Deleted" :value="String(deleteCount)" icon="trash-2" tone="danger" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search product or customer email..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterCategory"
            allLabel="All Categories"
            :options="[
              { value: 'Brochure', label: 'Brochure' },
              { value: 'Flyer', label: 'Flyer' },
              { value: 'Packaging', label: 'Packaging' },
              { value: 'Stationery', label: 'Stationery' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Status"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Checkout', label: 'Checkout' },
              { value: 'Delete', label: 'Delete' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer User</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Unit Price</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Qty</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Total Price</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCarts" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="item.image" :alt="item.product" class="me-2 h-11 w-11 rounded border border-gray-200 object-cover dark:border-gray-700" />
                  <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.product }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.user }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.category }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">Rp {{ formatNumber(item.price) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center font-bold">{{ item.qty }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(item.totalPrice) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="item.status"
                  :tone="item.status === 'Active' ? 'emerald' : item.status === 'Checkout' ? 'sky' : 'rose'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="item" @delete="deleteCartItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredCarts.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No cart records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: cartData } = await useFetch<CartItem[]>('/api/cart')
const carts = ref<CartItem[]>(cartData.value ?? [])
useMockSync('cart', carts)

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