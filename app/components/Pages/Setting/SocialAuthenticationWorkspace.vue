<script setup lang="ts">
import type { SocialProviderConfig, SocialProviderKey } from '#server/types/social-auth'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SocialProviderCard from './Social/SocialProviderCard.vue'
import SocialProviderModal from './Social/SocialProviderModal.vue'

const { providers, pending, error, refresh, updateProviders } = useSocialAuth()

const activeKey = ref<SocialProviderKey | null>(null)
const isModalOpen = ref(false)
const isSaving = ref(false)
const toastSuccess = ref('')
const toastError = ref('')

const selectedProviderConfig = computed(() => {
  return activeKey.value ? providers.value[activeKey.value] : null
})

function openConfigure(key: SocialProviderKey) {
  activeKey.value = key
  isModalOpen.value = true
}

async function handleToggle(key: SocialProviderKey) {
  try {
    const current = providers.value[key]
    await updateProviders({
      [key]: { ...current, enabled: !current.enabled }
    })
    toastSuccess.value = `Status koneksi ${key} berhasil diperbarui.`
    setTimeout(() => { toastSuccess.value = '' }, 3000)
  } catch (err: any) {
    toastError.value = 'Gagal memperbarui status koneksi.'
  }
}

async function handleSaveConfig(payload: SocialProviderConfig) {
  if (!activeKey.value) return
  isSaving.value = true
  toastSuccess.value = ''
  toastError.value = ''
  try {
    const res = await updateProviders({
      [activeKey.value]: payload
    })
    isModalOpen.value = false
    toastSuccess.value = res.message || 'Konfigurasi provider berhasil disimpan.'
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
      title="Social Authentication"
      subtitle="Atur kredensial OAuth SSO login via Facebook, Twitter/X, Google, dan LinkedIn"
      :refreshing="pending"
      @refresh="refresh"
    />

    <!-- Feedback toast -->
    <ActionToast :message="toastSuccess" @dismiss="toastSuccess = ''" />

    <ActionToast :message="toastError" tone="error" @dismiss="toastError = ''" />

    <SalesFeedback
      v-if="pending && !providers"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat pengaturan otentikasi sosial'"
      @retry="refresh"
    />

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Facebook -->
      <SocialProviderCard
        name="Facebook"
        description="Login satu klik via akun Facebook pengguna dengan akses profil publik."
        icon="/assets/img/icons/fb-icon.svg"
        :enabled="providers.facebook.enabled"
        @toggle="handleToggle('facebook')"
        @configure="openConfigure('facebook')"
      />

      <!-- 2. Twitter -->
      <SocialProviderCard
        name="Twitter (X)"
        description="Login pengguna via akun X / Twitter OAuth 2.0 API."
        icon="/assets/img/icons/twitter-icon.svg"
        :enabled="providers.twitter.enabled"
        @toggle="handleToggle('twitter')"
        @configure="openConfigure('twitter')"
      />

      <!-- 3. Google -->
      <SocialProviderCard
        name="Google"
        description="Login aman menggunakan akun Google Workspace atau Gmail pribadi."
        icon="/assets/img/icons/google-icon.svg"
        :enabled="providers.google.enabled"
        @toggle="handleToggle('google')"
        @configure="openConfigure('google')"
      />

      <!-- 4. LinkedIn -->
      <SocialProviderCard
        name="LinkedIn"
        description="Login profesional untuk staf korporat atau vendor percetakan."
        icon="/assets/img/icons/linkedin-icon.svg"
        :enabled="providers.linkedin.enabled"
        @toggle="handleToggle('linkedin')"
        @configure="openConfigure('linkedin')"
      />
    </div>

    <SocialProviderModal
      :open="isModalOpen"
      :active-key="activeKey"
      :config="selectedProviderConfig"
      :busy="isSaving"
      @close="isModalOpen = false"
      @submit="handleSaveConfig"
    />
  </div>
</template>
