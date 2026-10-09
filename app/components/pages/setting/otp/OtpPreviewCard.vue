<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { OtpConfig } from '#server/types/system-settings'

const props = defineProps<{
  form: OtpConfig
}>()

const sampleCode = computed(() => {
  if (props.form.otpType === 'alphanumeric') {
    return 'K9X4M2'.slice(0, props.form.digitLimit)
  }
  return '849201'.slice(0, props.form.digitLimit)
})
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40">
    <div class="mb-2 flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
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
</template>

