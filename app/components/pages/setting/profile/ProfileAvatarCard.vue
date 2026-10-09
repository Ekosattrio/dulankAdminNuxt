<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  avatarUrl: string
  firstName: string
  lastName: string
  role: string
}>()

const emit = defineEmits<{
  'update:avatarUrl': [url: string]
  'toast': [msg: string, type: 'success' | 'error']
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewAvatarUrl = ref<string | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      emit('toast', 'Ukuran file maksimal 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      previewAvatarUrl.value = result
      emit('update:avatarUrl', result)
    }
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  previewAvatarUrl.value = null
  emit('update:avatarUrl', '/assets/img/users/user-01.jpg')
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-gray-100 pb-6 dark:border-gray-800">
    <div class="relative group mx-auto sm:mx-0">
      <div class="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ring-gray-100 dark:border-gray-800 dark:ring-gray-700">
        <img
          :src="previewAvatarUrl || avatarUrl || '/assets/img/users/user-01.jpg'"
          alt="Foto Profil"
          class="h-full w-full object-cover"
        />
      </div>
      <button
        type="button"
        class="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9F43] text-white shadow-md transition hover:bg-[#E68F3C] focus:outline-none"
        title="Unggah Foto Baru"
        @click="triggerFileInput"
      >
        <FeatherIcon name="camera" size="14" />
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        class="hidden"
        @change="handleFileChange"
      />
    </div>

    <div class="flex-1 text-center sm:text-left">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ firstName }} {{ lastName }}
        </h2>
        <span
          v-if="role"
          class="inline-flex items-center gap-1.5 self-center sm:self-start rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30"
        >
          <FeatherIcon name="shield" size="12" />
          {{ role }}
        </span>
      </div>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Format yang didukung: JPG, PNG, atau WebP. Maksimal 5MB (Rekomendasi rasio 1:1 / 450x450 px).
      </p>

      <div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          @click="triggerFileInput"
        >
          <FeatherIcon name="upload" size="13" />
          <span>Pilih Foto Baru</span>
        </button>
        <button
          v-if="previewAvatarUrl || avatarUrl !== '/assets/img/users/user-01.jpg'"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          @click="removeAvatar"
        >
          <FeatherIcon name="trash-2" size="13" />
          <span>Hapus Foto</span>
        </button>
      </div>
    </div>
  </div>
</template>

