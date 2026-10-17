<script setup lang="ts">
defineProps<{
  judul: string
  desc: string
  copyright: string
}>()

const emit = defineEmits<{
  'update:judul': [value: string]
  'update:desc': [value: string]
  'update:copyright': [value: string]
}>()
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
      Konten Utama
    </h5>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Judul</label>
        <input
          :value="judul"
          type="text"
          placeholder="Judul"
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @input="emit('update:judul', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Teks singkat (deskripsi)</label>
        <textarea
          :value="desc"
          rows="3"
          placeholder="Deskripsi perusahaan atau tagline"
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @input="emit('update:desc', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Copyright</label>
        <input
          :value="copyright"
          type="text"
          placeholder="© 2026 Nama Perusahaan — Semua hak dilindungi"
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @input="emit('update:copyright', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

