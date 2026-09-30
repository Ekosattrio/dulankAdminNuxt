<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Add Purchase">
      <template #actions>
        <NuxtLink
          to="/purchase"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <CommonFeatherIcon name="arrow-left" size="16" />
          Back to Purchase List
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Supplier Column -->
        <div>
          <div class="mb-3">
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Supplier:</label>
            <div class="relative">
              <input
                v-model="supplierSearch"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Search Supplier..."
                @focus="showSupplierDropdown = true"
              />
              <div
                v-if="showSupplierDropdown && filteredSuppliers.length > 0"
                class="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  v-for="s in filteredSuppliers"
                  :key="s.name"
                  class="cursor-pointer border-b border-gray-100 p-2 transition hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-700"
                  @click="selectSupplier(s)"
                >
                  <strong class="text-gray-900 dark:text-gray-100">{{ s.name }}</strong>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ s.email }} | {{ s.phone }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedSupplier" id="data-company" class="mb-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
            <strong class="text-primary">{{ selectedSupplier.name }}</strong><br />
            <small class="text-gray-500 dark:text-gray-400">{{ selectedSupplier.email }}</small><br />
            <small class="text-gray-500 dark:text-gray-400">{{ selectedSupplier.phone }}</small><br />
            <small class="text-gray-500 dark:text-gray-400">{{ selectedSupplier.address }}</small>
          </div>
        </div>

        <!-- Purchase Info Column -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <label class="w-24 shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-300">No Purchase</label>
            <input
              type="text"
              disabled
              v-model="noPurchase"
              class="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
          </div>
          <div class="flex items-center gap-3">
            <label class="w-24 shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              v-model="purchaseDate"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <div class="flex items-center gap-3">
            <label class="w-24 shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-300">Create</label>
            <input
              type="text"
              v-model="creator"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      <!-- Table of Products -->
      <div class="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th class="w-[40%] px-3 py-2 text-start">Product Name</th>
              <th class="w-28 px-3 py-2 text-start">Qty</th>
              <th class="w-28 px-3 py-2 text-start">Unit</th>
              <th class="w-36 px-3 py-2 text-start">Price (IDR)</th>
              <th class="w-36 px-3 py-2 text-start">Amount (IDR)</th>
              <th class="w-12 px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(item, idx) in items" :key="idx" class="product-item">
              <td class="px-3 py-2">
                <div class="relative">
                  <input
                    v-model="item.name"
                    type="text"
                    class="w-full h-9 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    placeholder="Cari Produk... ketik nama"
                    @focus="item.showDropdown = true"
                  />
                  <div
                    v-if="item.showDropdown"
                    class="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div
                      v-for="mp in masterProducts"
                      :key="mp.name"
                      class="cursor-pointer border-b border-gray-100 p-2 transition hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-700"
                      @click="selectProduct(item, mp)"
                    >
                      <strong class="text-gray-900 dark:text-gray-100">{{ mp.name }}</strong><br />
                      <small class="text-gray-500 dark:text-gray-400">Rp {{ formatNumber(mp.price) }} - {{ mp.desc }}</small>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-2">
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    @click="item.qty > 1 ? item.qty-- : 1"
                  >
                    -
                  </button>
                  <input
                    v-model.number="item.qty"
                    type="number"
                    min="1"
                    class="w-14 h-8 rounded-md border border-gray-200 bg-white px-1 text-center text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    @click="item.qty++"
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="px-3 py-2">
                <select
                  v-model="item.unit"
                  class="w-full h-9 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option>Pcs</option>
                  <option>Box</option>
                  <option>Set</option>
                  <option>Ream</option>
                  <option>Kg</option>
                  <option>Lembar</option>
                </select>
              </td>
              <td class="px-3 py-2">
                <input
                  v-model.number="item.price"
                  type="number"
                  min="0"
                  class="w-full h-9 rounded-md border border-gray-200 bg-white px-2 text-end text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </td>
              <td class="px-3 py-2 text-end font-bold">{{ formatNumber(item.qty * item.price) }}</td>
              <td class="px-3 py-2 text-center">
                <button
                  v-if="items.length > 1"
                  type="button"
                  class="rounded p-1 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950"
                  @click="removeItem(idx)"
                >
                  <CommonFeatherIcon name="trash-2" size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
        @click="addNewItem"
      >
        <CommonFeatherIcon name="plus" size="14" />
        Add New Blank
      </button>

      <!-- Footer Calculation Section -->
      <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CommonFormField label="Purchase Notes">
          <textarea
            v-model="notes"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Type purchase note..."
          ></textarea>
        </CommonFormField>
        <div class="space-y-3 lg:ms-auto lg:max-w-sm">
          <div class="flex items-center justify-between text-sm font-bold text-gray-800 dark:text-gray-200">
            <span>Sub Total</span><span>Rp {{ formatNumber(subTotal) }}</span>
          </div>
          <CommonFormField label="Payment Method">
            <select
              v-model="paymentMethod"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit Card</option>
              <option value="cheque">Cheque</option>
              <option value="deposit">Deposit</option>
              <option value="points">Points</option>
            </select>
          </CommonFormField>
          <div class="flex items-center justify-between text-sm font-bold text-gray-800 dark:text-gray-200">
            <span>Tax (PPN 11%)</span><span class="text-gray-500 dark:text-gray-400">Rp {{ formatNumber(taxAmount) }}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 dark:bg-gray-800/60 dark:text-white">
            <span>Total (IDR)</span>
            <span class="text-primary">Rp {{ formatNumber(grandTotal) }}</span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end gap-3">
        <NuxtLink
          to="/purchase"
          class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
          Cancel
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-600"
          @click="savePurchase"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatNumber } from '~/composables/useFormatters'

const router = useRouter()

// Supplier Master
const suppliers = [
  {
    name: 'PT Kertas Jaya',
    email: 'kertasjaya@gmail.com',
    phone: '0812-3344-5566',
    address: 'Kawasan Industri Suryacipta, Karawang Timur, Jawa Barat'
  },
  {
    name: 'PT Cipta Kreasi',
    email: 'ciptakreasi@gmail.com',
    phone: '62819 0685 5554',
    address: 'Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950'
  },
  {
    name: 'CV Kimia Prima',
    email: 'kimiaprima@yahoo.com',
    phone: '0857-1122-3344',
    address: 'Jl. Rungkut Industri No. 12, Surabaya'
  },
  {
    name: 'Global Inkindo',
    email: 'info@globalinkindo.co.id',
    phone: '0813-8899-7711',
    address: 'Jl. Daan Mogot Km 11, Cengkareng, Jakarta Barat'
  }
]

const supplierSearch = ref('PT Cipta Kreasi')
const showSupplierDropdown = ref(false)
const selectedSupplier = ref<any>(suppliers[1])

const filteredSuppliers = computed(() => {
  if (!supplierSearch.value) return suppliers
  return suppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.value.toLowerCase()))
})

const selectSupplier = (s: any) => {
  selectedSupplier.value = s
  supplierSearch.value = s.name
  showSupplierDropdown.value = false
}

// Purchase Form Fields
const noPurchase = ref('PUR0000001')
const purchaseDate = ref(new Date().toISOString().slice(0, 10))
const creator = ref('Sales Staff')
const notes = ref('Pembelian stok rutin')
const paymentMethod = ref('cash')

// Master Products for search
const masterProducts = [
  { name: 'Tinta Neotex 1Kg Cyan', price: 450000, desc: 'Tinta Pigment High Quality' },
  { name: 'Kertas Art Paper A4', price: 85000, desc: '150gr, Glossy' },
  { name: 'Sticker Vinyl Putih', price: 120000, desc: 'Waterproof' },
  { name: 'Kertas Art Paper 150gr', price: 600000, desc: 'Ream plano besar' },
  { name: 'Plat CTP Thermal', price: 1500000, desc: 'Isi 50 pcs' },
  { name: 'Lem Fox 5kg', price: 185000, desc: 'Perekat jilid' }
]

// Line Items
const { data: addPurchaseData } = await useFetch<any[]>('/api/add-purchase')
const items = ref(addPurchaseData.value ?? [])

const addNewItem = () => {
  items.value.push({
    name: '',
    qty: 1,
    unit: 'Pcs',
    price: 0,
    showDropdown: false
  })
}

const removeItem = (idx: number) => {
  items.value.splice(idx, 1)
}

const selectProduct = (item: any, mp: any) => {
  item.name = mp.name
  item.price = mp.price
  item.showDropdown = false
}

// Calculations
const subTotal = computed(() => {
  return items.value.reduce((acc, curr) => acc + (curr.qty || 0) * (curr.price || 0), 0)
})

const taxAmount = computed(() => Math.round(subTotal.value * 0.11))
const grandTotal = computed(() => subTotal.value + taxAmount.value)

const savePurchase = () => {
  if (!selectedSupplier.value) {
    alert('Please select a supplier.')
    return
  }
  alert(`Purchase ${noPurchase.value} created successfully!`)
  router.push('/purchase')
}

const toggleHeader = () => {
  // collapse header utility
}
</script>