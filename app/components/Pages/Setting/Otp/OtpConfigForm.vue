<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import type { OtpConfig } from '#server/types/system-settings'
import OtpPreviewCard from './OtpPreviewCard.vue'

const props = defineProps<{
  form: OtpConfig
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:form': [val: OtpConfig]
  submit: []
  reset: []
}>()
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Master Toggle Header -->
      <div class="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white">
            Status Verifikasi OTP
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Wajibkan pelanggan atau staf memasukkan kode OTP saat login sensitif & pembayaran
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold" :class="form.isEnabled ? 'text-primary' : 'text-gray-400'">
            {{ form.isEnabled ? 'Aktif' : 'Nonaktif' }}
          </span>
          <button
            type="button"
            role="switch"
            :aria-checked="form.isEnabled"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20',
              form.isEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            ]"
            @click="form.isEnabled = !form.isEnabled"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.isEnabled ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>

      <div class="space-y-6 p-6">
        <!-- Delivery Provider Selection -->
        <div>
          <label class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Kanal Pengiriman Utama (Provider)
          </label>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <!-- WhatsApp -->
            <label
              :class="[
                'relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition',
                form.provider === 'whatsapp'
                  ? 'border-emerald-500 bg-emerald-50/40 dark:border-emerald-500/80 dark:bg-emerald-950/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    <FeatherIcon name="message-circle" :size="20" />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">WhatsApp</div>
                    <div class="text-xs text-gray-500">Gateway API / Wablas</div>
                  </div>
                </div>
                <input
                  v-model="form.provider"
                  type="radio"
                  value="whatsapp"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <div class="mt-4 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400">
                <span>Kecepatan instan</span>
                <span class="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold dark:bg-emerald-900/60">Populer di Indonesia</span>
              </div>
            </label>

            <!-- SMS -->
            <label
              :class="[
                'relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition',
                form.provider === 'sms'
                  ? 'border-primary bg-primary/5 dark:border-primary/80 dark:bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                    <FeatherIcon name="smartphone" :size="20" />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">SMS Gateway</div>
                    <div class="text-xs text-gray-500">GSM Seluler / Twilio</div>
                  </div>
                </div>
                <input
                  v-model="form.provider"
                  type="radio"
                  value="sms"
                  class="h-4 w-4 text-primary focus:ring-primary"
                />
              </div>
              <div class="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
                Dapat diterima tanpa koneksi data internet
              </div>
            </label>

            <!-- Email -->
            <label
              :class="[
                'relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition',
                form.provider === 'email'
                  ? 'border-blue-500 bg-blue-50/40 dark:border-blue-500/80 dark:bg-blue-950/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    <FeatherIcon name="mail" :size="20" />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900 dark:text-white">Email</div>
                    <div class="text-xs text-gray-500">SMTP Server Default</div>
                  </div>
                </div>
                <input
                  v-model="form.provider"
                  type="radio"
                  value="email"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div class="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
                Gratis via SMTP lokal server
              </div>
            </label>
          </div>
        </div>

        <!-- Param Details Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Digit Limit -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Panjang Digit Kode
            </label>
            <select
              v-model.number="form.digitLimit"
              class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-xs focus:border-primary focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option :value="4">4 Karakter</option>
              <option :value="6">6 Karakter (Standar)</option>
              <option :value="8">8 Karakter</option>
            </select>
          </div>

          <!-- Expire Minutes -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Masa Berlaku Kode (Expired)
            </label>
            <select
              v-model.number="form.expireMinutes"
              class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-xs focus:border-primary focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option :value="2">2 Menit</option>
              <option :value="5">5 Menit (Direkomendasikan)</option>
              <option :value="10">10 Menit</option>
            </select>
          </div>

          <!-- Resend Delay -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Jeda Kirim Ulang (Resend Delay)
            </label>
            <select
              v-model.number="form.resendDelaySeconds"
              class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-xs focus:border-primary focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option :value="30">30 Detik</option>
              <option :value="60">60 Detik (1 Menit)</option>
              <option :value="120">120 Detik (2 Menit)</option>
            </select>
          </div>

          <!-- OTP Type -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Format Karakter Kode
            </label>
            <select
              v-model="form.otpType"
              class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-xs focus:border-primary focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <option value="numeric">Angka Saja (Numeric)</option>
              <option value="alphanumeric">Angka & Huruf (Alphanumeric)</option>
            </select>
          </div>
        </div>

        <!-- Preview Simulator Box -->
        <OtpPreviewCard :form="form" />
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('reset')"
        >
          Batal / Reset
        </button>

        <button
          type="submit"
          :disabled="busy"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        >
          <FeatherIcon v-if="!busy" name="check" :size="16" />
          <span v-if="busy" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          <span>{{ busy ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
        </button>
      </div>
    </div>
  </form>
</template>

