<script setup lang="ts">
import type { SecuritySettings } from '#server/types/security-settings'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  security: SecuritySettings
}>()

const emit = defineEmits<{
  'change-password': []
  'toggle-2fa': []
  'toggle-google': []
  'change-phone': []
  'remove-phone': []
  'change-email': []
  'remove-email': []
  'manage-devices': []
  'view-activities': []
  'deactivate-account': []
}>()
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <div class="border-b border-gray-100 p-5 dark:border-gray-800">
      <h3 class="text-base font-bold text-gray-900 dark:text-white">Security Controls & Authentications</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">Atur keamanan akun, otentikasi multi-faktor, dan riwayat perangkat</p>
    </div>

    <ul class="divide-y divide-gray-100 dark:divide-gray-800">
      <!-- 1. Password -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <FeatherIcon name="key" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Password</h4>
            <p class="text-xs text-gray-500">Terakhir diubah: {{ security.passwordLastChanged }}</p>
          </div>
        </div>
        <div>
          <button
            type="button"
            class="h-9 rounded-md bg-primary px-4 text-xs font-semibold text-white shadow-xs hover:bg-primary/90"
            @click="emit('change-password')"
          >
            Ubah Password
          </button>
        </div>
      </li>

      <!-- 2. Two Factor -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <FeatherIcon name="shield" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Two Factor Authentication (2FA)</h4>
            <p class="text-xs text-gray-500">Verifikasi kode tambahan melalui SMS / WhatsApp setiap login</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            :class="security.twoFactor ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
          >
            {{ security.twoFactor ? 'Aktif' : 'Nonaktif' }}
          </span>
          <button
            type="button"
            class="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            @click="emit('toggle-2fa')"
          >
            {{ security.twoFactor ? 'Nonaktifkan' : 'Aktifkan' }}
          </button>
        </div>
      </li>

      <!-- 3. Google Authentication -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <FeatherIcon name="check-circle" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Google Authenticator</h4>
            <p class="text-xs text-gray-500">Hubungkan dengan aplikasi Google Authenticator</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            :class="security.googleAuth ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
          >
            {{ security.googleAuth ? 'Terhubung' : 'Terputus' }}
          </span>
          <button
            type="button"
            class="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            @click="emit('toggle-google')"
          >
            {{ security.googleAuth ? 'Putuskan' : 'Hubungkan' }}
          </button>
        </div>
      </li>

      <!-- 4. Phone Verification -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <FeatherIcon name="phone" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Nomor Telepon Terverifikasi</h4>
            <p class="text-xs text-gray-500">{{ security.phone }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            @click="emit('change-phone')"
          >
            Ubah
          </button>
          <button
            type="button"
            class="h-8 rounded-md px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            @click="emit('remove-phone')"
          >
            Hapus
          </button>
        </div>
      </li>

      <!-- 5. Email Verification -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <FeatherIcon name="mail" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Alamat Email Terverifikasi</h4>
            <p class="text-xs text-gray-500">{{ security.email }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            @click="emit('change-email')"
          >
            Ubah
          </button>
          <button
            type="button"
            class="h-8 rounded-md px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            @click="emit('remove-email')"
          >
            Hapus
          </button>
        </div>
      </li>

      <!-- 6. Device Management -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <FeatherIcon name="monitor" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Manajemen Perangkat Aktif</h4>
            <p class="text-xs text-gray-500">{{ security.devices?.length || 0 }} perangkat login terdaftar</p>
          </div>
        </div>
        <div>
          <button
            type="button"
            class="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            @click="emit('manage-devices')"
          >
            Lihat Perangkat
          </button>
        </div>
      </li>

      <!-- 7. Account Activity -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <FeatherIcon name="activity" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Log Aktivitas Akun</h4>
            <p class="text-xs text-gray-500">Riwayat sesi dan event keamanan akun</p>
          </div>
        </div>
        <div>
          <button
            type="button"
            class="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            @click="emit('view-activities')"
          >
            Lihat Aktivitas
          </button>
        </div>
      </li>

      <!-- 8. Deactivate Account -->
      <li class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <FeatherIcon name="slash" :size="18" />
          </div>
          <div>
            <h4 class="text-sm font-semibold text-rose-600 dark:text-rose-400">Nonaktifkan Akun</h4>
            <p class="text-xs text-gray-500">Tutup akses akun secara sementara atau permanen</p>
          </div>
        </div>
        <div>
          <button
            type="button"
            class="h-8 rounded-md border border-rose-200 px-3 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
            @click="emit('deactivate-account')"
          >
            Nonaktifkan
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

