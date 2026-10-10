<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

interface PersonalForm {
  firstName: string
  lastName: string
  userName: string
  phoneNumber: string
  email: string
  role: string
}

defineProps<{
  form: PersonalForm
}>()

const emit = defineEmits<{
  'open-password-modal': []
}>()
</script>

<template>
  <div class="pt-6">
    <div class="mb-5 flex items-center justify-between">
      <div class="flex items-center gap-2">
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

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        @click="emit('open-password-modal')"
      >
        <FeatherIcon name="key" size="13" />
        <span>Ganti Password</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- First Name -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Nama Depan <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.firstName"
          type="text"
          required
          placeholder="Contoh: Rian"
          class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
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
            type="text"
            placeholder="+62 812 3456 7890"
            class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Email Akun <span class="text-rose-500">*</span>
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

      <!-- Role -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Peran / Hak Akses (Role)
        </label>
        <input
          v-model="form.role"
          type="text"
          readonly
          class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 shadow-xs cursor-not-allowed dark:border-gray-800 dark:bg-gray-850 dark:text-gray-400"
        />
      </div>
    </div>
  </div>
</template>

