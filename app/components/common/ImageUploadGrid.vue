<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    disabled?: boolean
    maxImages?: number
  }>(),
  {
    modelValue: () => [],
    disabled: false,
    maxImages: 10,
  },
)

const emit = defineEmits<{
  'update:modelValue': [images: string[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function triggerFileInput() {
  if (!props.disabled) {
    fileInputRef.value?.click()
  }
}

function processFiles(files: FileList | null) {
  if (!files || props.disabled) return
  const current = [...props.modelValue]

  for (let i = 0; i < files.length; i++) {
    if (current.length >= props.maxImages) break
    const file = files[i]
    if (!file.type.startsWith('image/')) continue

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result && !current.includes(result)) {
        current.push(result)
        emit('update:modelValue', [...current])
      }
    }
    reader.readAsDataURL(file)
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  processFiles(target.files)
  target.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (props.disabled) return
  processFiles(event.dataTransfer?.files || null)
}

function removeImage(index: number) {
  if (props.disabled) return
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}
</script>

<template>
  <div class="space-y-3">
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileChange"
    />

    <div class="flex flex-wrap items-center gap-3">
      <!-- Upload trigger zone -->
      <div
        class="flex h-24 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-2 text-center transition-colors hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-gray-800/40"
        :class="{
          'border-primary bg-primary/10': isDragging,
          'opacity-50 cursor-not-allowed': disabled,
        }"
        @click="triggerFileInput"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <div class="mb-1 rounded-full bg-orange-100 p-1.5 text-primary dark:bg-orange-950/40">
          <FeatherIcon name="plus-circle" :size="16" />
        </div>
        <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Add Images</span>
      </div>

      <!-- Preview list -->
      <div
        v-for="(img, idx) in modelValue"
        :key="idx"
        class="group relative flex h-24 w-28 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <img
          :src="img"
          alt="Product thumbnail"
          class="h-full w-full object-cover"
        />

        <button
          v-if="!disabled"
          type="button"
          class="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow transition-transform hover:scale-110 focus:outline-none"
          aria-label="Remove image"
          @click.stop="removeImage(idx)"
        >
          <FeatherIcon name="x" :size="12" />
        </button>
      </div>
    </div>
  </div>
</template>
