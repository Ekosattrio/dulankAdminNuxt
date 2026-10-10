<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import type { EmailConfig } from '#server/types/system-settings'

defineProps<{
  form: EmailConfig
  isSaving: boolean
  showPassword: boolean
}>()

const emit = defineEmits<{
  save: []
  reset: []
  'test-connection': []
  'toggle-password': []
}>()
</script>

<template>
  <form @submit.prevent="emit('save')" class="space-y-6">
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Card Header -->
      <div class="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white">
            SMTP Protocol Configuration
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Konfigurasi server surat keluar (Simple Mail Transfer Protocol)
          </p>
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-semibold text-gray-600 dark:text-gray-300">Status SMTP</label>
          <button
            type="button"
            role="switch"
            :aria-checked="form.status"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20',
              form.status ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            ]"
            @click="form.status = !form.status"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.status ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Engine Selector -->
        <div>
          <label class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Mail Driver / Provider
          </label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label
              :class="[
                'flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition',
                form.mailEngine === 'smtp'
                  ? 'border-primary bg-primary/5 text-primary dark:border-primary/80 dark:bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              ]"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="form.mailEngine"
                  type="radio"
                  value="smtp"
                  class="h-4 w-4 text-primary focus:ring-primary"
                />
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">SMTP Mail</div>
                  <div class="text-xs text-gray-500">Standar Gmail / Custom Host</div>
                </div>
              </div>
              <span class="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Recommended</span>
            </label>

            <label
              :class="[
                'flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition',
                form.mailEngine === 'sendgrid'
                  ? 'border-primary bg-primary/5 text-primary dark:border-primary/80 dark:bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              ]"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="form.mailEngine"
                  type="radio"
                  value="sendgrid"
                  class="h-4 w-4 text-primary focus:ring-primary"
                />
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">SendGrid API</div>
                  <div class="text-xs text-gray-500">Cloud transactional mail</div>
                </div>
              </div>
            </label>

            <label
              :class="[
                'flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition',
                form.mailEngine === 'phpmailer'
                  ? 'border-primary bg-primary/5 text-primary dark:border-primary/80 dark:bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              ]"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="form.mailEngine"
                  type="radio"
                  value="phpmailer"
                  class="h-4 w-4 text-primary focus:ring-primary"
                />
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">PHP Mailer</div>
                  <div class="text-xs text-gray-500">Native Server Web Mail</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Form Fields Grid -->
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <!-- Mail Host -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Mail Host <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.mailHost"
                type="text"
                required
                placeholder="e.g. smtp.gmail.com"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
              />
            </div>
            <p class="mt-1 text-[11px] text-gray-400">Contoh: smtp.gmail.com atau mail.domainanda.com</p>
          </div>

          <!-- Mail Port -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Port Server <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="form.mailPort"
                type="number"
                required
                placeholder="587"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
              />
              <button
                type="button"
                class="whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                @click="form.mailPort = 587; form.mailEncryption = 'tls'"
              >
                587 (TLS)
              </button>
              <button
                type="button"
                class="whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                @click="form.mailPort = 465; form.mailEncryption = 'ssl'"
              >
                465 (SSL)
              </button>
            </div>
          </div>

          <!-- Encryption -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Encryption Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.mailEncryption"
              class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
            >
              <option value="tls">TLS (Transport Layer Security - Port 587)</option>
              <option value="ssl">SSL (Secure Sockets Layer - Port 465)</option>
              <option value="none">None (Tanpa Enkripsi)</option>
            </select>
          </div>

          <!-- Mail Username -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Mail Username / Akun <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.mailUsername"
              type="text"
              required
              placeholder="admin@kacetak.com"
              class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
            />
          </div>

          <!-- Mail Password -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Password / App Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.mailPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••••••"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
              />
              <button
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click="emit('toggle-password')"
              >
                <FeatherIcon :name="showPassword ? 'eye-off' : 'eye'" :size="16" />
              </button>
            </div>
            <p class="mt-1 text-[11px] text-gray-400">Untuk Gmail, gunakan Google App Password 16 karakter</p>
          </div>

          <!-- From Email -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              From Email Address (Pengirim) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fromEmail"
              type="email"
              required
              placeholder="noreply@kacetak.com"
              class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
            />
          </div>

          <!-- From Name -->
          <div class="md:col-span-2">
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              From Name (Nama Tampilan Pengirim) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fromName"
              type="text"
              required
              placeholder="Kacetak POS & Printing System"
              class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:border-gray-700"
            />
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="emit('reset')"
        >
          Batal / Reset
        </button>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 dark:border-primary/40 dark:bg-primary/20"
            @click="emit('test-connection')"
          >
            <FeatherIcon name="send" :size="15" />
            <span>Test Koneksi</span>
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
          >
            <FeatherIcon v-if="!isSaving" name="check" :size="16" />
            <span v-if="isSaving" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

