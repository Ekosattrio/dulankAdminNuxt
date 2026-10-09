<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { UserProfile, PasswordChangePayload } from '#server/types/profile'
import { useProfile } from '~/composables/useProfile'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import ProfileAvatarCard from './profile/ProfileAvatarCard.vue'
import ProfilePersonalInfoSection from './profile/ProfilePersonalInfoSection.vue'
import ProfileAddressSection from './profile/ProfileAddressSection.vue'
import ProfilePasswordModal from './profile/ProfilePasswordModal.vue'

const { profile, pending, refresh, saveProfile, changePassword } = useProfile()

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

const isPasswordModalOpen = ref(false)
const isSubmittingPassword = ref(false)
const isSubmitting = ref(false)

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3500)
}

async function handleProfileSubmit() {
  if (!form.firstName.trim()) return showToast('Nama depan wajib diisi', 'error')
  if (!form.email.trim()) return showToast('Email akun wajib diisi', 'error')

  isSubmitting.value = true
  try {
    const res = await saveProfile({ ...form })
    showToast(res.message || 'Profil berhasil diperbarui!')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan profil', 'error')
  } finally {
    isSubmitting.value = false
  }
}

async function handlePasswordSubmit(payload: PasswordChangePayload) {
  if (!payload.currentPassword) return showToast('Password saat ini wajib diisi', 'error')
  if (!payload.newPassword) return showToast('Password baru wajib diisi', 'error')
  if (payload.newPassword.length < 8) return showToast('Password baru minimal 8 karakter', 'error')
  if (payload.newPassword !== payload.confirmPassword) return showToast('Konfirmasi password tidak cocok', 'error')

  isSubmittingPassword.value = true
  try {
    const res = await changePassword(payload)
    showToast(res.message || 'Password berhasil diubah!')
    isPasswordModalOpen.value = false
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal mengubah password', 'error')
  } finally {
    isSubmittingPassword.value = false
  }
}

function resetForm() {
  if (profile.value) {
    const val = profile.value
    Object.assign(form, {
      firstName: val.firstName || '',
      lastName: val.lastName || '',
      userName: val.userName || '',
      phoneNumber: val.phoneNumber || '',
      email: val.email || '',
      role: val.role || '',
      avatarUrl: val.avatarUrl || '/assets/img/users/user-01.jpg',
      address: val.address || '',
      country: val.country || 'Indonesia',
      province: val.province || '',
      city: val.city || '',
      postalCode: val.postalCode || ''
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

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Profil Saya
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Kelola informasi identitas pribadi, foto akun, kontak, dan keamanan kredensial
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          :disabled="pending"
          @click="refresh()"
        >
          <FeatherIcon name="rotate-cw" size="16" :class="{ 'animate-spin': pending }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="pending" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
      <div class="flex items-center gap-6">
        <div class="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div class="space-y-3">
          <div class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div class="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div v-for="n in 6" :key="n" class="h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>

    <!-- Main Profile Content (Loaded) -->
    <form v-else @submit.prevent="handleProfileSubmit" class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
        <!-- Avatar Section -->
        <ProfileAvatarCard
          :avatar-url="form.avatarUrl"
          :first-name="form.firstName"
          :last-name="form.lastName"
          :role="form.role"
          @update:avatar-url="url => form.avatarUrl = url"
          @toast="showToast"
        />

        <!-- Personal Info Section -->
        <ProfilePersonalInfoSection
          :form="form"
          @open-password-modal="isPasswordModalOpen = true"
        />

        <!-- Address Section -->
        <ProfileAddressSection
          :form="form"
        />

        <!-- Action Buttons -->
        <div class="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            @click="resetForm"
          >
            Batal / Reset
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 rounded-lg bg-[#FF9F43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E68F3C] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 disabled:opacity-60"
          >
            <FeatherIcon v-if="isSubmitting" name="rotate-cw" size="16" class="animate-spin" />
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Profil' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Password Modal -->
    <ProfilePasswordModal
      :open="isPasswordModalOpen"
      :busy="isSubmittingPassword"
      @submit-password="handlePasswordSubmit"
      @close="isPasswordModalOpen = false"
    />
  </div>
</template>
