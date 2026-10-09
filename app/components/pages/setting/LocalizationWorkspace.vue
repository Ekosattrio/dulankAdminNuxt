<script setup lang="ts">
import type { LocalizationConfig } from '#server/types/system-settings'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import LocalizationBasicSection from './localization/LocalizationBasicSection.vue'
import LocalizationCurrencySection from './localization/LocalizationCurrencySection.vue'
import LocalizationFileSection from './localization/LocalizationFileSection.vue'

const { config, pending, error, refresh, saveConfig } = useLocalizationSettings()

const form = ref<LocalizationConfig>({
  language: 'Indonesian',
  languageSwitcher: true,
  timezone: 'Asia/Jakarta',
  dateFormat: 'DD MMM YYYY',
  timeFormat: '24 Hours',
  financialYear: '2026',
  startingMonth: 'January',
  currency: 'IDR',
  currencySymbol: 'Rp',
  currencyPosition: 'before',
  decimalSeparator: ',',
  thousandSeparator: '.',
  countriesRestriction: 'Allow All Countries',
  allowedFiles: 'JPG, GIF, PNG, PDF, ZIP, SVG',
  maxFileSize: 5000,
})

const isSaving = ref(false)
const toastSuccess = ref('')
const toastError = ref('')

watch(config, (val) => {
  if (val) {
    form.value = { ...val }
  }
}, { immediate: true })

async function handleSave() {
  isSaving.value = true
  toastSuccess.value = ''
  toastError.value = ''
  try {
    const res = await saveConfig({ ...form.value })
    toastSuccess.value = res.message || 'Pengaturan lokalisasi berhasil disimpan.'
    setTimeout(() => {
      toastSuccess.value = ''
    }, 5000)
  } catch (err: any) {
    toastError.value = err?.data?.message || err?.message || 'Gagal menyimpan pengaturan lokalisasi.'
  } finally {
    isSaving.value = false
  }
}

function handleReset() {
  if (config.value) {
    form.value = { ...config.value }
    toastSuccess.value = ''
    toastError.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Localization Settings"
      subtitle="Atur preferensi bahasa, format tanggal, zona waktu, mata uang, dan batasan berkas"
      :refreshing="pending"
      @refresh="refresh"
    />

    <SalesFeedback
      v-if="pending && !config"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat pengaturan lokalisasi'"
      @retry="refresh"
    />

    <template v-else>
      <!-- Toast feedback -->
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
        v-if="toastError"
        class="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
      >
        <div class="flex items-center gap-2">
          <FeatherIcon name="alert-triangle" :size="16" />
          <span>{{ toastError }}</span>
        </div>
        <button type="button" @click="toastError = ''">
          <FeatherIcon name="x" :size="14" />
        </button>
      </div>

      <form class="space-y-6" @submit.prevent="handleSave">
        <LocalizationBasicSection :form="form" />
        <LocalizationCurrencySection :form="form" />
        <LocalizationFileSection :form="form" />

        <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            @click="handleReset"
          >
            Batal / Reset
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
          >
            <FeatherIcon v-if="!isSaving" name="check" :size="16" />
            <span v-if="isSaving" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>
