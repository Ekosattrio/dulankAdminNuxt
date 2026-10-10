<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import AppSkeleton from '~/components/Common/AppSkeleton.vue'
import type { OtpConfig } from '#server/types/system-settings'
import OtpConfigForm from './Otp/OtpConfigForm.vue'

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
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          @click="refresh()"
        >
          <FeatherIcon name="rotate-ccw" :size="14" />
          <span>Muat Ulang</span>
        </button>
      </div>
    </div>

    <!-- Alert / Toast Messages -->
    <div
      v-if="toastSuccess"
      class="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="check-circle" :size="16" />
        <span>{{ toastSuccess }}</span>
      </div>
      <button type="button" @click="toastSuccess = ''">
        <FeatherIcon name="x" :size="14" />
      </button>
    </div>

    <div
      v-if="toastError || error"
      class="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="alert-triangle" :size="16" />
        <span>{{ toastError || (error && 'Gagal memuat konfigurasi OTP.') }}</span>
      </div>
      <button type="button" @click="toastError = ''">
        <FeatherIcon name="x" :size="14" />
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <AppSkeleton height="h-20" class="w-full" rounded="lg" />
    </div>

    <!-- Configuration Form -->
    <OtpConfigForm
      v-else
      :form="form"
      :busy="isSaving"
      @submit="handleSave"
      @reset="resetForm"
    />
  </div>
</template>
