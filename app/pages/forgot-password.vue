<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'auth',
})

useLegacyPage({
  title: 'Forgot Password',
  sweetAlert: false,
})

const email = ref('')
const submitted = ref(false)

const handleSubmit = () => {
  submitted.value = true
}
</script>

<template>
  <div class="dulank-page dulank-page-forgot-password min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
    <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <!-- Logo -->
      <div class="text-center mb-6">
        <NuxtLink to="/">
          <img src="/assets/img/logo.png" alt="logo" class="mx-auto h-10 object-contain" />
        </NuxtLink>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="text-center space-y-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Forgot password?</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">If you forgot your password, well, then we'll email you instructions to reset your password.</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full rounded-lg border border-gray-200 bg-white py-2.5 ps-3.5 pe-10 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <img
              src="/assets/img/icons/mail.svg"
              alt="mail"
              class="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 size-4 opacity-50"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="w-full rounded-lg bg-[#FE9F43] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933] transition-colors"
          >
            Send Reset Link
          </button>
        </div>

        <p v-if="submitted" role="status" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300 text-center">
          If an account exists for {{ email }}, a password reset link has been sent.
        </p>

        <div class="text-center pt-1">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Return to
            <NuxtLink to="/signin" class="text-[#FE9F43] font-medium hover:underline"> login</NuxtLink>
          </p>
        </div>

        <!-- OR Divider -->
        <div class="relative my-4 text-center">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <span class="relative bg-white px-3 text-xs text-gray-400 dark:bg-gray-900">OR</span>
        </div>

        <!-- Social Links -->
        <div class="flex justify-center gap-3">
          <a href="javascript:void(0);" class="inline-flex size-10 items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800 transition">
            <img src="/assets/img/icons/facebook-logo.svg" alt="Facebook" class="size-5" />
          </a>
          <a href="javascript:void(0);" class="inline-flex size-10 items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800 transition">
            <img src="/assets/img/icons/google.png" alt="Google" class="size-5" />
          </a>
          <a href="javascript:void(0);" class="inline-flex size-10 items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:hover:bg-gray-800 transition">
            <img src="/assets/img/icons/apple-logo.svg" alt="Apple" class="size-5" />
          </a>
        </div>
      </form>
    </div>
  </div>
</template>
