<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { UserProfile, PasswordChangePayload } from '#server/types/profile'
import { useProfile } from '~/composables/useProfile'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Profile Settings - Kacetak System',
  sweetAlert: false
})

const { profile, pending, refresh, saveProfile, changePassword } = useProfile()

// Local state for profile form
const form = reactive({
  firstName: '',
  lastName: '',
  userName: '',
  phoneNumber: '',
  email: '',
  role: '',
  avatarUrl: '',
  address: '',
  country: 'Indonesia',
  province: '',
  city: '',
  postalCode: ''
})

// Sync form when profile data loads or refreshes
watch(
  profile,
  (val) => {
    if (val) {
      form.firstName = val.firstName || ''
      form.lastName = val.lastName || ''
      form.userName = val.userName || ''
      form.phoneNumber = val.phoneNumber || ''
      form.email = val.email || ''
      form.role = val.role || ''
      form.avatarUrl = val.avatarUrl || '/assets/img/users/user-01.jpg'
      form.address = val.address || ''
      form.country = val.country || 'Indonesia'
      form.province = val.province || ''
      form.city = val.city || ''
      form.postalCode = val.postalCode || ''
    }
  },
  { immediate: true }
)

// Instant photo upload preview
const fileInput = ref<HTMLInputElement | null>(null)
const previewAvatarUrl = ref<string | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      previewAvatarUrl.value = result
      form.avatarUrl = result
    }
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  form.avatarUrl = '/assets/img/users/user-01.jpg'
  previewAvatarUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Password modal state
const isPasswordModalOpen = ref(false)
const passwordForm = reactive<PasswordChangePayload>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmittingPassword = ref(false)

function openPasswordModal() {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  isPasswordModalOpen.value = true
}

function closePasswordModal() {
  isPasswordModalOpen.value = false
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

// Submit actions
const isSubmittingProfile = ref(false)

async function handleProfileSubmit() {
  if (!form.firstName.trim()) {
    showToast('Nama depan wajib diisi', 'error')
    return
  }
  if (!form.email.trim()) {
    showToast('Alamat email wajib diisi', 'error')
    return
  }

  isSubmittingProfile.value = true
  try {
    const res = await saveProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      userName: form.userName,
      phoneNumber: form.phoneNumber,
      email: form.email,
      role: form.role,
      avatarUrl: form.avatarUrl,
      address: form.address,
      country: form.country,
      province: form.province,
      city: form.city,
      postalCode: form.postalCode
    })
    showToast(res.message || 'Profil berhasil diperbarui!')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan profil', 'error')
  } finally {
    isSubmittingProfile.value = false
  }
}

async function handlePasswordSubmit() {
  if (!passwordForm.currentPassword) {
    showToast('Kata sandi saat ini wajib diisi', 'error')
    return
  }
  if (!passwordForm.newPassword) {
    showToast('Kata sandi baru wajib diisi', 'error')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    showToast('Kata sandi baru minimal 6 karakter', 'error')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast('Konfirmasi kata sandi tidak cocok', 'error')
    return
  }

  isSubmittingPassword.value = true
  try {
    const res = await changePassword(passwordForm)
    showToast(res?.message || 'Kata sandi berhasil diperbarui!')
    closePasswordModal()
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal memperbarui kata sandi', 'error')
  } finally {
    isSubmittingPassword.value = false
  }
}

function resetForm() {
  if (profile.value) {
    form.firstName = profile.value.firstName || ''
    form.lastName = profile.value.lastName || ''
    form.userName = profile.value.userName || ''
    form.phoneNumber = profile.value.phoneNumber || ''
    form.email = profile.value.email || ''
    form.role = profile.value.role || ''
    form.avatarUrl = profile.value.avatarUrl || '/assets/img/users/user-01.jpg'
    form.address = profile.value.address || ''
    form.country = profile.value.country || 'Indonesia'
    form.province = profile.value.province || ''
    form.city = profile.value.city || ''
    form.postalCode = profile.value.postalCode || ''
    previewAvatarUrl.value = null
    showToast('Formulir dikembalikan ke data awal')
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
          Pengaturan Profil
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Kelola informasi identitas akun, foto profil, dan keamanan kredensial Anda di sistem Dulank
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

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          @click="openPasswordModal"
        >
          <FeatherIcon name="lock" size="16" class="text-[#FF9F43]" />
          <span>Ubah Password</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader saat pending -->
    <div v-if="pending" class="space-y-6">
      <!-- Skeleton Card Profile -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div class="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div class="flex-1 space-y-3">
            <div class="h-5 w-48 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div class="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div class="flex gap-2">
              <div class="h-8 w-28 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div class="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-6">
          <div class="h-4 w-36 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="n in 6" :key="n" class="space-y-2">
              <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div class="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6 dark:border-gray-800">
            <div class="h-4 w-36 rounded bg-gray-200 dark:bg-gray-800 animate-pulse mb-4" />
            <div class="space-y-4">
              <div class="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div v-for="n in 4" :key="n" class="space-y-2">
                  <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div class="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Profile Content (Loaded) -->
    <form v-else @submit.prevent="handleProfileSubmit" class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
        <!-- Section 1: Foto Profil & Info Cepat -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div class="relative group mx-auto sm:mx-0">
            <div class="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ring-gray-100 dark:border-gray-800 dark:ring-gray-700">
              <img
                :src="previewAvatarUrl || form.avatarUrl || '/assets/img/users/user-01.jpg'"
                alt="Foto Profil"
                class="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              class="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9F43] text-white shadow-md transition hover:bg-[#E68F3C] focus:outline-none"
              title="Unggah Foto Baru"
              @click="triggerFileInput"
            >
              <FeatherIcon name="camera" size="14" />
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              class="hidden"
              @change="handleFileChange"
            />
          </div>

          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ form.firstName }} {{ form.lastName }}
              </h2>
              <span
                v-if="form.role"
                class="inline-flex items-center gap-1.5 self-center sm:self-start rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30"
              >
                <FeatherIcon name="shield" size="12" />
                {{ form.role }}
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Format yang didukung: JPG, PNG, atau WebP. Maksimal 5MB (Rekomendasi rasio 1:1 / 450x450 px).
            </p>

            <div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
                @click="triggerFileInput"
              >
                <FeatherIcon name="upload" size="13" />
                <span>Pilih Foto Baru</span>
              </button>
              <button
                v-if="previewAvatarUrl || form.avatarUrl !== '/assets/img/users/user-01.jpg'"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                @click="removeAvatar"
              >
                <FeatherIcon name="trash-2" size="13" />
                <span>Hapus Foto</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Section 2: Informasi Pribadi & Akun -->
        <div class="pt-6">
          <div class="mb-5 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-[#FF9F43] dark:bg-amber-950/60 dark:text-amber-400">
              <FeatherIcon name="user" size="16" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                Informasi Karyawan
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Detail identitas pengguna dan informasi login sistem
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- First Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Nama Depan <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  placeholder="Contoh: Rian"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Nama Belakang
              </label>
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Contoh: Dharmawan"
                class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Username -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Username Akun
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  @
                </span>
                <input
                  v-model="form.userName"
                  type="text"
                  placeholder="rian.admin"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="phone" size="14" />
                </span>
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  placeholder="+62 812-xxxx-xxxx"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Alamat Email <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FeatherIcon name="mail" size="14" />
                </span>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="admin@dulanksemesta.com"
                  class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- Role (Display Only) -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Peran / Jabatan
              </label>
              <input
                v-model="form.role"
                type="text"
                readonly
                disabled
                class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-600 shadow-sm cursor-not-allowed dark:border-gray-750 dark:bg-gray-800/60 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Informasi Alamat -->
        <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div class="mb-5 flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FeatherIcon name="map-pin" size="16" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                Alamat Domisili
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Informasi alamat tempat tinggal atau kantor penugasan
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Full Address -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Alamat Lengkap (Jalan, No. Bangunan, RT/RW, Kelurahan)
              </label>
              <textarea
                v-model="form.address"
                rows="2"
                placeholder="Jl. Percetakan Negara No. 88, RT.04/RW.02"
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
                  placeholder="Jakarta Pusat"
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
                  placeholder="10560"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Action Footer Buttons -->
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
            :disabled="isSubmittingProfile"
            class="inline-flex items-center gap-2 rounded-lg bg-[#FF9F43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E68F3C] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 disabled:opacity-60"
          >
            <FeatherIcon
              v-if="isSubmittingProfile"
              name="rotate-cw"
              size="16"
              class="animate-spin"
            />
            <span>{{ isSubmittingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Modal Ubah Kata Sandi -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPasswordModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in zoom-in-95 duration-150"
        >
          <!-- Header Modal -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#FF9F43] dark:bg-amber-950/60 dark:text-amber-400">
                <FeatherIcon name="lock" size="18" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Ubah Kata Sandi
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Perbarui keamanan password akun Anda
                </p>
              </div>
            </div>
            <button
              type="button"
              class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="closePasswordModal"
            >
              <FeatherIcon name="x" size="18" />
            </button>
          </div>

          <!-- Body Form Modal -->
          <form @submit.prevent="handlePasswordSubmit" class="mt-5 space-y-4">
            <!-- Current Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Kata Sandi Saat Ini <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  placeholder="Masukkan kata sandi lama"
                  class="w-full rounded-lg border border-gray-300 bg-white pr-10 pl-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <FeatherIcon :name="showCurrentPassword ? 'eye-off' : 'eye'" size="16" />
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Kata Sandi Baru <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  placeholder="Minimal 6 karakter"
                  class="w-full rounded-lg border border-gray-300 bg-white pr-10 pl-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  @click="showNewPassword = !showNewPassword"
                >
                  <FeatherIcon :name="showNewPassword ? 'eye-off' : 'eye'" size="16" />
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Gunakan kombinasi huruf, angka, dan simbol untuk keamanan maksimal.
              </p>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Konfirmasi Kata Sandi Baru <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="Ulangi kata sandi baru"
                  class="w-full rounded-lg border border-gray-300 bg-white pr-10 pl-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <FeatherIcon :name="showConfirmPassword ? 'eye-off' : 'eye'" size="16" />
                </button>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                @click="closePasswordModal"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmittingPassword"
                class="inline-flex items-center gap-2 rounded-lg bg-[#FF9F43] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E68F3C] disabled:opacity-60"
              >
                <FeatherIcon
                  v-if="isSubmittingPassword"
                  name="rotate-cw"
                  size="14"
                  class="animate-spin"
                />
                <span>{{ isSubmittingPassword ? 'Menyimpan...' : 'Perbarui Password' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
