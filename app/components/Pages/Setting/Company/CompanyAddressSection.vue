<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

interface AddressForm {
  address: string
  country: string
  province: string
  city: string
  postalCode: string
}

defineProps<{
  form: AddressForm
}>()
</script>

<template>
  <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
    <div class="mb-5 flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
        <FeatherIcon name="map-pin" size="18" />
      </div>
      <div>
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          Alamat Kantor & Workshop Percetakan
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Alamat fisik perusahaan yang tercantum pada surat jalan dan invoice resmi
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Full Address -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Alamat Lengkap Perusahaan
        </label>
        <textarea
          v-model="form.address"
          rows="2"
          placeholder="Kawasan Percetakan Industri Modern, Blok D2 No. 14, Jl. Daan Mogot KM 19"
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
            placeholder="Jakarta Barat"
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
            placeholder="11840"
            class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

