<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  totalFiles?: number
}>()

const emit = defineEmits<{
  uploadFile: []
  uploadFolder: []
  createFolder: []
}>()

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleUploadFile() {
  isDropdownOpen.value = false
  emit('uploadFile')
}

function handleUploadFolder() {
  isDropdownOpen.value = false
  emit('uploadFolder')
}

function handleCreateFolder() {
  isDropdownOpen.value = false
  emit('createFolder')
}

// Close dropdown on click outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <aside class="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <!-- Header Files -->
    <div class="flex items-center gap-2.5 pb-4">
      <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FeatherIcon name="folder" :size="18" />
      </div>
      <h5 class="text-base font-bold text-gray-900 dark:text-gray-100">Files</h5>
    </div>

    <!-- + New Button with Dropdown -->
    <div ref="dropdownRef" class="relative mb-6">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EA580C] focus:outline-none"
        @click.stop="toggleDropdown"
      >
        <FeatherIcon name="plus-circle" :size="16" />
        <span>New</span>
      </button>

      <!-- Dropdown Menu -->
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isDropdownOpen"
          class="absolute left-0 top-full z-30 mt-2 w-full rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-850"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="handleUploadFile"
          >
            <FeatherIcon name="upload-cloud" :size="15" class="text-gray-500" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="handleUploadFolder"
          >
            <FeatherIcon name="folder" :size="15" class="text-gray-500" />
            <span>Upload Folder</span>
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="handleCreateFolder"
          >
            <FeatherIcon name="folder-minus" :size="15" class="text-gray-500" />
            <span>Create folder</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- Storage Info -->
    <div class="space-y-2 border-t border-gray-100 pt-5 dark:border-gray-800">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
          <FeatherIcon name="hard-drive" :size="15" class="text-gray-500" />
          <span>Storage</span>
        </div>
        <span class="font-bold text-gray-700 dark:text-gray-300">70%</span>
      </div>

      <!-- Progress Bar (Red/Danger) -->
      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div class="h-full rounded-full bg-rose-500" style="width: 75%"></div>
      </div>

      <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">
        78.5 GB of 1 TB Free Used
      </p>
    </div>
  </aside>
</template>
