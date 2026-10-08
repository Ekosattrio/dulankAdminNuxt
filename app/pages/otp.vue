<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import AppSkeleton from '~/components/common/AppSkeleton.vue'
import type { OtpConfig } from '#server/types/system-settings'

useLegacyPage({
  title: 'OTP Settings',
  sweetAlert: false,
})

const { otpConfig, pending, error, refresh, saveSettings } = useOtpSettings()

const form = ref<OtpConfig>({
  isEnabled: true,
  provider: 'whatsapp',
  otpType: 'numeric',
  digitLimit: 6,
  expireMinutes: 5,
  resendDelaySeconds: 60,
})

const isSaving = ref(false)
const toastSuccess = ref('')
const toastError = ref('')

watch(
  otpConfig,
  (val) => {
    if (val) {
      form.value = {
        isEnabled: val.isEnabled !== false,
        provider: val.provider || 'whatsapp',
        otpType: val.otpType || 'numeric',
        digitLimit: val.digitLimit || 6,
        expireMinutes: val.expireMinutes || 5,
        resendDelaySeconds: val.resendDelaySeconds || 60,
      }
    }
  },
  { immediate: true },
)

const handleSave = async () => {
  isSaving.value = true
  toastSuccess.value = ''
  toastError.value = ''
  try {
    const res = await saveSettings({ ...form.value })
    toastSuccess.value = res.message || 'Konfigurasi OTP berhasil disimpan.'
    setTimeout(() => {
      toastSuccess.value = ''
    }, 5000)
  } catch (err: any) {
    toastError.value = err?.data?.message || err?.message || 'Gagal menyimpan konfigurasi OTP.'
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  if (otpConfig.value) {
    form.value = { ...otpConfig.value }
    toastSuccess.value = ''
    toastError.value = ''
  }
}

const sampleCode = computed(() => {
  if (form.value.otpType === 'alphanumeric') {
    return 'K9X4M2'.slice(0, form.value.digitLimit)
  }
  return '849201'.slice(0, form.value.digitLimit)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            OTP Settings
          </h1>
          <span
            v-if="form.isEnabled"
            class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            OTP Enabled
          </span>
          <span
            v-else
            class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
          >
            OTP Disabled
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi otentikasi 2-Faktor (2FA) dan pengiriman kode verifikasi satu kali pakai
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          :disabled="pending"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="refresh()"
        >
          <FeatherIcon name="rotate-ccw" :size="16" :class="{ 'animate-spin': pending }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div
      v-if="toastSuccess"
      class="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
      role="alert"
    >
      <div class="flex items-center gap-2.5">
        <FeatherIcon name="check-circle" :size="18" class="text-emerald-600 dark:text-emerald-400" />
        <span class="font-medium">{{ toastSuccess }}</span>
      </div>
      <button
        type="button"
        class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
        @click="toastSuccess = ''"
      >
        <FeatherIcon name="x" :size="16" />
      </button>
    </div>

    <div
      v-if="toastError"
      class="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
      role="alert"
    >
      <div class="flex items-center gap-2.5">
        <FeatherIcon name="alert-circle" :size="18" class="text-red-600 dark:text-red-400" />
        <span class="font-medium">{{ toastError }}</span>
      </div>
      <button
        type="button"
        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
        @click="toastError = ''"
      >
        <FeatherIcon name="x" :size="16" />
      </button>
    </div>

    <!-- SKELETON LOADER -->
    <div v-if="pending" class="space-y-6">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div class="space-y-2">
            <AppSkeleton height="h-5" class="w-48" />
            <AppSkeleton height="h-3.5" class="w-64" />
          </div>
          <AppSkeleton height="h-6" class="w-12" rounded="full" />
        </div>
        <div class="mt-6 space-y-4">
          <AppSkeleton height="h-20" class="w-full" rounded="lg" />
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AppSkeleton v-for="i in 3" :key="i" height="h-24" rounded="lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN FORM -->
    <form v-else @submit.prevent="handleSave" class="space-y-6">
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <!-- Master Toggle Header -->
        <div class="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white">
              Status Verifikasi OTP
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Wajibkan pelanggan atau staf memasukkan kode OTP saat login sensitif & pembayaran
            </p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold" :class="form.isEnabled ? 'text-primary' : 'text-gray-400'">
              {{ form.isEnabled ? 'Aktif' : 'Nonaktif' }}
            </span>
            <button
              type="button"
              role="switch"
              :aria-checked="form.isEnabled"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20',
                form.isEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              ]"
              @click="form.isEnabled = !form.isEnabled"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  form.isEnabled ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Delivery Provider Selection -->
          <div>
            <label class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Kanal Pengiriman Utama (Provider)
            </label>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <!-- WhatsApp -->
              <label
                :class="[
                  'relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition',
                  form.provider === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-50/40 dark:border-emerald-500/80 dark:bg-emerald-950/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      <FeatherIcon name="message-circle" :size="20" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 dark:text-white">WhatsApp</div>
                      <div class="text-xs text-gray-500">Gateway API / Wablas</div>
                    </div>
                  </div>
                  <input
                    v-model="form.provider"
                    type="radio"
                    value="whatsapp"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div class="mt-4 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400">
                  <span>Kecepatan instan</span>
                  <span class="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold dark:bg-emerald-900/60">Populer di Indonesia</span>
                </div>
              </label>

              <!-- SMS -->
              <label
                :class="[
                  'relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition',
                  form.provider === 'sms'
                    ? 'border-primary bg-primary/5 dark:border-primary/80 dark:bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                      <FeatherIcon name="smartphone" :size="20" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 dark:text-white">SMS Gateway</div>
                      <div class="text-xs text-gray-500">GSM Seluler / Twilio</div>
                    </div>
                  </div>
                  <input
                    v-model="form.provider"
                    type="radio"
                    value="sms"
                    class="h-4 w-4 text-primary focus:ring-primary"
                  />
                </div>
                <div class="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
                  Dapat diterima tanpa koneksi data internet
                </div>
              </label>

              <!-- Email -->
              <label
                :class="[
                  'relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition',
                  form.provider === 'email'
                    ? 'border-blue-500 bg-blue-50/40 dark:border-blue-500/80 dark:bg-blue-950/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      <FeatherIcon name="mail" :size="20" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 dark:text-white">Email Address</div>
                      <div class="text-xs text-gray-500">SMTP Server Portal</div>
                    </div>
                  </div>
                  <input
                    v-model="form.provider"
                    type="radio"
                    value="email"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div class="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
                  Gratis, dikirim langsung via server SMTP
                </div>
              </label>
            </div>
          </div>

          <!-- Configuration Fields Grid -->
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <!-- Digit Limit -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Panjang Digit OTP
              </label>
              <select
                v-model.number="form.digitLimit"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              >
                <option :value="4">4 Digits (Contoh: 8492)</option>
                <option :value="6">6 Digits (Rekomendasi Standar)</option>
                <option :value="8">8 Digits (Keamanan Tinggi)</option>
              </select>
            </div>

            <!-- Expire Minutes -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Masa Berlaku (Expire Minutes)
              </label>
              <select
                v-model.number="form.expireMinutes"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              >
                <option :value="3">3 Menit</option>
                <option :value="5">5 Menit (Rekomendasi)</option>
                <option :value="10">10 Menit</option>
                <option :value="15">15 Menit</option>
              </select>
            </div>

            <!-- Resend Delay -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Jeda Kirim Ulang (Resend Delay)
              </label>
              <select
                v-model.number="form.resendDelaySeconds"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              >
                <option :value="30">30 Detik</option>
                <option :value="60">60 Detik (1 Menit)</option>
                <option :value="120">120 Detik (2 Menit)</option>
              </select>
            </div>

            <!-- OTP Type -->
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Format Karakter Kode
              </label>
              <select
                v-model="form.otpType"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              >
                <option value="numeric">Angka Saja (Numeric)</option>
                <option value="alphanumeric">Angka & Huruf (Alphanumeric)</option>
              </select>
            </div>
          </div>

          <!-- Preview Simulator Box -->
          <div class="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40">
            <div class="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              <FeatherIcon name="eye" :size="15" class="text-primary" />
              <span>Simulasi Tampilan Pesan OTP ke Pengguna:</span>
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-3 font-mono text-xs text-gray-700 shadow-2xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <p class="mb-1">
                [KACETAK] Kode verifikasi Anda adalah: <strong class="text-base text-primary tracking-widest">{{ sampleCode }}</strong>
              </p>
              <p class="text-[11px] text-gray-400">
                Berlaku selama {{ form.expireMinutes }} menit. JANGAN bagikan kode ini kepada siapapun demi keamanan akun Anda.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="resetForm"
          >
            Batal / Reset
          </button>

          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
          >
            <FeatherIcon v-if="!isSaving" name="check" :size="16" />
            <span v-if="isSaving" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
