<script setup lang="ts">
import type { InvoiceSetting } from '#server/types/invoice-setting'
import { useInvoiceSettings } from '~/composables/useInvoiceSettings'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Invoice Settings - Konfigurasi & Preview Faktur',
  sweetAlert: false
})

const { settings, pending, error, refresh, saveSettings } = useInvoiceSettings()

const isSaving = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const form = ref<InvoiceSetting>({
  id: 'inv-setting-1',
  logoUrl: '/assets/img/logo.png',
  companyName: 'PT. Dulank Semesta Cida',
  companyEmail: 'billing@dulanksemesta.com',
  companyPhone: '+62 21 4256 7890',
  companyAddress: 'Jl. Percetakan Negara No. 88, Jakarta Pusat, DKI Jakarta 10560',
  prefix: 'INV-',
  numberPadding: 4,
  nextNumber: 1042,
  dueDays: 7,
  roundOffEnabled: true,
  roundOffType: 'Round Off Up',
  showCompanyDetails: true,
  headerTerms: 'Terima kasih atas pesanan Anda di Percetakan Kacetak Dulank System.',
  footerTerms: 'Pembayaran wajib ditransfer ke rekening resmi sebelum tanggal jatuh tempo. Harap simpan bukti pembayaran ini sebagai bukti transaksi sah.',
  bankDetails: {
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '8830-1928-3341',
    accountHolder: 'PT DULANK SEMESTA CIDA'
  },
  taxPercentage: 11
})

watch(
  settings,
  (val) => {
    if (val) {
      form.value = {
        id: val.id || 'inv-setting-1',
        logoUrl: val.logoUrl || '/assets/img/logo.png',
        companyName: val.companyName || 'PT. Dulank Semesta Cida',
        companyEmail: val.companyEmail || 'billing@dulanksemesta.com',
        companyPhone: val.companyPhone || '+62 21 4256 7890',
        companyAddress: val.companyAddress || 'Jl. Percetakan Negara No. 88, Jakarta Pusat, DKI Jakarta 10560',
        prefix: val.prefix || 'INV-',
        numberPadding: Number(val.numberPadding) || 4,
        nextNumber: Number(val.nextNumber) || 1042,
        dueDays: Number(val.dueDays) || 7,
        roundOffEnabled: val.roundOffEnabled !== false,
        roundOffType: val.roundOffType || 'Round Off Up',
        showCompanyDetails: val.showCompanyDetails !== false,
        headerTerms: val.headerTerms || '',
        footerTerms: val.footerTerms || '',
        bankDetails: {
          bankName: val.bankDetails?.bankName || 'Bank Central Asia (BCA)',
          accountNumber: val.bankDetails?.accountNumber || '8830-1928-3341',
          accountHolder: val.bankDetails?.accountHolder || 'PT DULANK SEMESTA CIDA'
        },
        taxPercentage: Number(val.taxPercentage) ?? 11
      }
    }
  },
  { immediate: true }
)

const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onLogoSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        form.value.logoUrl = event.target.result as string
      }
    }
    reader.readAsDataURL(file)
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
    showToast('Pengaturan invoice berhasil disimpan!')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan pengaturan invoice', 'error')
  } finally {
    isSaving.value = false
  }
}

// Live Preview Computations
const formattedInvoiceNumber = computed(() => {
  const numStr = String(form.value.nextNumber || 1).padStart(form.value.numberPadding || 1, '0')
  return `${form.value.prefix || ''}${numStr}`
})

const previewIssueDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
})

const previewDueDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + (Number(form.value.dueDays) || 7))
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
})

// Sample items for preview
const sampleItems = [
  { desc: 'Cetak Brosur A4 Full Color (1.000 Lembar)', qty: 1, price: 650000 },
  { desc: 'Roll Up Banner 60x160cm Albatros + Lamination', qty: 2, price: 185000 }
]

const previewSubtotal = computed(() => {
  return sampleItems.reduce((acc, it) => acc + it.qty * it.price, 0)
})

const previewTax = computed(() => {
  const pct = Number(form.value.taxPercentage) || 0
  return Math.round((previewSubtotal.value * pct) / 100)
})

const rawTotal = computed(() => previewSubtotal.value + previewTax.value)

const previewRoundOffAdjustment = computed(() => {
  if (!form.value.roundOffEnabled) return 0
  const total = rawTotal.value
  if (form.value.roundOffType === 'Round Off Up') {
    return Math.ceil(total / 1000) * 1000 - total
  } else if (form.value.roundOffType === 'Round Off Down') {
    return Math.floor(total / 1000) * 1000 - total
  } else if (form.value.roundOffType === 'Nearest 100') {
    return Math.round(total / 100) * 100 - total
  } else if (form.value.roundOffType === 'Nearest 1000') {
    return Math.round(total / 1000) * 1000 - total
  }
  return 0
})

const previewGrandTotal = computed(() => {
  return rawTotal.value + previewRoundOffAdjustment.value
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
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FeatherIcon name="file-text" size="18" />
          </span>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Invoice Settings</h2>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Kustomisasi format penomoran, identitas tagihan, ketentuan pembayaran, dan lihat perubahan pada live preview interaktif.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 transition shadow-sm"
          :disabled="isSaving || pending"
          @click="refresh"
        >
          <FeatherIcon name="rotate-ccw" size="13" />
          <span>Reset Form</span>
        </button>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-5 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition"
          :disabled="isSaving || pending"
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

    <!-- Skeleton Loader when fetching data -->
    <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div class="lg:col-span-7 space-y-6">
        <div v-for="i in 3" :key="`inv-skel-${i}`" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div class="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div class="h-20 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4 h-[580px]">
          <div class="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-12 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-48 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-24 w-full rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <p class="font-semibold mb-2">{{ error ? (error.message || 'Gagal memuat pengaturan invoice') : '' }}</p>
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
        <!-- 1. Header & Logo Perusahaan -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="image" size="16" class="text-amber-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Logo & Identitas Perusahaan</h3>
          </div>

          <div class="space-y-4">
            <!-- Upload Box & Preview -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
              <div class="flex-shrink-0 w-24 h-16 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  :src="form.logoUrl || '/assets/img/logo.png'"
                  alt="Invoice Logo"
                  class="max-h-full max-w-full object-contain"
                />
              </div>

              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onLogoSelected"
                  />
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition"
                    @click="triggerFileInput"
                  >
                    <FeatherIcon name="upload" size="13" />
                    <span>Upload Logo Baru</span>
                  </button>
                  <button
                    v-if="form.logoUrl !== '/assets/img/logo.png'"
                    type="button"
                    class="text-xs text-gray-500 hover:text-red-500 transition px-2 py-1"
                    @click="form.logoUrl = '/assets/img/logo.png'"
                  >
                    Reset Default
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 dark:text-gray-400">
                  Rekomendasi rasio 1:1 atau banner horizontal (PNG/JPG/WebP, maks 5MB). Logo akan tercetak pada kop faktur.
                </p>
              </div>
            </div>

            <!-- Identitas Perusahaan -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Perusahaan</label>
                <input
                  v-model="form.companyName"
                  type="text"
                  placeholder="PT. Nama Usaha Anda"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Billing</label>
                <input
                  v-model="form.companyEmail"
                  type="email"
                  placeholder="billing@domain.com"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  v-model="form.companyPhone"
                  type="text"
                  placeholder="+62 812..."
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tarif Pajak PPN (%)</label>
                <div class="relative">
                  <input
                    v-model.number="form.taxPercentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="11"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 pr-8 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                  <span class="absolute right-3 top-2 text-xs font-semibold text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap Perusahaan</label>
              <textarea
                v-model="form.companyAddress"
                rows="2"
                placeholder="Jl. Alamat Kantor / Workshop..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>

        <!-- 2. Format Penomoran & Periode Jatuh Tempo -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="hash" size="16" class="text-amber-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Penomoran Otomatis & Jatuh Tempo</h3>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Prefix Invoice</label>
                <input
                  v-model="form.prefix"
                  type="text"
                  placeholder="INV-"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <span class="text-[10px] text-gray-400">Contoh: INV-, PO/, KCT-</span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Panjang Digit (Padding)</label>
                <select
                  v-model.number="form.numberPadding"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option :value="3">3 digit (001)</option>
                  <option :value="4">4 digit (0001)</option>
                  <option :value="5">5 digit (00001)</option>
                  <option :value="6">6 digit (000001)</option>
                </select>
                <span class="text-[10px] text-gray-400">Jumlah minimum angka</span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor Urut Berikutnya</label>
                <input
                  v-model.number="form.nextNumber"
                  type="number"
                  min="1"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <span class="text-[10px] text-gray-400">Auto increment transaksi</span>
              </div>
            </div>

            <!-- Preview Code Display -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <span class="text-amber-800 dark:text-amber-300 font-medium">Contoh Format Nomor Dihasilkan:</span>
              <span class="font-mono font-bold text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-900/50">
                {{ formattedInvoiceNumber }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Due Date Default</label>
                <div class="flex items-center gap-2">
                  <select
                    v-model.number="form.dueDays"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option :value="0">0 Hari (Bayar di Muka / Cash)</option>
                    <option :value="3">3 Hari</option>
                    <option :value="5">5 Hari</option>
                    <option :value="7">7 Hari (1 Minggu)</option>
                    <option :value="14">14 Hari (2 Minggu)</option>
                    <option :value="30">30 Hari (Net 30)</option>
                  </select>
                </div>
                <span class="text-[10px] text-gray-400">Batas akhir pelunasan dari tanggal cetak</span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Metode Pembulatan (Round Off)</label>
                <select
                  v-model="form.roundOffType"
                  :disabled="!form.roundOffEnabled"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 disabled:opacity-50"
                >
                  <option value="Round Off Up">Bulatkan Ke Atas (Ceil 1.000)</option>
                  <option value="Round Off Down">Bulatkan Ke Bawah (Floor 1.000)</option>
                  <option value="Nearest 100">Kelipatan 100 Terdekat</option>
                  <option value="Nearest 1000">Kelipatan 1.000 Terdekat</option>
                </select>
                <span class="text-[10px] text-gray-400">Penyesuaian nilai desimal tagihan</span>
              </div>
            </div>

            <!-- Toggles -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="form.roundOffEnabled"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Aktifkan Round Off Tagihan</div>
                  <div class="text-[11px] text-gray-400">Otomatis ratakan nilai koin/desimal</div>
                </div>
              </label>

              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="form.showCompanyDetails"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <div class="text-xs font-semibold text-gray-800 dark:text-gray-200">Tampilkan Detail Perusahaan</div>
                  <div class="text-[11px] text-gray-400">Sertakan alamat, telp, dan email pada kop</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 3. Rekening Pembayaran Resmi -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="credit-card" size="16" class="text-amber-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Rekening Tujuan Pembayaran Transfer</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Bank</label>
              <input
                v-model="form.bankDetails.bankName"
                type="text"
                placeholder="Bank Central Asia (BCA)"
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nomor Rekening</label>
              <input
                v-model="form.bankDetails.accountNumber"
                type="text"
                placeholder="8830-1928-3341"
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Atas Nama (A/N)</label>
              <input
                v-model="form.bankDetails.accountHolder"
                type="text"
                placeholder="PT DULANK SEMESTA CIDA"
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>

        <!-- 4. Term & Conditions / Catatan Header & Footer -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FeatherIcon name="file-text" size="16" class="text-amber-500" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">Syarat & Ketentuan (Terms & Notes)</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pesan Pembuka (Header Terms / Greeting)</label>
              <textarea
                v-model="form.headerTerms"
                rows="2"
                placeholder="Pesan ucapan terima kasih atau informasi pengantar faktur..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Syarat & Catatan Penutup (Footer Terms)</label>
              <textarea
                v-model="form.footerTerms"
                rows="3"
                placeholder="Instruksi konfirmasi pembayaran, garansi, batas klaim, dsb..."
                class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-amber-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- LIVE INVOICE PREVIEW COLUMN (5 cols) -->
      <div class="lg:col-span-5 sticky top-6 space-y-4">
        <!-- Preview Banner Header -->
        <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-900 text-white shadow-md dark:bg-gray-800">
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Invoice Preview</span>
          </div>
          <span class="text-[10px] uppercase font-semibold tracking-wider text-gray-300 bg-gray-800 dark:bg-gray-700 px-2 py-0.5 rounded">
            Auto-Update
          </span>
        </div>

        <!-- Document Preview Canvas -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans text-xs space-y-5 transition-all">
          <!-- Document Header -->
          <div class="flex items-start justify-between border-b pb-4 border-gray-100 dark:border-gray-800">
            <div>
              <div class="h-10 flex items-center mb-1">
                <img
                  :src="form.logoUrl || '/assets/img/logo.png'"
                  alt="Company Logo"
                  class="max-h-9 object-contain"
                />
              </div>
              <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ form.companyName || 'Nama Perusahaan' }}</h4>
              <div v-if="form.showCompanyDetails" class="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5 mt-1 max-w-[210px]">
                <p class="leading-relaxed">{{ form.companyAddress || '-' }}</p>
                <p>Telp: {{ form.companyPhone || '-' }}</p>
                <p>Email: {{ form.companyEmail || '-' }}</p>
              </div>
            </div>

            <div class="text-right">
              <span class="inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white rounded">
                INVOICE
              </span>
              <div class="mt-2 font-mono font-bold text-gray-900 dark:text-gray-100 text-xs">
                #{{ formattedInvoiceNumber }}
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                <div>Tanggal: <span class="font-medium text-gray-700 dark:text-gray-300">{{ previewIssueDate }}</span></div>
                <div>Jatuh Tempo: <span class="font-semibold text-red-600 dark:text-red-400">{{ previewDueDate }}</span></div>
              </div>
            </div>
          </div>

          <!-- Greeting Header Terms -->
          <div v-if="form.headerTerms" class="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 text-[11px] text-amber-900 dark:text-amber-200 italic border-l-2 border-amber-500">
            "{{ form.headerTerms }}"
          </div>

          <!-- Customer Info Mock -->
          <div class="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 text-[11px] flex justify-between items-center">
            <div>
              <span class="text-gray-400 uppercase text-[9px] font-bold block">Ditagihkan Kepada:</span>
              <span class="font-bold text-gray-900 dark:text-gray-100">PT Kreasi Nusantara Mandiri</span>
              <span class="text-gray-500 block text-[10px]">Attn: Bpk. Budi Santoso</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">Menunggu Pelunasan</span>
          </div>

          <!-- Line Items Table -->
          <div class="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse text-[11px]">
              <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-[9px] tracking-wider">
                <tr>
                  <th class="py-2 px-3 font-semibold">Deskripsi Layanan</th>
                  <th class="py-2 px-2 text-center font-semibold">Qty</th>
                  <th class="py-2 px-2 text-right font-semibold">Harga</th>
                  <th class="py-2 px-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(it, idx) in sampleItems" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                  <td class="py-2 px-3 text-gray-800 dark:text-gray-200 font-medium">{{ it.desc }}</td>
                  <td class="py-2 px-2 text-center text-gray-500">{{ it.qty }}</td>
                  <td class="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{{ formatRupiah(it.price) }}</td>
                  <td class="py-2 px-3 text-right font-semibold text-gray-800 dark:text-gray-100">{{ formatRupiah(it.qty * it.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Calculation Summary -->
          <div class="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatRupiah(previewSubtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>PPN ({{ form.taxPercentage || 0 }}%)</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatRupiah(previewTax) }}</span>
            </div>
            <div v-if="form.roundOffEnabled && previewRoundOffAdjustment !== 0" class="flex justify-between text-amber-600 dark:text-amber-400">
              <span>Pembulatan (Round Off)</span>
              <span class="font-medium">{{ previewRoundOffAdjustment > 0 ? '+' : '' }}{{ formatRupiah(previewRoundOffAdjustment) }}</span>
            </div>
            <div class="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <span>Total Tagihan</span>
              <span class="text-amber-600 dark:text-amber-400 text-base font-black">{{ formatRupiah(previewGrandTotal) }}</span>
            </div>
          </div>

          <!-- Payment Info Box -->
          <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700/80 space-y-1">
            <div class="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
              <FeatherIcon name="info" size="13" class="text-amber-500" />
              <span>Instruksi Pembayaran:</span>
            </div>
            <div class="text-[11px] text-gray-600 dark:text-gray-300">
              <div>Bank: <strong class="text-gray-800 dark:text-gray-100">{{ form.bankDetails.bankName || 'BCA' }}</strong></div>
              <div>No. Rek: <strong class="font-mono text-gray-800 dark:text-gray-100">{{ form.bankDetails.accountNumber || '-' }}</strong></div>
              <div>Atas Nama: <strong class="text-gray-800 dark:text-gray-100">{{ form.bankDetails.accountHolder || '-' }}</strong></div>
            </div>
          </div>

          <!-- Footer Notes -->
          <div v-if="form.footerTerms" class="text-[10px] text-gray-400 dark:text-gray-400 text-center border-t pt-3 border-gray-100 dark:border-gray-800 leading-relaxed">
            {{ form.footerTerms }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
