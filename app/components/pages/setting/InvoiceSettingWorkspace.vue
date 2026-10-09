<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { InvoiceSetting } from '#server/types/invoice-setting'
import { useInvoiceSettings } from '~/composables/useInvoiceSettings'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import InvoiceSettingForm from './invoice/InvoiceSettingForm.vue'
import InvoicePreviewCard from './invoice/InvoicePreviewCard.vue'

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

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3500)
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

const formattedInvoiceNumber = computed(() => {
  const numStr = String(form.value.nextNumber || 1).padStart(form.value.numberPadding || 1, '0')
  return `${form.value.prefix || ''}${numStr}`
})
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

    <!-- Skeleton Loader -->
    <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div class="lg:col-span-7 space-y-6">
        <div v-for="i in 3" :key="`inv-skel-${i}`" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div class="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4 h-[400px]">
          <div class="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          <div class="h-48 w-full rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <p class="font-semibold mb-2">{{ error?.message || 'Gagal memuat pengaturan invoice' }}</p>
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
      <!-- Form Section Component -->
      <InvoiceSettingForm
        class="lg:col-span-7"
        :form="form"
        :formatted-invoice-number="formattedInvoiceNumber"
        @toast="showToast"
      />

      <!-- Live Preview Card Component -->
      <InvoicePreviewCard
        class="lg:col-span-5"
        :form="form"
        :formatted-invoice-number="formattedInvoiceNumber"
      />
    </div>
  </div>
</template>
