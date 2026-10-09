<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { CompanyImages } from '#server/types/company-setting'

interface ImageSlot {
  key: keyof CompanyImages
  title: string
  desc: string
  recommended: string
}

const props = defineProps<{
  images: CompanyImages
}>()

const emit = defineEmits<{
  'update:images': [value: CompanyImages]
  'upload-image': [event: Event, key: keyof CompanyImages]
  'reset-image': [key: keyof CompanyImages]
}>()

const imageSlots: ImageSlot[] = [
  {
    key: 'logo',
    title: 'Logo Utama Perusahaan',
    desc: 'Ditampilkan di kop faktur, invoice, header aplikasi, dan nota cetak',
    recommended: 'Format PNG/SVG transparan, maks 5MB'
  },
  {
    key: 'darkLogo',
    title: 'Logo Mode Gelap (Dark Mode)',
    desc: 'Ditampilkan saat pengguna mengaktifkan mode tema malam/dark mode',
    recommended: 'Format PNG transparan warna terang, maks 5MB'
  },
  {
    key: 'icon',
    title: 'Company App Icon',
    desc: 'Ikon lambang ringkas untuk sidebar collapsed dan aplikasi mobile',
    recommended: 'Rasio 1:1 persegi, maks 5MB'
  },
  {
    key: 'favicon',
    title: 'Favicon Browser',
    desc: 'Ikon kecil pada tab browser pengunjung dan dashboard admin',
    recommended: 'Format ICO/PNG 32x32 atau 64x64 px'
  }
]
</script>

<template>
  <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
    <div class="mb-5 flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
        <FeatherIcon name="image" size="18" />
      </div>
      <div>
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          Identitas Visual & Logo Perusahaan
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Unggah logo untuk faktur, browser tab, dan mode terang/gelap
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="slot in imageSlots"
        :key="slot.key"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-850 dark:hover:border-gray-700"
      >
        <div class="space-y-1 max-w-sm">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">
              {{ slot.title }}
            </h3>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ slot.desc }}
          </p>
          <p class="text-[11px] text-amber-600 dark:text-amber-400">
            {{ slot.recommended }}
          </p>

          <div class="pt-2 flex items-center gap-2">
            <label class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm cursor-pointer transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750">
              <FeatherIcon name="upload" size="13" />
              <span>Upload Baru</span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="e => emit('upload-image', e, slot.key)"
              />
            </label>

            <button
              v-if="images[slot.key]"
              type="button"
              class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              title="Reset ke default"
              @click="emit('reset-image', slot.key)"
            >
              <FeatherIcon name="refresh-ccw" size="12" />
              <span>Default</span>
            </button>
          </div>
        </div>

        <!-- Preview Box -->
        <div class="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-2 shadow-xs dark:border-gray-700 dark:bg-gray-900">
          <img
            :src="images[slot.key] || '/assets/img/logo-small.png'"
            :alt="slot.title"
            class="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

