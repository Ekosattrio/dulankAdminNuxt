<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PosSetting } from '#server/types/pos-setting'
import { usePosSettings } from '~/composables/usePosSettings'
import { useStores } from '~/composables/useStores'
import { useCustomers } from '~/composables/useCustomers'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import PosSettingForm from './Pos/PosSettingForm.vue'
import PosSettingsReceiptPreview from './Pos/PosSettingsReceiptPreview.vue'

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
  setTimeout(() => { toastMessage.value = '' }, 3500)
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
          @click="refresh()"
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

    <!-- Skeleton Loader -->
    <div v-if="settingsPending" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div class="lg:col-span-7 space-y-6">
        <div v-for="i in 3" :key="`pos-skel-${i}`" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div class="h-5 w-44 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4 h-[400px]">
          <div class="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-44 w-full rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <p class="font-semibold mb-2">{{ error?.message || 'Gagal memuat pengaturan POS' }}</p>
      <button
        type="button"
        class="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
        @click="refresh()"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Form Section Component -->
      <PosSettingForm
        class="lg:col-span-7"
        :form="form"
        :stores="stores"
        :customers="customers"
        :available-payment-methods="availablePaymentMethods"
        @warehouse-change="onWarehouseChange"
        @customer-change="onCustomerChange"
        @toggle-payment-method="togglePaymentMethod"
      />

      <!-- Thermal Receipt Preview Component -->
      <PosSettingsReceiptPreview
        class="lg:col-span-5"
        :form="form"
      />
    </div>
  </div>
</template>
