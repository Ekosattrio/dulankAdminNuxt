<script setup lang="ts">
import { ref, reactive } from 'vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import type { PasswordChangePayload } from '#server/types/profile'

defineProps<{
  open: boolean
  busy: boolean
}>()

const emit = defineEmits<{
  'submit-password': [payload: PasswordChangePayload]
  close: []
}>()

const passwordForm = reactive<PasswordChangePayload>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

function handleSubmit() {
  emit('submit-password', { ...passwordForm })
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Ganti Password Akun"
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Pastikan password baru Anda memiliki minimal 8 karakter dan kombinasi huruf, angka, serta simbol untuk keamanan maksimal.
      </p>

      <!-- Current Password -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Password Saat Ini <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="passwordForm.currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            required
            placeholder="Masukkan password saat ini"
            class="w-full rounded-lg border border-gray-300 bg-white px-3.5 pr-10 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="showCurrentPassword = !showCurrentPassword"
          >
            <FeatherIcon :name="showCurrentPassword ? 'eye-off' : 'eye'" size="16" />
          </button>
        </div>
      </div>

      <!-- New Password -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Password Baru <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="passwordForm.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            required
            minlength="8"
            placeholder="Minimal 8 karakter"
            class="w-full rounded-lg border border-gray-300 bg-white px-3.5 pr-10 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="showNewPassword = !showNewPassword"
          >
            <FeatherIcon :name="showNewPassword ? 'eye-off' : 'eye'" size="16" />
          </button>
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Ulangi Password Baru <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="passwordForm.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            minlength="8"
            placeholder="Ketik ulang password baru"
            class="w-full rounded-lg border border-gray-300 bg-white px-3.5 pr-10 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <FeatherIcon :name="showConfirmPassword ? 'eye-off' : 'eye'" size="16" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="inline-flex items-center gap-2 rounded-lg bg-[#FF9F43] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#E68F3C] disabled:opacity-60"
        >
          <FeatherIcon v-if="busy" name="rotate-cw" size="14" class="animate-spin" />
          <span>{{ busy ? 'Menyimpan...' : 'Update Password' }}</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

