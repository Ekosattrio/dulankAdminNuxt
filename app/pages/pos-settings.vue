<script setup lang="ts">
import type { PosSetting } from '#server/types/pos-setting'
import { usePosSettings } from '~/composables/usePosSettings'
import { useStores } from '~/composables/useStores'
import { useCustomers } from '~/composables/useCustomers'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'POS Settings - Konfigurasi Kasir & Thermal Printer',
  sweetAlert: false
})

const { settings, pending: settingsPending, error, refresh, saveSettings } = usePosSettings()
const { stores } = useStores()
const { customers } = useCustomers()

const isSaving = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const availablePaymentMethods = [
  'Cash',
  'QRIS',
  'Card / EDC',
  'Bank Transfer',
  'COD',
  'Cheque'
]

const form = ref<PosSetting>({
  id: 'pos-setting-1',
  defaultCustomerId: 'ID000002',
  defaultCustomerName: 'Siti Aminah (General / Walk-in)',
  defaultWarehouseId: '1',
  defaultWarehouseName: 'Kacetak Pusat Karawang Barat',
  printerType: 'Thermal 80mm',
  autoPrintReceipt: true,
  enableSoundEffect: true,
  barcodeScannerMode: 'instant_add',
  allowedPaymentMethods: ['Cash', 'QRIS', 'Card / EDC', 'Bank Transfer'],
  receiptHeaderNotes: 'SELAMAT DATANG DI KACETAK POS',
  receiptFooterNotes: 'Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali cacat produksi. Terima kasih atas kunjungan Anda!',
  showTaxOnReceipt: true,
  showCashierName: true,
  showCustomerDetails: true
})

// Sync fetched data
watch(
  settings,
  (val) => {
    if (val) {
      form.value = {
        id: val.id || 'pos-setting-1',
        defaultCustomerId: val.defaultCustomerId || 'ID000002',
        defaultCustomerName: val.defaultCustomerName || 'Pelanggan Umum (Walk-in)',
        defaultWarehouseId: val.defaultWarehouseId || '1',
        defaultWarehouseName: val.defaultWarehouseName || 'Kacetak Pusat Karawang Barat',
        printerType: val.printerType || 'Thermal 80mm',
        autoPrintReceipt: val.autoPrintReceipt !== false,
        enableSoundEffect: val.enableSoundEffect !== false,
        barcodeScannerMode: val.barcodeScannerMode || 'instant_add',
        allowedPaymentMethods: Array.isArray(val.allowedPaymentMethods)
          ? [...val.allowedPaymentMethods]
          : ['Cash', 'QRIS', 'Card / EDC'],
        receiptHeaderNotes: val.receiptHeaderNotes ?? 'SELAMAT DATANG DI KACETAK POS',
        receiptFooterNotes: val.receiptFooterNotes ?? 'Barang yang sudah dibeli tidak dapat ditukar. Terima kasih!',
        showTaxOnReceipt: val.showTaxOnReceipt !== false,
        showCashierName: val.showCashierName !== false,
        showCustomerDetails: val.showCustomerDetails !== false
      }
    }
  },
  { immediate: true }
)

// When selecting customer or warehouse dropdown, update name as well
function onCustomerChange() {
  const found = customers.value.find((c) => c.id === form.value.defaultCustomerId)
  if (found) {
    form.value.defaultCustomerName = found.name
  }
}

function onWarehouseChange() {
  const found = stores.value.find((s) => s.id === form.value.defaultWarehouseId)
  if (found) {
    form.value.defaultWarehouseName = found.storeName
  }
}

function togglePaymentMethod(method: string) {
  const idx = form.value.allowedPaymentMethods.indexOf(method)
  if (idx > -1) {
    if (form.value.allowedPaymentMethods.length === 1) {
      showToast('Minimal 1 metode pembayaran kasir harus aktif.', 'error')
      return
    }
    form.value.allowedPaymentMethods.splice(idx, 1)
  } else {
    form.value.allowedPaymentMethods.push(method)
  }
}

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

async function handleSave() {
  try {
    isSaving.value = true
    await saveSettings(form.value)
    showToast('Pengaturan POS Kasir berhasil disimpan!')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan pengaturan POS', 'error')
  } finally {
    isSaving.value = false
  }
}

// Thermal receipt preview items
const receiptSampleItems = [
  { name: 'Cetak Art Paper A3+', qty: 10, price: 6000, total: 60000 },
  { name: 'Finishing Jilid Spiral', qty: 2, price: 15000, total: 30000 },
  { name: 'Laminasi Doff A3+', qty: 10, price: 3000, total: 30000 }
]

const receiptSubtotal = computed(() => {
  return receiptSampleItems.reduce((acc, it) => acc + it.total, 0)
})

const receiptTax = computed(() => {
  return form.value.showTaxOnReceipt ? Math.round(receiptSubtotal.value * 0.11) : 0
})

const receiptTotal = computed(() => {
  return receiptSubtotal.value + receiptTax.value
})

function formatRupiah(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div class="space-y-6 p-4 md:p-6 min-h-screen bg-gray-50/50 dark:bg-gray-950/40">
    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-2xl transition-all"
      :class="toastType === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
    >
      <FeatherIcon :name="toastType === 'success' ? 'check-circle' : 'alert-triangle'" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FeatherIcon name="shopping-cart" size="18" />
          </span>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">POS Settings</h2>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Konfigurasi register Point of Sale (POS), printer kasir thermal, pemindai barcode, dan kustomisasi struk transaksi.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 transition shadow-sm"
          :disabled="isSaving || settingsPending"
          @click="refresh"
        >
          <FeatherIcon name="rotate-ccw" size="13" />
          <span>Reset Form</span>
        </button>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition"
          :disabled="isSaving || settingsPending"
          @click="handleSave"
        >
          <FeatherIcon v-if="!isSaving" name="save" size="14" />
          <svg v-else class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader when fetching settings -->
    <div v-if="settingsPending" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div class="lg:col-span-7 space-y-6">
        <div v-for="i in 3" :key="`pos-skel-${i}`" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div class="h-5 w-44 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div class="h-16 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4 h-[540px]">
          <div class="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-8 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-44 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-20 w-full rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <p class="font-semibold mb-2">{{ error ? (error.message || 'Gagal memuat pengaturan POS') : '' }}</p>
      <button
        type="button"
        class="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
        @click="refresh"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- FORM COLUMN (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 1. Default Lokasi & Pelanggan Kasir -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="map-pin" size="16" class="text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Default Cabang & Pelanggan Kasir</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Default Warehouse / Cabang Toko</label>
              <select
                v-model="form.defaultWarehouseId"
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                @change="onWarehouseChange"
              >
                <option v-if="stores.length === 0" :value="form.defaultWarehouseId">
                  {{ form.defaultWarehouseName || 'Cabang Utama' }}
                </option>
                <option v-for="store in stores" :key="store.id" :value="store.id">
                  {{ store.storeName }}
                </option>
              </select>
              <span class="text-[10px] text-gray-400 mt-0.5 block">Lokasi register kasir aktif dan pemotongan stok default</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Default Customer Transaksi</label>
              <select
                v-model="form.defaultCustomerId"
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                @change="onCustomerChange"
              >
                <option v-if="customers.length === 0" :value="form.defaultCustomerId">
                  {{ form.defaultCustomerName || 'Pelanggan Umum (Walk-in)' }}
                </option>
                <option v-for="cust in customers" :key="cust.id" :value="cust.id">
                  {{ cust.name }} ({{ cust.type || 'General' }})
                </option>
              </select>
              <span class="text-[10px] text-gray-400 mt-0.5 block">Digunakan otomatis jika kasir tidak memilih pelanggan khusus</span>
            </div>
          </div>
        </div>

        <!-- 2. Konfigurasi Printer & Cetak Struk -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="printer" size="16" class="text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Printer Struk & Otomasi Checkout</h3>
          </div>

          <div class="space-y-4">
            <!-- Printer Size Selection -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipe Format Kertas Printer</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                  :class="form.printerType === 'Thermal 80mm' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-bold' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                >
                  <input
                    v-model="form.printerType"
                    type="radio"
                    value="Thermal 80mm"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div class="text-xs font-semibold">Thermal 80mm</div>
                    <div class="text-[10px] text-gray-400">Standar Kasir POS</div>
                  </div>
                </label>

                <label
                  class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                  :class="form.printerType === 'Thermal 58mm' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-bold' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                >
                  <input
                    v-model="form.printerType"
                    type="radio"
                    value="Thermal 58mm"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div class="text-xs font-semibold">Thermal 58mm</div>
                    <div class="text-[10px] text-gray-400">Mini Portable / Mobile</div>
                  </div>
                </label>

                <label
                  class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                  :class="form.printerType === 'A4' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-bold' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                >
                  <input
                    v-model="form.printerType"
                    type="radio"
                    value="A4"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div class="text-xs font-semibold">A4 Full Page</div>
                    <div class="text-[10px] text-gray-400">Faktur Kertas Penuh</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Toggles for auto print & sound -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <label class="flex items-start gap-3 p-3 rounded-xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 cursor-pointer">
                <input
                  v-model="form.autoPrintReceipt"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Auto Print on Checkout</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">Otomatis kirim perintah cetak struk sesaat setelah kasir menekan tombol bayar</div>
                </div>
              </label>

              <label class="flex items-start gap-3 p-3 rounded-xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 cursor-pointer">
                <input
                  v-model="form.enableSoundEffect"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Sound Effect (Audio Beep)</div>
                  <div class="text-[11px] text-gray-400 mt-0.5">Bunyikan nada konfirmasi saat barcode discan atau transaksi sukses</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 3. Barcode Scanner Mode -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="maximize" size="16" class="text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Barcode Scanner Mode</h3>
          </div>

          <div class="space-y-3">
            <label
              class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition"
              :class="form.barcodeScannerMode === 'instant_add' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
            >
              <input
                v-model="form.barcodeScannerMode"
                type="radio"
                value="instant_add"
                class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div class="text-xs font-bold text-gray-900 dark:text-gray-100">Instant Add to Cart (Rekomendasi)</div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Setiap kali scanner memindai barcode, kuantitas produk otomatis bertambah +1 ke keranjang belanja kasir.</div>
              </div>
            </label>

            <label
              class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition"
              :class="form.barcodeScannerMode === 'manual_add' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
            >
              <input
                v-model="form.barcodeScannerMode"
                type="radio"
                value="manual_add"
                class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div class="text-xs font-bold text-gray-900 dark:text-gray-100">Focus Qty Input (Popup Prompt)</div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Setelah scan, sistem membuka input kuantitas agar kasir dapat memasukkan jumlah banyak secara manual.</div>
              </div>
            </label>

            <label
              class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition"
              :class="form.barcodeScannerMode === 'bulk_continuous' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
            >
              <input
                v-model="form.barcodeScannerMode"
                type="radio"
                value="bulk_continuous"
                class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div class="text-xs font-bold text-gray-900 dark:text-gray-100">Continuous Fast-Scan</div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Mode kasir cepat antrian panjang: scan beruntun tanpa delay dan tanpa animasi transisi tambahan.</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 4. Metode Pembayaran yang Diaktifkan -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="credit-card" size="16" class="text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Metode Pembayaran Kasir POS</h3>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="method in availablePaymentMethods"
              :key="method"
              type="button"
              class="flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition"
              :class="form.allowedPaymentMethods.includes(method) ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 shadow-xs' : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300'"
              @click="togglePaymentMethod(method)"
            >
              <span
                class="flex items-center justify-center w-5 h-5 rounded-md border"
                :class="form.allowedPaymentMethods.includes(method) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'"
              >
                <FeatherIcon v-if="form.allowedPaymentMethods.includes(method)" name="check" size="12" stroke-width="3" />
              </span>
              <span>{{ method }}</span>
            </button>
          </div>
        </div>

        <!-- 5. Kustomisasi Konten Struk Kasir -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="file-text" size="16" class="text-emerald-600 dark:text-emerald-400" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Pesan & Keterangan Struk (Receipt Notes)</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pesan Sambutan Header Struk</label>
              <input
                v-model="form.receiptHeaderNotes"
                type="text"
                placeholder="SELAMAT DATANG DI KACETAK POS"
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan Kaki Struk (Receipt Footer Notes)</label>
              <textarea
                v-model="form.receiptFooterNotes"
                rows="3"
                placeholder="Barang yang sudah dibeli tidak dapat ditukar..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <!-- Receipt Display Toggles -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input
                  v-model="form.showTaxOnReceipt"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">Tampilkan PPN</span>
              </label>

              <label class="flex items-center gap-2.5 cursor-pointer">
                <input
                  v-model="form.showCashierName"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">Nama Petugas Kasir</span>
              </label>

              <label class="flex items-center gap-2.5 cursor-pointer">
                <input
                  v-model="form.showCustomerDetails"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">Nama Pelanggan</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- LIVE RECEIPT PREVIEW COLUMN (5 cols) -->
      <div class="lg:col-span-5 sticky top-6 space-y-4">
        <!-- Preview Banner Header -->
        <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-900 text-white shadow-md dark:bg-gray-800">
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Receipt Preview</span>
          </div>
          <span class="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-gray-800 dark:bg-gray-700 px-2.5 py-0.5 rounded">
            Format: {{ form.printerType }}
          </span>
        </div>

        <!-- Receipt Wrapper / Thermal Paper Simulation -->
        <div class="flex justify-center">
          <div
            class="rounded-xl border border-gray-300 bg-white p-5 shadow-2xl text-gray-900 font-mono transition-all overflow-hidden"
            :class="{
              'w-full max-w-[340px] text-xs': form.printerType === 'Thermal 80mm',
              'w-full max-w-[280px] text-[11px]': form.printerType === 'Thermal 58mm',
              'w-full max-w-[420px] text-xs': form.printerType === 'A4'
            }"
            style="background: #fafaf8; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06);"
          >
            <!-- Receipt Header -->
            <div class="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
              <div class="font-black text-sm uppercase tracking-wide">
                {{ form.defaultWarehouseName || 'KACETAK SYSTEM' }}
              </div>
              <div class="text-[10px] text-gray-600 leading-tight">
                Jl. Percetakan Negara No. 88, Jakarta Pusat<br />
                Telp: +62 21 4256 7890
              </div>
              <div v-if="form.receiptHeaderNotes" class="text-[10px] font-bold text-gray-700 pt-1 tracking-wider uppercase">
                *** {{ form.receiptHeaderNotes }} ***
              </div>
            </div>

            <!-- Receipt Metadata -->
            <div class="py-2.5 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
              <div class="flex justify-between">
                <span>No: #POS-202610-0082</span>
                <span>{{ new Date().toLocaleDateString('id-ID') }}</span>
              </div>
              <div v-if="form.showCashierName" class="flex justify-between">
                <span>Kasir: Thomas (Register 01)</span>
                <span>{{ new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <div v-if="form.showCustomerDetails" class="flex justify-between">
                <span>Pelanggan:</span>
                <span class="font-semibold">{{ form.defaultCustomerName || 'Pelanggan Umum' }}</span>
              </div>
            </div>

            <!-- Itemized Table -->
            <div class="py-3 border-b border-dashed border-gray-400 space-y-2">
              <div v-for="(it, idx) in receiptSampleItems" :key="idx" class="space-y-0.5">
                <div class="font-bold truncate">{{ it.name }}</div>
                <div class="flex justify-between text-[11px] text-gray-700">
                  <span>{{ it.qty }} x {{ formatRupiah(it.price) }}</span>
                  <span class="font-semibold">{{ formatRupiah(it.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Total Calculation -->
            <div class="py-2.5 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
              <div class="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{{ formatRupiah(receiptSubtotal) }}</span>
              </div>
              <div v-if="form.showTaxOnReceipt" class="flex justify-between">
                <span>PPN 11%:</span>
                <span>{{ formatRupiah(receiptTax) }}</span>
              </div>
              <div class="flex justify-between font-black text-sm pt-1 border-t border-dotted border-gray-400">
                <span>TOTAL:</span>
                <span>{{ formatRupiah(receiptTotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-700 pt-0.5">
                <span>BAYAR (TUNAI):</span>
                <span>Rp 150.000</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>KEMBALIAN:</span>
                <span>{{ formatRupiah(150000 - receiptTotal) }}</span>
              </div>
            </div>

            <!-- Payment Methods Info -->
            <div class="py-2 text-[10px] text-gray-500 border-b border-dashed border-gray-400">
              <div class="text-[9px] font-bold uppercase text-gray-400">Metode Tersedia:</div>
              <div class="flex flex-wrap gap-1 mt-0.5">
                <span
                  v-for="pm in form.allowedPaymentMethods"
                  :key="pm"
                  class="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold text-[9px]"
                >
                  {{ pm }}
                </span>
              </div>
            </div>

            <!-- Footer Message / Barcode Simulation -->
            <div class="text-center pt-3 space-y-2">
              <p v-if="form.receiptFooterNotes" class="text-[10px] text-gray-600 leading-snug">
                {{ form.receiptFooterNotes }}
              </p>

              <!-- Simulated Barcode Lines -->
              <div class="pt-1 flex flex-col items-center">
                <div class="flex items-center justify-center gap-[2px] h-8 w-44">
                  <span class="h-full w-[2px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                  <span class="h-full w-[3px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                  <span class="h-full w-[2px] bg-black"></span>
                  <span class="h-full w-[4px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                  <span class="h-full w-[2px] bg-black"></span>
                  <span class="h-full w-[3px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                  <span class="h-full w-[2px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                  <span class="h-full w-[4px] bg-black"></span>
                  <span class="h-full w-[2px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                  <span class="h-full w-[3px] bg-black"></span>
                  <span class="h-full w-[2px] bg-black"></span>
                  <span class="h-full w-[1px] bg-black"></span>
                </div>
                <span class="text-[9px] tracking-widest text-gray-600 mt-0.5">POS-202610-0082</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
