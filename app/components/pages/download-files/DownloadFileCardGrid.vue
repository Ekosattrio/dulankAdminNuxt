<script setup lang="ts">
import type { DownloadFileItem } from '#server/types/download-file'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  files: DownloadFileItem[]
}>()

const emit = defineEmits<{
  toggleFavorite: [item: DownloadFileItem]
  download: [item: DownloadFileItem]
  delete: [item: DownloadFileItem]
  edit: [item: DownloadFileItem]
}>()

const isCollapsed = ref(false)
const activeDropdownId = ref<string | null>(null)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function toggleDropdown(id: string) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

function closeDropdowns() {
  activeDropdownId.value = null
}

function getFileIcon(type?: string, name?: string) {
  const n = (name || '').toLowerCase()
  if (type === 'pdf' || n.endsWith('.pdf')) return '/assets/img/icons/pdf-02.svg'
  if (type === 'excel' || n.endsWith('.xls') || n.endsWith('.xlsx') || n.endsWith('.csv')) return '/assets/img/icons/xls.svg'
  if (type === 'video' || n.endsWith('.mp4') || n.endsWith('.mkv')) return '/assets/img/icons/video.svg'
  if (type === 'audio' || n.endsWith('.mp3') || n.endsWith('.wav')) return '/assets/img/icons/audio.svg'
  if (type === 'folder') return '/assets/img/icons/folder.svg'
  return '/assets/img/icons/pdf-02.svg'
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<template>
  <div class="space-y-3">
    <!-- Section Header with Hide toggle -->
    <div class="flex items-center justify-between">
      <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">Files</h4>
      <button
        type="button"
        class="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
        @click="toggleCollapse"
      >
        {{ isCollapsed ? 'Show' : 'Hide' }}
      </button>
    </div>

    <!-- Cards Grid -->
    <div
      v-show="!isCollapsed"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="item in files"
        :key="item.id"
        class="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Top Row: Icon + Name & Actions -->
        <div class="flex items-center justify-between gap-3">
          <!-- File icon + Name -->
          <div class="flex items-center gap-3 min-w-0">
            <img
              :src="getFileIcon(item.fileType, item.name)"
              :alt="item.name"
              class="size-8 shrink-0 object-contain"
            />
            <h6
              class="truncate text-sm font-bold text-gray-900 hover:text-primary dark:text-gray-100 cursor-pointer"
              :title="item.name"
              @click="$emit('download', item)"
            >
              {{ item.name }}
            </h6>
          </div>

          <!-- Star & Dropdown Actions -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-amber-500 transition"
              :class="{ 'text-amber-500': item.isFavorite }"
              title="Favorite"
              @click.stop="$emit('toggleFavorite', item)"
            >
              <FeatherIcon
                name="star"
                :size="15"
                :class="{ 'fill-amber-400 text-amber-500': item.isFavorite }"
              />
            </button>

            <!-- Dropdown -->
            <div class="relative">
              <button
                type="button"
                class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition"
                title="Options"
                @click.stop="toggleDropdown(item.id)"
              >
                <FeatherIcon name="more-vertical" :size="15" />
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
                  v-if="activeDropdownId === item.id"
                  class="absolute right-0 top-full z-30 mt-1 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-xl dark:border-gray-800 dark:bg-gray-850 text-xs"
                >
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                    @click="$emit('download', item)"
                  >
                    <FeatherIcon name="download" :size="13" class="text-gray-400" />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                    @click="$emit('edit', item)"
                  >
                    <FeatherIcon name="edit" :size="13" class="text-gray-400" />
                    <span>Rename / Edit</span>
                  </button>
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    @click="$emit('delete', item)"
                  >
                    <FeatherIcon name="trash-2" :size="13" class="text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Meta Info -->
        <div class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{{ item.lastModified || `Last edited ${item.uploadedDate}` }}</span>
          <span>•</span>
          <span>{{ item.membersCount ? `${String(item.membersCount).padStart(2, '0')} Members` : '09 Members' }}</span>
          <span>•</span>
          <span>{{ item.size }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
