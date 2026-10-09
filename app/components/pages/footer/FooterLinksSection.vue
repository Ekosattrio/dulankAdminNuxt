<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  title: string
  subtitle: string
  items: { text: string; href: string }[]
  placeholderText?: string
}>()

const emit = defineEmits<{
  (e: 'add', item: { text: string; href: string }): void
  (e: 'remove', index: number): void
  (e: 'error', message: string): void
}>()

const newText = ref('')
const newHref = ref('')

function handleAdd() {
  if (!newText.value.trim() || !newHref.value.trim()) {
    emit('error', 'Isi judul dan URL link.')
    return
  }
  emit('add', {
    text: newText.value.trim(),
    href: newHref.value.trim(),
  })
  newText.value = ''
  newHref.value = ''
}
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
      {{ title }}
    </h5>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
      {{ subtitle }}
    </p>

    <!-- Dynamic List -->
    <div class="space-y-2 mb-3">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="flex items-center gap-2"
      >
        <input
          v-model="item.text"
          type="text"
          placeholder="Judul link"
          class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          v-model="item.href"
          type="text"
          placeholder="URL (https://...)"
          class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition"
          title="Hapus"
          @click="emit('remove', idx)"
        >
          <FeatherIcon name="trash-2" size="14" />
        </button>
      </div>
    </div>

    <!-- Add New Row -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
      <input
        v-model="newText"
        type="text"
        :placeholder="placeholderText || 'Judul link (mis. Tentang Kami)'"
        class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        @keyup.enter="handleAdd"
      />
      <input
        v-model="newHref"
        type="text"
        placeholder="URL (https://...)"
        class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        @keyup.enter="handleAdd"
      />
      <button
        type="button"
        class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition"
        @click="handleAdd"
      >
        <FeatherIcon name="plus" size="14" />
        <span>Tambah</span>
      </button>
    </div>
  </div>
</template>

