<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import AppSkeleton from '~/components/Common/AppSkeleton.vue'
import type { EmailConfig } from '#server/types/system-settings'
import EmailConfigForm from './Email/EmailConfigForm.vue'
import EmailTestModal from './Email/EmailTestModal.vue'

const { emailConfig, pending, error, refresh, saveSettings, sendTestEmail } = useEmailSettings()

const form = ref<EmailConfig>({
  mailHost: '',
  mailPort: 587,
  mailUsername: '',
  mailPassword: '',
  mailEncryption: 'tls',
  fromEmail: '',
  fromName: '',
  mailEngine: 'smtp',
  status: true,
})

const showPassword = ref(false)
const isSaving = ref(false)
const isTesting = ref(false)
const showTestModal = ref(false)
const alertSuccess = ref('')
const alertError = ref('')

watch(
  emailConfig,
  (val) => {
    if (val) {
      form.value = {
        mailHost: val.mailHost || '',
        mailPort: val.mailPort || 587,
        mailUsername: val.mailUsername || '',
        mailPassword: val.mailPassword || '',
        mailEncryption: val.mailEncryption || 'tls',
        fromEmail: val.fromEmail || '',
        fromName: val.fromName || '',
        mailEngine: val.mailEngine || 'smtp',
        status: val.status !== false,
      }
    }
  },
  { immediate: true },
)

const handleSave = async () => {
  isSaving.value = true
  alertSuccess.value = ''
  alertError.value = ''
  try {
    const res = await saveSettings({ ...form.value })
    alertSuccess.value = res.message || 'Konfigurasi Email berhasil disimpan.'
    setTimeout(() => { alertSuccess.value = '' }, 5000)
  } catch (err: any) {
    alertError.value = err?.data?.message || err?.message || 'Gagal menyimpan konfigurasi email.'
  } finally {
    isSaving.value = false
  }
}

const handleSendTest = async (testEmailAddress: string) => {
  if (!testEmailAddress || !testEmailAddress.includes('@')) {
    alertError.value = 'Masukkan alamat email tujuan yang valid.'
    return
  }
  isTesting.value = true
  alertError.value = ''
  try {
    const res = await sendTestEmail(testEmailAddress)
    alertSuccess.value = res.message || `Test email berhasil dikirim ke ${testEmailAddress}.`
    showTestModal.value = false
    setTimeout(() => { alertSuccess.value = '' }, 6000)
  } catch (err: any) {
    alertError.value = err?.data?.message || err?.message || 'Gagal mengirim test email.'
  } finally {
    isTesting.value = false
  }
}

const resetToOriginal = () => {
  if (emailConfig.value) {
    form.value = { ...emailConfig.value }
    alertSuccess.value = ''
    alertError.value = ''
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
            Email Settings
          </h1>
          <span
            v-if="form.status"
            class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SMTP Active
          </span>
          <span
            v-else
            class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            Disabled
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi protokol SMTP dan kredensial pengiriman email sistem Kacetak
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          :disabled="pending"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="refresh()"
        >
          <FeatherIcon name="rotate-ccw" :size="16" :class="{ 'animate-spin': pending }" />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
          @click="showTestModal = true"
        >
          <FeatherIcon name="send" :size="16" />
          <span>Test Email</span>
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div
      v-if="alertSuccess"
      class="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="check-circle" :size="18" class="text-emerald-500" />
        <span>{{ alertSuccess }}</span>
      </div>
      <button type="button" class="text-emerald-500 hover:text-emerald-700" @click="alertSuccess = ''">
        <FeatherIcon name="x" :size="16" />
      </button>
    </div>

    <div
      v-if="alertError"
      class="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="alert-circle" :size="18" class="text-red-500" />
        <span>{{ alertError }}</span>
      </div>
      <button type="button" class="text-red-500 hover:text-red-700" @click="alertError = ''">
        <FeatherIcon name="x" :size="16" />
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-4">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
        <AppSkeleton height="h-6" width="w-48" rounded="md" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSkeleton v-for="n in 6" :key="n" height="h-10" rounded="lg" />
        </div>
      </div>
    </div>

    <!-- Config Form Component -->
    <EmailConfigForm
      v-else
      :form="form"
      :is-saving="isSaving"
      :show-password="showPassword"
      @save="handleSave"
      @reset="resetToOriginal"
      @test-connection="showTestModal = true"
      @toggle-password="showPassword = !showPassword"
    />

    <!-- Test Email Modal Component -->
    <EmailTestModal
      :open="showTestModal"
      :busy="isTesting"
      :form="form"
      @send-test="handleSendTest"
      @close="showTestModal = false"
    />
  </div>
</template>
