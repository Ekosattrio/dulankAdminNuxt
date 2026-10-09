<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'auth',
})

useLegacyPage({
  title: 'Sign In',
  sweetAlert: false,
})

const email = ref('admin@example.com')
const password = ref('123456')
const rememberMe = ref(false)
const showPassword = ref(false)

const handleLogin = () => {
  navigateTo('/')
}
</script>

<template>
  <div class="dulank-page dulank-page-signin min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
    <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <!-- Logo -->
      <div class="text-center mb-6">
        <NuxtLink to="/">
          <img src="/assets/img/logo.png" alt="logo" class="mx-auto h-10 object-contain" />
        </NuxtLink>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="text-center space-y-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Sign In</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Access the Dulank panel using your email and passcode.</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email address"
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

        <!-- Password -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
              class="w-full rounded-lg border border-gray-200 bg-white py-2.5 ps-3.5 pe-10 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              class="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'ti ti-eye' : 'ti ti-eye-off'"></i>
            </button>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between text-xs pt-1">
          <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
            <input v-model="rememberMe" type="checkbox" class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43]" />
            <span>Remember me</span>
          </label>
          <NuxtLink to="/forgot-password" class="text-[#FE9F43] font-medium hover:underline">
            Forgot Password?
          </NuxtLink>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="w-full rounded-lg bg-[#FE9F43] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933] transition-colors"
          >
            Sign In
          </button>
        </div>

        <div class="text-center pt-1">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            New on our platform?
            <NuxtLink to="/signin" class="text-[#FE9F43] font-medium hover:underline"> Create an account</NuxtLink>
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
