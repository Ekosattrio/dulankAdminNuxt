<template>
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
          <NuxtLink to="/purchase" class="btn btn-secondary">Cancel</NuxtLink>
          <button type="button" class="btn btn-warning text-white fw-bold" @click="savePurchase">
            Save Changes
          </button>
        </div>
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

