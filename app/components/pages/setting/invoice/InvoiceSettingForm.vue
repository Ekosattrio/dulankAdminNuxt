<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { InvoiceSetting } from '#server/types/invoice-setting'

const props = defineProps<{
  form: InvoiceSetting
  formattedInvoiceNumber: string
}>()

const emit = defineEmits<{
  'toast': [msg: string, type: 'success' | 'error']
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onLogoSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      emit('toast', 'Ukuran file maksimal 5MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        props.form.logoUrl = event.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="space-y-6">
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
</template>

