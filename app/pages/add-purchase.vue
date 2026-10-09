<template>
<<<<<<< HEAD
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
=======
  <div class="content my-4">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Add Purchase</h4>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <div class="page-btn">
            <NuxtLink to="/purchase" class="btn btn-secondary">
              <i class="feather-arrow-left me-2"></i>Back to Purchase List
            </NuxtLink>
          </div>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <div class="card border-0 shadow p-4">
      <div class="card-body pb-0">
        <div class="row">
          <!-- Supplier Column -->
          <div class="col-lg-6 col-sm-6 col-12">
            <div class="my-3">
              <label class="form-label">Supplier:</label>
              <div class="input-groupicon select-code position-relative">
                <div class="search-container">
                  <input
                    v-model="supplierSearch"
                    type="text"
                    class="form-control"
                    placeholder="Search Supplier..."
                    @focus="showSupplierDropdown = true"
                  />
                  <div
                    v-if="showSupplierDropdown && filteredSuppliers.length > 0"
                    class="search-results position-absolute bg-white border rounded shadow w-100 p-2 mt-1 z-3"
                  >
                    <div
                      v-for="s in filteredSuppliers"
                      :key="s.name"
                      class="p-2 border-bottom cursor-pointer hover:bg-gray-100"
                      @click="selectSupplier(s)"
                    >
                      <strong>{{ s.name }}</strong>
                      <div class="small text-muted">{{ s.email }} | {{ s.phone }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedSupplier" class="mb-3 p-3 bg-light rounded border" id="data-company">
              <strong class="name text-primary">{{ selectedSupplier.name }}</strong><br />
              <small class="email text-muted">{{ selectedSupplier.email }}</small><br />
              <small class="phone text-muted">{{ selectedSupplier.phone }}</small><br />
              <small class="address text-muted">{{ selectedSupplier.address }}</small>
            </div>
          </div>

          <!-- Purchase Info Column -->
          <div class="col-lg-6 col-sm-6 col-12">
            <div class="mb-2 row align-items-center">
              <label class="form-label col-4 mb-0">No Purchase</label>
              <div class="col-8">
                <input type="text" class="form-control" v-model="noPurchase" disabled />
              </div>
            </div>

            <div class="mb-2 row align-items-center">
              <label class="form-label col-4 mb-0">Date</label>
              <div class="col-8">
                <input type="date" class="form-control" v-model="purchaseDate" />
              </div>
            </div>

            <div class="row align-items-center">
              <label class="form-label col-4 mb-0">Create</label>
              <div class="col-8">
                <input type="text" class="form-control" v-model="creator" />
              </div>
            </div>
          </div>
        </div>

        <!-- Table of Products -->
        <div class="table-responsive mt-4">
          <table class="table table-bordered align-middle" style="border-color: #ccc">
            <thead class="table-light">
              <tr>
                <th style="width: 40%">Product Name</th>
                <th style="width: 120px">Qty</th>
                <th style="width: 120px">Unit</th>
                <th style="width: 160px">Price (IDR)</th>
                <th style="width: 160px">Amount (IDR)</th>
                <th style="width: 50px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in items" :key="idx" class="product-item">
                <td>
                  <div class="product-search-container position-relative">
                    <input
                      v-model="item.name"
                      type="text"
                      class="form-control fw-bold"
                      placeholder="Cari Produk... ketik nama"
                      @focus="item.showDropdown = true"
                    />
                    <div
                      v-if="item.showDropdown"
                      class="product-search-results position-absolute bg-white border rounded shadow w-100 p-2 mt-1 z-3"
                    >
                      <div
                        v-for="mp in masterProducts"
                        :key="mp.name"
                        class="p-2 border-bottom cursor-pointer hover:bg-gray-100"
                        @click="selectProduct(item, mp)"
                      >
                        <strong>{{ mp.name }}</strong><br />
                        <small class="text-muted">Rp {{ formatNumber(mp.price) }} - {{ mp.desc }}</small>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-1">
                    <button type="button" class="btn btn-outline-secondary btn-sm px-2" @click="item.qty > 1 ? item.qty-- : 1">-</button>
                    <input
                      type="number"
                      class="form-control form-control-sm text-center"
                      v-model.number="item.qty"
                      min="1"
                    />
                    <button type="button" class="btn btn-outline-secondary btn-sm px-2" @click="item.qty++">+</button>
                  </div>
                </td>
                <td>
                  <select class="form-select form-select-sm" v-model="item.unit">
                    <option>Pcs</option>
                    <option>Box</option>
                    <option>Set</option>
                    <option>Ream</option>
                    <option>Kg</option>
                    <option>Lembar</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    class="form-control form-control-sm text-end"
                    v-model.number="item.price"
                    min="0"
                  />
                </td>
                <td class="text-end fw-bold">
                  {{ formatNumber(item.qty * item.price) }}
                </td>
                <td class="text-center">
                  <a
                    href="javascript:void(0);"
                    class="text-danger p-1"
                    @click="removeItem(idx)"
                    v-if="items.length > 1"
                  >
                    <i class="feather-trash-2"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="inline-block mb-4">
            <button type="button" class="btn btn-outline-primary mt-2" @click="addNewItem">
              <i class="feather-plus-circle me-1"></i> Add New Blank
            </button>
          </div>
        </div>

        <!-- Footer Calculation Section -->
        <div class="row mt-3">
          <div class="col-lg-4 col-12">
            <div class="input-blocks align-items-center">
              <label class="form-label fw-semibold">Purchase Notes</label>
              <textarea class="form-control" rows="3" v-model="notes" placeholder="Type purchase note..."></textarea>
            </div>
          </div>
          <div class="col-lg-4 offset-lg-4 col-sm-6 col-12">
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label mb-0 fw-semibold">Sub Total</label>
                <span class="fw-bold">Rp {{ formatNumber(subTotal) }}</span>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Payment Method</label>
              <select class="form-select" v-model="paymentMethod">
                <option value="cash">Cash</option>
                <option value="credit">Credit Card</option>
                <option value="cheque">Cheque</option>
                <option value="deposit">Deposit</option>
                <option value="points">Points</option>
              </select>
            </div>
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label mb-0 fw-semibold">Tax (PPN 11%)</label>
                <span class="text-muted">Rp {{ formatNumber(taxAmount) }}</span>
              </div>
            </div>
            <div class="p-3 bg-light rounded d-flex justify-content-between total-payment fw-bold fs-5">
              <span>Total (IDR)</span>
              <span class="text-primary">Rp {{ formatNumber(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer my-5 justify-content-end gap-2">
          <p v-if="formError" role="alert" class="mb-0 me-auto text-sm text-danger">{{ formError }}</p>
          <NuxtLink to="/purchase" class="btn btn-secondary">Cancel</NuxtLink>
          <button type="button" class="btn btn-warning text-white fw-bold" @click="savePurchase">
            Save Changes
          </button>
        </div>
>>>>>>> origin/eko
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
<<<<<<< HEAD
=======
const formError = ref('')
>>>>>>> origin/eko

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
<<<<<<< HEAD
const { data: addPurchaseData } = await useFetch<any[]>('/api/add-purchase')
const items = ref(addPurchaseData.value ?? [])
=======
const items = ref([
  {
    name: 'Tinta Neotex 1Kg Cyan',
    qty: 2,
    unit: 'Kg',
    price: 450000,
    showDropdown: false
  },
  {
    name: 'Kertas Art Paper 150gr',
    qty: 1,
    unit: 'Ream',
    price: 600000,
    showDropdown: false
  }
])
>>>>>>> origin/eko

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
<<<<<<< HEAD
  if (!selectedSupplier.value) {
    alert('Please select a supplier.')
    return
  }
  alert(`Purchase ${noPurchase.value} created successfully!`)
=======
  formError.value = ''
  if (!selectedSupplier.value) {
    formError.value = 'Please select a supplier.'
    return
  }
>>>>>>> origin/eko
  router.push('/purchase')
}

const toggleHeader = () => {
  // collapse header utility
}
<<<<<<< HEAD
</script>
=======
</script>

>>>>>>> origin/eko
