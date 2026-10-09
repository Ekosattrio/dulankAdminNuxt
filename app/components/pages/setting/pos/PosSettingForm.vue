<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { PosSetting } from '#server/types/pos-setting'

const props = defineProps<{
  form: PosSetting
  stores: any[]
  customers: any[]
  availablePaymentMethods: string[]
}>()

const emit = defineEmits<{
  'warehouse-change': []
  'customer-change': []
  'toggle-payment-method': [method: string]
}>()
</script>

<template>
  <div class="space-y-6">
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
            @change="emit('warehouse-change')"
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
            @change="emit('customer-change')"
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
          @click="emit('toggle-payment-method', method)"
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
</template>

