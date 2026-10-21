<script setup lang="ts">
import type { PurchaseFormData } from '#server/types/purchase'
import { formatNumber } from '~/composables/useFormatters'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formControlClass } from '~/utils/salesUi'

const props = withDefaults(
  defineProps<{
    isEdit?: boolean
    initialData?: PurchaseFormData | null
  }>(),
  {
    isEdit: false,
    initialData: null,
  },
)

const router = useRouter()
const { savePurchase } = usePurchases()
const { suppliers } = useSuppliers()
const { items: catalogItems } = usePurchaseItems()

const collapsed = ref(false)
const busy = ref(false)
const formError = ref('')

const defaultSuppliers = [
  {
    name: 'PT Kertas Jaya',
    email: 'kertasjaya@gmail.com',
    phone: '0812-3344-5566',
    address: 'Kawasan Industri Suryacipta, Karawang Timur, Jawa Barat',
  },
  {
    name: 'PT Cipta Kreasi',
    email: 'ciptakreasi@gmail.com',
    phone: '62819 0685 5554',
    address: 'Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950',
  },
  {
    name: 'CV Kimia Prima',
    email: 'kimiaprima@yahoo.com',
    phone: '0857-1122-3344',
    address: 'Jl. Rungkut Industri No. 12, Surabaya',
  },
  {
    name: 'Global Inkindo',
    email: 'info@globalinkindo.co.id',
    phone: '0813-8899-7711',
    address: 'Jl. Daan Mogot Km 11, Cengkareng, Jakarta Barat',
  },
]

const supplierSearch = ref('PT Cipta Kreasi')
const showSupplierDropdown = ref(false)
const selectedSupplier = ref(defaultSuppliers[1])

const availableSuppliers = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map((s) => ({
      name: s.name,
      email: s.email || '-',
      phone: s.contact || '-',
      address: s.picName ? `PIC: ${s.picName}` : '-',
    }))
  }
  return defaultSuppliers
})

const filteredSuppliers = computed(() => {
  if (!supplierSearch.value.trim()) return availableSuppliers.value
  const q = supplierSearch.value.toLowerCase()
  return availableSuppliers.value.filter((s) => s.name.toLowerCase().includes(q))
})

function selectSupplier(s: { name: string; email: string; phone: string; address: string }) {
  selectedSupplier.value = s
  supplierSearch.value = s.name
  showSupplierDropdown.value = false
}

// Purchase Header Fields
const noPurchase = ref('PUR0000001')
const purchaseDate = ref(new Date().toISOString().slice(0, 10))
const creator = ref('Sales Staff')
const notes = ref('Pembelian stok rutin')
const paymentMethod = ref('cash')
const orderStatus = ref<'Ordered' | 'Received' | 'Complete' | 'Pending'>('Ordered')
const shippingCost = ref(0)
const paid = ref(0)

const unitOptions = ['Lembar', 'Kg', 'Botol', 'Roll', 'Pcs', 'Box', 'Ream', 'Meter', 'Set']

interface LineItem {
  name: string
  qty: number
  unit: string
  price: number
  showDropdown?: boolean
}

const items = ref<LineItem[]>([
  {
    name: 'Tinta Neotex 1Kg Cyan',
    qty: 2,
    unit: 'Kg',
    price: 450000,
    showDropdown: false,
  },
  {
    name: 'Kertas Art Paper 150gr',
    qty: 1,
    unit: 'Ream',
    price: 600000,
    showDropdown: false,
  },
])

const defaultCatalog = [
  { name: 'Tinta Neotex 1Kg Cyan', price: 450000, desc: 'Tinta Pigment High Quality' },
  { name: 'Kertas Art Paper A4', price: 85000, desc: '150gr, Glossy' },
  { name: 'Sticker Vinyl Putih', price: 120000, desc: 'Waterproof' },
  { name: 'Kertas Art Paper 150gr', price: 600000, desc: 'Ream plano besar' },
  { name: 'Plat CTP Thermal', price: 1500000, desc: 'Isi 50 pcs' },
  { name: 'Lem Fox 5kg', price: 185000, desc: 'Perekat jilid' },
]

const productCatalog = computed(() => {
  if (catalogItems.value && catalogItems.value.length > 0) {
    return catalogItems.value.map((c) => ({
      name: c.product,
      price: c.price,
      desc: c.unit || '',
    }))
  }
  return defaultCatalog
})

function addNewItem() {
  items.value.push({
    name: '',
    qty: 1,
    unit: 'Pcs',
    price: 0,
    showDropdown: false,
  })
}

function removeItem(idx: number) {
  if (items.value.length > 1) {
    items.value.splice(idx, 1)
  }
}

function selectProduct(item: LineItem, p: { name: string; price: number }) {
  item.name = p.name
  item.price = p.price
  item.showDropdown = false
}

const subTotal = computed(() =>
  items.value.reduce((acc, curr) => acc + (Number(curr.qty) || 0) * (Number(curr.price) || 0), 0),
)
const taxAmount = computed(() => Math.round(subTotal.value * 0.11))
const grandTotal = computed(() => subTotal.value + taxAmount.value + Number(shippingCost.value || 0))
const dueAmount = computed(() => Math.max(0, grandTotal.value - Number(paid.value || 0)))

async function handleSubmit() {
  formError.value = ''
  if (!selectedSupplier.value?.name?.trim()) {
    formError.value = 'Please select a supplier.'
    return
  }

  const validItems = items.value.filter((i) => i.name.trim() !== '')
  if (validItems.length === 0) {
    formError.value = 'Please add at least one product with name.'
    return
  }

  busy.value = true
  try {
    const payload: PurchaseFormData = {
      supplier: selectedSupplier.value.name,
      date: purchaseDate.value,
      status: orderStatus.value,
      shippingCost: shippingCost.value,
      paid: paid.value,
      notes: notes.value,
      items: validItems.map((i) => ({
        name: i.name,
        qty: i.qty,
        unit: i.unit,
        price: i.price,
      })),
    }

    await savePurchase(payload)
    await router.push('/purchase')
  } catch (err: any) {
    formError.value = err?.data?.message || err?.message || 'Failed to save purchase'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isEdit ? 'Edit Purchase' : 'Add Purchase' }}
        </h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Buat pesanan pembelian bahan baku dan stok produk
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/purchase"
          class="inline-flex h-9 items-center gap-2 rounded border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <FeatherIcon name="arrow-left" :size="14" />
          <span>Back to Purchase List</span>
        </NuxtLink>

        <button
          type="button"
          title="Collapse"
          aria-label="Collapse"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="collapsed = !collapsed"
        >
          <FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" />
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div
      v-if="formError"
      class="rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      {{ formError }}
    </div>

    <!-- Main Content Form -->
    <div v-show="!collapsed" class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Supplier Column -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Supplier: <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="supplierSearch"
              type="text"
              placeholder="Search Supplier..."
              :class="formControlClass"
              @focus="showSupplierDropdown = true"
            />
            <div
              v-if="showSupplierDropdown && filteredSuppliers.length > 0"
              class="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div
                v-for="s in filteredSuppliers"
                :key="s.name"
                class="cursor-pointer rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="selectSupplier(s)"
              >
                <strong class="text-gray-900 dark:text-white">{{ s.name }}</strong>
                <div class="text-gray-500 dark:text-gray-400">{{ s.email }} | {{ s.phone }}</div>
              </div>
            </div>
          </div>

          <div v-if="selectedSupplier" class="mt-3 rounded border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-800/40">
            <strong class="text-primary dark:text-primary-400 font-semibold text-sm">{{ selectedSupplier.name }}</strong>
            <div class="text-gray-600 dark:text-gray-300 mt-1">{{ selectedSupplier.email }}</div>
            <div class="text-gray-600 dark:text-gray-300">{{ selectedSupplier.phone }}</div>
            <div class="text-gray-500 dark:text-gray-400 mt-1">{{ selectedSupplier.address }}</div>
          </div>
        </div>

        <!-- Purchase Info Column -->
        <div class="space-y-3">
          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">No Purchase</label>
            <div class="col-span-8">
              <input type="text" :value="noPurchase" disabled :class="[formControlClass, 'bg-gray-100 dark:bg-gray-800']" />
            </div>
          </div>

          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Date</label>
            <div class="col-span-8">
              <input v-model="purchaseDate" type="date" :class="formControlClass" />
            </div>
          </div>

          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Create</label>
            <div class="col-span-8">
              <input v-model="creator" type="text" :class="formControlClass" />
            </div>
          </div>

          <div class="grid grid-cols-12 items-center gap-2">
            <label class="col-span-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <div class="col-span-8">
              <select v-model="orderStatus" :class="formControlClass">
                <option value="Ordered">Ordered</option>
                <option value="Received">Received</option>
                <option value="Complete">Complete</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Items Table -->
      <div class="mt-8">
        <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th class="px-3 py-2.5 w-[40%]">Product Name</th>
                <th class="px-3 py-2.5 text-center w-[120px]">Qty</th>
                <th class="px-3 py-2.5 text-center w-[120px]">Unit</th>
                <th class="px-3 py-2.5 text-right w-[160px]">Price (IDR)</th>
                <th class="px-3 py-2.5 text-right w-[160px]">Amount (IDR)</th>
                <th class="px-2 py-2.5 text-center w-[50px]">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              <tr v-for="(item, idx) in items" :key="idx">
                <td class="p-2">
                  <div class="relative">
                    <input
                      v-model="item.name"
                      type="text"
                      placeholder="Cari Produk... ketik nama"
                      :class="[formControlClass, 'font-semibold']"
                      @focus="item.showDropdown = true"
                    />
                    <div
                      v-if="item.showDropdown"
                      class="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div
                        v-for="p in productCatalog"
                        :key="p.name"
                        class="cursor-pointer rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="selectProduct(item, p)"
                      >
                        <strong class="text-gray-900 dark:text-white">{{ p.name }}</strong>
                        <div class="text-gray-500">Rp {{ formatNumber(p.price) }} - {{ p.desc }}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-2 text-center">
                  <div class="inline-flex items-center rounded border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      class="h-9 px-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      @click="item.qty > 1 ? item.qty-- : 1"
                    >
                      -
                    </button>
                    <input
                      v-model.number="item.qty"
                      type="number"
                      min="1"
                      class="h-9 w-12 border-x border-gray-200 bg-transparent text-center text-xs font-semibold focus:outline-hidden dark:border-gray-700"
                    />
                    <button
                      type="button"
                      class="h-9 px-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      @click="item.qty++"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="p-2">
                  <select v-model="item.unit" :class="formControlClass">
                    <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
                  </select>
                </td>
                <td class="p-2">
                  <CurrencyInput
                    v-model="item.price"
                    thousand-separator="."
                    align="right"
                    size="sm"
                    :disabled="busy"
                  />
                </td>
                <td class="p-2 text-right font-bold tabular-nums text-gray-900 dark:text-white">
                  Rp {{ formatNumber(item.qty * item.price) }}
                </td>
                <td class="p-2 text-center">
                  <button
                    v-if="items.length > 1"
                    type="button"
                    class="text-rose-500 hover:text-rose-700 p-1"
                    @click="removeItem(idx)"
                  >
                    <FeatherIcon name="trash-2" :size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          type="button"
          class="mt-3 inline-flex items-center gap-1.5 rounded border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 dark:text-primary-400"
          @click="addNewItem"
        >
          <FeatherIcon name="plus-circle" :size="14" />
          <span>Add New Blank</span>
        </button>
      </div>

      <!-- Footer Calculation Section -->
      <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Purchase Notes
          </label>
          <textarea
            v-model="notes"
            rows="4"
            placeholder="Type purchase note..."
            :class="formControlClass"
          />
        </div>

        <div class="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Sub Total</span>
            <span class="font-bold tabular-nums">Rp {{ formatNumber(subTotal) }}</span>
          </div>

          <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Payment Method</span>
            <select v-model="paymentMethod" :class="[formControlClass, 'w-44']">
              <option value="cash">Cash</option>
              <option value="credit">Credit Card</option>
              <option value="cheque">Cheque</option>
              <option value="deposit">Deposit</option>
              <option value="points">Points</option>
            </select>
          </div>

          <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Tax (PPN 11%)</span>
            <span class="tabular-nums text-gray-600 dark:text-gray-400">Rp {{ formatNumber(taxAmount) }}</span>
          </div>

          <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Biaya Kirim (Shipping)</span>
            <div class="w-36">
              <CurrencyInput
                v-model="shippingCost"
                thousand-separator="."
                align="right"
                size="sm"
                :disabled="busy"
              />
            </div>
          </div>

          <div class="flex justify-between items-center border-t border-gray-200 pt-3 text-sm font-bold text-gray-900 dark:border-gray-700 dark:text-white">
            <span>Total (IDR)</span>
            <span class="text-primary dark:text-primary-400 tabular-nums">Rp {{ formatNumber(grandTotal) }}</span>
          </div>

          <div class="flex justify-between items-center border-t border-gray-200 pt-3 dark:border-gray-700">
            <span class="font-semibold text-emerald-600">Nominal Bayar (Paid)</span>
            <div class="w-36">
              <CurrencyInput
                v-model="paid"
                thousand-separator="."
                align="right"
                size="sm"
                :disabled="busy"
              />
            </div>
          </div>

          <div class="flex justify-between items-center font-bold" :class="dueAmount > 0 ? 'text-rose-600' : 'text-gray-500'">
            <span>Sisa Hutang (Due)</span>
            <span class="tabular-nums">Rp {{ formatNumber(dueAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <NuxtLink
          to="/purchase"
          class="inline-flex h-9 items-center justify-center rounded border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          Cancel
        </NuxtLink>
        <button
          type="button"
          :disabled="busy"
          class="inline-flex h-9 items-center justify-center rounded bg-amber-500 px-5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
          @click="handleSubmit"
        >
          <span v-if="busy" class="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          {{ isEdit ? 'Update Purchase' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>
