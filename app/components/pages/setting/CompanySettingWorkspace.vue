<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { CompanySetting, CompanyImages } from '#server/types/company-setting'
import { useCompanySetting } from '~/composables/useCompanySetting'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CompanyLegalSection from './company/CompanyLegalSection.vue'
import CompanyContactSection from './company/CompanyContactSection.vue'
import CompanyBrandingSection from './company/CompanyBrandingSection.vue'
import CompanyAddressSection from './company/CompanyAddressSection.vue'

const { companySetting, pending, refresh, saveCompanySetting } = useCompanySetting()

const form = reactive({
  companyName: '',
  tagline: '',
  email: '',
  phone: '',
  fax: '',
  website: '',
  npwp: '',
  currency: 'IDR',
  address: '',
  country: 'Indonesia',
  province: '',
  city: '',
  postalCode: '',
  images: {
    logo: '/assets/img/logo-small.png',
    darkLogo: '/assets/img/logo-small.png',
    icon: '/assets/img/logo-small.png',
    favicon: '/assets/img/kacetak.jpeg'
  } as CompanyImages
})

watch(
  companySetting,
  (val) => {
    if (val) {
      form.companyName = val.companyName || ''
      form.tagline = val.tagline || ''
      form.email = val.email || ''
      form.phone = val.phone || ''
      form.fax = val.fax || ''
      form.website = val.website || ''
      form.npwp = val.npwp || ''
      form.currency = val.currency || 'IDR'
      form.address = val.address || ''
      form.country = val.country || 'Indonesia'
      form.province = val.province || ''
      form.city = val.city || ''
      form.postalCode = val.postalCode || ''
      form.images = {
        logo: val.images?.logo || '/assets/img/logo-small.png',
        darkLogo: val.images?.darkLogo || '/assets/img/logo-small.png',
        icon: val.images?.icon || '/assets/img/logo-small.png',
        favicon: val.images?.favicon || '/assets/img/kacetak.jpeg'
      }
    }
  },
  { immediate: true }
)

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3500)
}

function handleImageUpload(e: Event, key: keyof CompanyImages) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        form.images[key] = uploadEvent.target.result as string
        showToast(`Gambar ${key} berhasil diperbarui (preview aktif)`)
      }
    }
    reader.readAsDataURL(file)
  }
}

function resetImage(key: keyof CompanyImages) {
  const defaults: CompanyImages = {
    logo: '/assets/img/logo-small.png',
    darkLogo: '/assets/img/logo-small.png',
    icon: '/assets/img/logo-small.png',
    favicon: '/assets/img/kacetak.jpeg'
  }
  form.images[key] = defaults[key]
  showToast(`Gambar ${key} direset ke default`)
}

const isSubmitting = ref(false)

async function handleSubmit() {
  if (!form.companyName.trim()) return showToast('Nama perusahaan wajib diisi', 'error')
  if (!form.email.trim()) return showToast('Alamat email resmi wajib diisi', 'error')
  if (!form.phone.trim()) return showToast('Nomor telepon operasional wajib diisi', 'error')

  isSubmitting.value = true
  try {
    const res = await saveCompanySetting({ ...form, images: { ...form.images } })
    showToast(res.message || 'Pengaturan perusahaan berhasil disimpan!')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan pengaturan perusahaan', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  if (companySetting.value) {
    const val = companySetting.value
    Object.assign(form, {
      companyName: val.companyName || '',
      tagline: val.tagline || '',
      email: val.email || '',
      phone: val.phone || '',
      fax: val.fax || '',
      website: val.website || '',
      npwp: val.npwp || '',
      currency: val.currency || 'IDR',
      address: val.address || '',
      country: val.country || 'Indonesia',
      province: val.province || '',
      city: val.city || '',
      postalCode: val.postalCode || '',
      images: {
        logo: val.images?.logo || '/assets/img/logo-small.png',
        darkLogo: val.images?.darkLogo || '/assets/img/logo-small.png',
        icon: val.images?.icon || '/assets/img/logo-small.png',
        favicon: val.images?.favicon || '/assets/img/kacetak.jpeg'
      }
    })
    showToast('Formulir direset ke data tersimpan')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed right-6 top-20 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl transition-all',
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        ]"
        role="alert"
      >
        <FeatherIcon :name="toast.type === 'success' ? 'check-circle' : 'alert-circle'" size="18" />
        <span>{{ toast.message }}</span>
        <button type="button" class="ml-2 inline-flex text-white/80 hover:text-white" @click="toast.show = false">
          <FeatherIcon name="x" size="14" />
        </button>
      </div>
    </Transition>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pengaturan Perusahaan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi data legal entitas, identitas visual brand, kontak resmi, dan preferensi percetakan
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        :disabled="pending"
        @click="refresh()"
      >
        <FeatherIcon name="rotate-cw" size="16" :class="{ 'animate-spin': pending }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="pending" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
      <div v-for="n in 3" :key="n" class="space-y-3">
        <div class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="m in 3" :key="m" class="h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Loaded Form -->
    <form v-else @submit.prevent="handleSubmit" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <CompanyLegalSection :form="form" />
      <CompanyContactSection :form="form" />
      <CompanyBrandingSection :images="form.images" @upload-image="handleImageUpload" @reset-image="resetImage" />
      <CompanyAddressSection :form="form" />

      <!-- Action Buttons -->
      <div class="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="resetForm"
        >
          Batal / Reset
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex items-center gap-2 rounded-lg bg-[#FF9F43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E68F3C] disabled:opacity-60"
        >
          <FeatherIcon v-if="isSubmitting" name="rotate-cw" size="16" class="animate-spin" />
          <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
