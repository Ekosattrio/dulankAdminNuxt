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
    <div class="mb-5 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-[#FF9F43] dark:bg-amber-950/60 dark:text-amber-400">
        <FeatherIcon name="map-pin" size="16" />
      </div>
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Alamat Domisili Karyawan
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Informasi tempat tinggal dan korespondensi resmi
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Full Address -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Alamat Lengkap (Jalan, RT/RW, No. Rumah)
        </label>
        <textarea
          v-model="form.address"
          rows="2"
          placeholder="Jl. Merdeka No. 45, RT 02/RW 04, Kelurahan Gambir"
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
            placeholder="Jakarta Pusat"
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
            placeholder="10110"
            class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

