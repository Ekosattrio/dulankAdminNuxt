<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useLegacyPage({ title: 'Reset Password', sweetAlert: false })
const route = useRoute()
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const token = typeof route.query.token === 'string' ? route.query.token : ''
const password = ref('')
const confirmation = ref('')
const { busy, error, submitted, reset } = usePasswordRecovery()
</script>
<template>
  <main class="mx-auto my-12 max-w-md rounded-xl bg-white p-6 shadow dark:bg-gray-900">
    <h1 class="mb-5 text-xl font-semibold">Reset Password</h1>
    <p v-if="error" role="alert" class="mb-4 text-sm text-red-600">{{ error }}</p>
    <p v-if="submitted" role="status" class="text-sm">Password diperbarui. Silakan login kembali.</p>
    <form v-else class="space-y-4" @submit.prevent="reset(email, token, password, confirmation)">
      <label class="block text-sm">Email<input v-model="email" type="email" autocomplete="email" required class="mt-1 w-full rounded border p-2 dark:bg-gray-800" /></label>
      <label class="block text-sm">Password baru<input v-model="password" type="password" minlength="8" autocomplete="new-password" required class="mt-1 w-full rounded border p-2 dark:bg-gray-800" /></label>
      <label class="block text-sm">Konfirmasi password<input v-model="confirmation" type="password" minlength="8" autocomplete="new-password" required class="mt-1 w-full rounded border p-2 dark:bg-gray-800" /></label>
      <button :disabled="busy || !token" type="submit" class="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">{{ busy ? 'Memproses...' : 'Simpan Password' }}</button>
    </form>
    <NuxtLink to="/signin" class="mt-4 block text-sm text-primary">Kembali ke login</NuxtLink>
  </main>
</template>
