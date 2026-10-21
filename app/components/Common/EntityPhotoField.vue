<script setup lang="ts">
const props = defineProps<{ modelValue?: string | null; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const fileId = useId()
function select(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  readFile(file)
  input.value = ''
}
function readFile(file: File) {
  if (props.disabled) return
  error.value = ''
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024) {
    error.value = 'Gunakan JPG, PNG, atau WebP maksimal 4 MB.'; return
  }
  const reader = new FileReader()
  reader.onload = () => { emit('update:modelValue', String(reader.result)) }
  reader.readAsDataURL(file)
}
function drop(event: DragEvent) {
  dragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) readFile(file)
}
</script>
<template>
  <div class="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-gray-50/60 p-4 text-center dark:bg-gray-800/40" :class="dragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'" @dragover.prevent="!disabled && (dragging = true)" @dragleave.prevent="dragging = false" @drop.prevent="drop">
    <div v-if="modelValue" class="relative">
      <img :src="modelValue" alt="Photo preview" class="size-24 rounded-full border-2 border-primary/30 object-cover shadow-sm" />
      <button type="button" :disabled="disabled" title="Remove photo" aria-label="Hapus foto" class="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 disabled:opacity-50" @click="emit('update:modelValue', null)"><FeatherIcon name="x" :size="14" /></button>
    </div>
    <button v-else type="button" :disabled="disabled" aria-label="Pilih foto" class="flex size-24 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-gray-300 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800" @click="fileInput?.click()"><FeatherIcon name="image" :size="28" /><span class="text-xs">Upload Photo</span></button>
    <input :id="fileId" ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload photo" :disabled="disabled" class="hidden" @change="select" />
    <button type="button" :disabled="disabled" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" @click="fileInput?.click()"><FeatherIcon name="camera" :size="14" />{{ modelValue ? 'Change Photo' : 'Choose Photo' }}</button>
    <p class="text-xs text-gray-500">Tarik foto ke sini atau pilih file. JPG, PNG, WebP; maksimal 4 MB.</p>
    <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
