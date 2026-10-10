<script setup lang="ts">
import type { IntegrationKey, SystemIntegrations } from '#server/types/system-integrations'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SystemIntegrationCard from './System/SystemIntegrationCard.vue'
import SystemIntegrationModal from './System/SystemIntegrationModal.vue'

const { integrations, pending, error, refresh, updateIntegrations } = useSystemIntegrations()

const activeKey = ref<IntegrationKey | null>(null)
const isModalOpen = ref(false)
const isSaving = ref(false)
const toastSuccess = ref('')
const toastError = ref('')

function openConfigure(key: IntegrationKey) {
  activeKey.value = key
  isModalOpen.value = true
}

async function handleToggle(key: IntegrationKey) {
  try {
    const current = integrations.value[key]
    await updateIntegrations({
      [key]: { ...current, enabled: !current.enabled }
    })
    toastSuccess.value = `Status integrasi berhasil diperbarui.`
    setTimeout(() => { toastSuccess.value = '' }, 3000)
  } catch (err: any) {
    toastError.value = 'Gagal memperbarui status integrasi.'
  }
}

async function handleSaveConfig(payload: Partial<SystemIntegrations>) {
  isSaving.value = true
  toastSuccess.value = ''
  toastError.value = ''
  try {
    const res = await updateIntegrations(payload)
    isModalOpen.value = false
    toastSuccess.value = res.message || 'Konfigurasi integrasi berhasil disimpan.'
    setTimeout(() => { toastSuccess.value = '' }, 4000)
  } catch (err: any) {
    toastError.value = err?.data?.message || err?.message || 'Gagal menyimpan konfigurasi.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="System Settings"
      subtitle="Kelola integrasi pihak ketiga Google reCAPTCHA, Analytics, AdSense, dan Maps API"
      :refreshing="pending"
      @refresh="refresh"
    />

    <!-- Feedback toast -->
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

    <SalesFeedback
      v-if="pending && !integrations"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat pengaturan integrasi sistem'"
      @retry="refresh"
    />

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Google Captcha -->
      <SystemIntegrationCard
        title="Google reCAPTCHA"
        description="Melindungi formulir registrasi & kalkulator dari spam otomatis dan bot jahat."
        icon="/assets/img/icons/app-icon-07.svg"
        :enabled="integrations.captcha.enabled"
        @toggle="handleToggle('captcha')"
        @configure="openConfigure('captcha')"
      />

      <!-- 2. Google Analytics -->
      <SystemIntegrationCard
        title="Google Analytics"
        description="Analisis performa trafik pengunjung, conversion funnel pesanan, dan SEO situs."
        icon="/assets/img/icons/app-icon-08.svg"
        :enabled="integrations.analytics.enabled"
        @toggle="handleToggle('analytics')"
        @configure="openConfigure('analytics')"
      />

      <!-- 3. Google Adsense -->
      <SystemIntegrationCard
        title="Google AdSense"
        description="Monetisasi ruang banner portal atau webstore publik untuk penayangan iklan partner."
        icon="/assets/img/icons/app-icon-09.svg"
        :enabled="integrations.adsense.enabled"
        @toggle="handleToggle('adsense')"
        @configure="openConfigure('adsense')"
      />

      <!-- 4. Google Maps -->
      <SystemIntegrationCard
        title="Google Maps API"
        description="Menampilkan lokasi cabang percetakan dan kalkulasi radius rute armada pengiriman."
        icon="/assets/img/icons/app-icon-10.svg"
        :enabled="integrations.map.enabled"
        @toggle="handleToggle('map')"
        @configure="openConfigure('map')"
      />
    </div>

    <SystemIntegrationModal
      :open="isModalOpen"
      :active-key="activeKey"
      :integrations="integrations"
      :busy="isSaving"
      @close="isModalOpen = false"
      @submit="handleSaveConfig"
    />
  </div>
</template>
