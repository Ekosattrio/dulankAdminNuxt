<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { CompanySetting, CompanyImages } from '#server/types/company-setting'
import { useCompanySetting } from '~/composables/useCompanySetting'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Company Settings - Kacetak System',
  sweetAlert: false
})

const { companySetting, pending, refresh, saveCompanySetting } = useCompanySetting()

// Form state
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

// Sync form with loaded company settings
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

// Branding image upload items
interface ImageSlot {
  key: keyof CompanyImages
  title: string
  desc: string
  recommended: string
}

const imageSlots: ImageSlot[] = [
  {
    key: 'logo',
    title: 'Logo Utama Perusahaan',
    desc: 'Ditampilkan di kop faktur, invoice, header aplikasi, dan nota cetak',
    recommended: 'Format PNG/SVG transparan, maks 5MB'
  },
  {
    key: 'darkLogo',
    title: 'Logo Mode Gelap (Dark Mode)',
    desc: 'Ditampilkan saat pengguna mengaktifkan mode tema malam/dark mode',
    recommended: 'Format PNG transparan warna terang, maks 5MB'
  },
  {
    key: 'icon',
    title: 'Company App Icon',
    desc: 'Ikon lambang ringkas untuk sidebar collapsed dan aplikasi mobile',
    recommended: 'Rasio 1:1 persegi, maks 5MB'
  },
  {
    key: 'favicon',
    title: 'Favicon Browser',
    desc: 'Ikon kecil pada tab browser pengunjung dan dashboard admin',
    recommended: 'Format ICO/PNG 32x32 atau 64x64 px'
  }
]

// Handle instant image uploads
function handleImageUpload(e: Event, key: keyof CompanyImages) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file gambar maksimal 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const res = loadEvent.target?.result as string
      form.images[key] = res
      showToast(`Gambar ${key} berhasil dimuat ke preview`)
    }
    reader.readAsDataURL(file)
  }
}

function resetImage(key: keyof CompanyImages) {
  const defaults: Record<keyof CompanyImages, string> = {
    logo: '/assets/img/logo-small.png',
    darkLogo: '/assets/img/logo-small.png',
    icon: '/assets/img/logo-small.png',
    favicon: '/assets/img/kacetak.jpeg'
  }
  form.images[key] = defaults[key]
  showToast(`Gambar ${key} dikembalikan ke default`)
}

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})
let toastTimer: any = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.show = false
  }, 3500)
}

// Save form
const isSubmitting = ref(false)

async function handleSubmit() {
  if (!form.companyName.trim()) {
    showToast('Nama perusahaan wajib diisi', 'error')
    return
  }
  if (!form.email.trim()) {
    showToast('Alamat email resmi wajib diisi', 'error')
    return
  }
  if (!form.phone.trim()) {
    showToast('Nomor telepon operasional wajib diisi', 'error')
    return
  }

  isSubmitting.value = true
  try {
    const res = await saveCompanySetting({
      companyName: form.companyName,
      tagline: form.tagline,
      email: form.email,
      phone: form.phone,
      fax: form.fax,
      website: form.website,
      npwp: form.npwp,
      currency: form.currency,
      address: form.address,
      country: form.country,
      province: form.province,
      city: form.city,
      postalCode: form.postalCode,
      images: { ...form.images }
    })
    showToast(res.message || 'Pengaturan perusahaan berhasil disimpan!')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan pengaturan perusahaan', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  if (companySetting.value) {
    form.companyName = companySetting.value.companyName || ''
    form.tagline = companySetting.value.tagline || ''
    form.email = companySetting.value.email || ''
    form.phone = companySetting.value.phone || ''
    form.fax = companySetting.value.fax || ''
    form.website = companySetting.value.website || ''
    form.npwp = companySetting.value.npwp || ''
    form.currency = companySetting.value.currency || 'IDR'
    form.address = companySetting.value.address || ''
    form.country = companySetting.value.country || 'Indonesia'
    form.province = companySetting.value.province || ''
    form.city = companySetting.value.city || ''
    form.postalCode = companySetting.value.postalCode || ''
    form.images = {
      logo: companySetting.value.images?.logo || '/assets/img/logo-small.png',
      darkLogo: companySetting.value.images?.darkLogo || '/assets/img/logo-small.png',
      icon: companySetting.value.images?.icon || '/assets/img/logo-small.png',
      favicon: companySetting.value.images?.favicon || '/assets/img/kacetak.jpeg'
    }
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
        <button
          type="button"
          class="ml-2 inline-flex text-white/80 hover:text-white"
          @click="toast.show = false"
        >
          <FeatherIcon name="x" size="14" />
        </button>
      </div>
    </Transition>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Pengaturan Perusahaan
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Konfigurasi data legal entitas, identitas visual brand, kontak resmi, dan preferensi percetakan
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          :disabled="pending"
          @click="refresh()"
        >
          <FeatherIcon
            name="rotate-cw"
            size="16"
            :class="{ 'animate-spin': pending }"
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader saat pending -->
    <div v-if="pending" class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-8">
        <!-- Skeleton Info Legal -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div class="h-5 w-44 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="n in 6" :key="n" class="space-y-2">
              <div class="h-3 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div class="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>

        <!-- Skeleton Images -->
        <div class="border-t border-gray-100 pt-6 dark:border-gray-800">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div class="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="n in 4" :key="n" class="h-28 rounded-xl border border-gray-100 bg-gray-100/60 dark:border-gray-800 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>

        <!-- Skeleton Address -->
        <div class="border-t border-gray-100 pt-6 dark:border-gray-800">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div class="h-5 w-36 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
          <div class="space-y-4">
            <div class="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div v-for="n in 4" :key="n" class="h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Form (Loaded) -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
        <!-- Section 1: Data Legal & Identitas Perusahaan -->
        <div>
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#FF9F43] dark:bg-amber-950/60 dark:text-amber-400">
              <FeatherIcon name="briefcase" size="18" />
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">
                Informasi Legal & Bisnis
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Nama entitas, nomor pajak (NPWP), dan mata uang standar transaksi percetakan
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Company Name -->
            <div class="lg:col-span-2">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Nama Perusahaan <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.companyName"
                type="text"
                required
                placeholder="PT. Dulank Semesta Cida"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Currency -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Mata Uang Default
              </label>
              <div class="relative">
                <select
                  v-model="form.currency"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="IDR">IDR - Rupiah Indonesia (Rp)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="SGD">SGD - Singapore Dollar (S$)</option>
                </select>
              </div>
            </div>

            <!-- Tagline -->
            <div class="lg:col-span-2">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Slogan / Tagline Perusahaan
              </label>
              <input
                v-model="form.tagline"
                type="text"
                placeholder="Pusat Solusi Percetakan Offset & Digital Printing Berkualitas Tinggi"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- NPWP -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Nomor NPWP Perusahaan
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="file-text" size="14" />
                </span>
                <input
                  v-model="form.npwp"
                  type="text"
                  placeholder="01.345.678.9-012.000"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Kontak Resmi & Website -->
        <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <FeatherIcon name="phone-call" size="18" />
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">
                Kontak & Komunikasi Resmi
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Saluran komunikasi resmi untuk pelanggan, vendor, dan penawaran cetak
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Resmi Perusahaan <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="mail" size="14" />
                </span>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="kontak@dulanksemesta.com"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                No. Telepon Kantor <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="phone" size="14" />
                </span>
                <input
                  v-model="form.phone"
                  type="text"
                  required
                  placeholder="+62 21 4256 7890"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Fax -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Nomor Fax (Opsional)
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="printer" size="14" />
                </span>
                <input
                  v-model="form.fax"
                  type="text"
                  placeholder="+62 21 4256 7891"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Website -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Alamat Website / Portal
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="globe" size="14" />
                </span>
                <input
                  v-model="form.website"
                  type="url"
                  placeholder="https://dulanksemesta.com"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Branding & Company Images -->
        <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <FeatherIcon name="image" size="18" />
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">
                Identitas Visual & Logo Perusahaan
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Unggah logo untuk faktur, browser tab, dan mode terang/gelap
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="slot in imageSlots"
              :key="slot.key"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-850 dark:hover:border-gray-700"
            >
              <div class="space-y-1 max-w-sm">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ slot.title }}
                  </h3>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ slot.desc }}
                </p>
                <p class="text-[11px] text-amber-600 dark:text-amber-400">
                  {{ slot.recommended }}
                </p>

                <div class="pt-2 flex items-center gap-2">
                  <label class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm cursor-pointer transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750">
                    <FeatherIcon name="upload" size="13" />
                    <span>Upload Baru</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="e => handleImageUpload(e, slot.key)"
                    />
                  </label>

                  <button
                    v-if="form.images[slot.key]"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    title="Reset ke default"
                    @click="resetImage(slot.key)"
                  >
                    <FeatherIcon name="refresh-ccw" size="12" />
                    <span>Default</span>
                  </button>
                </div>
              </div>

              <!-- Preview Box -->
              <div class="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-2 shadow-xs dark:border-gray-700 dark:bg-gray-900">
                <img
                  :src="form.images[slot.key] || '/assets/img/logo-small.png'"
                  :alt="slot.title"
                  class="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Alamat Kantor & Workshop Percetakan -->
        <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FeatherIcon name="map-pin" size="18" />
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white">
                Alamat Kantor & Workshop Percetakan
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Alamat fisik perusahaan yang tercantum pada surat jalan dan invoice resmi
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Full Address -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Alamat Lengkap Perusahaan
              </label>
              <textarea
                v-model="form.address"
                rows="2"
                placeholder="Kawasan Percetakan Industri Modern, Blok D2 No. 14, Jl. Daan Mogot KM 19"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Country, Province, City, Postal Code -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Negara
                </label>
                <input
                  v-model="form.country"
                  type="text"
                  placeholder="Indonesia"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Provinsi
                </label>
                <input
                  v-model="form.province"
                  type="text"
                  placeholder="DKI Jakarta"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Kota / Kabupaten
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="Jakarta Barat"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Kode Pos
                </label>
                <input
                  v-model="form.postalCode"
                  type="text"
                  placeholder="11840"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Action Buttons -->
        <div class="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
            @click="resetForm"
          >
            Batal / Reset
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 rounded-lg bg-[#FF9F43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E68F3C] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 disabled:opacity-60"
          >
            <FeatherIcon
              v-if="isSubmitting"
              name="rotate-cw"
              size="16"
              class="animate-spin"
            />
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
