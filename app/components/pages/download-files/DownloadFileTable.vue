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
  currentPageItems: [items: DownloadFileItem[]]
}>()

type ViewMode = 'list' | 'layout' | 'grid'
const activeView = ref<ViewMode>('list')
const activeDropdownId = ref<string | null>(null)
const sortByModified = ref('Last Modified')

// Pagination
const currentPage = ref(1)
const pageSize = ref(5)

const totalItems = computed(() => props.files.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1)

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.files.slice(start, start + pageSize.value)
})

watch(
  paginatedFiles,
  (items) => emit('currentPageItems', items),
  { immediate: true },
)

watch(
  () => props.files,
  () => {
    currentPage.value = Math.min(currentPage.value, totalPages.value)
  },
)

const paginationDisplay = computed(() => {
  if (totalItems.value === 0) return '0 items'
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalItems.value)
  return `${start} - ${end} of ${totalItems.value} items`
})

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

function getAvatarBg(name?: string) {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  ]
  const idx = ((name || '').length) % colors.length
  return colors[idx]
}

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <!-- Top Header & View Switchers -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
      <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">All Files</h4>

      <div class="flex items-center gap-2">
        <!-- View buttons -->
        <div class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            class="rounded-md p-1.5 transition"
            :class="activeView === 'list' ? 'bg-[#F97316] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
            title="List View"
            @click="activeView = 'list'"
          >
            <FeatherIcon name="list" :size="16" />
          </button>
          <button
            type="button"
            class="rounded-md p-1.5 transition"
            :class="activeView === 'layout' ? 'bg-[#F97316] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
            title="Layout View"
            @click="activeView = 'layout'"
          >
            <FeatherIcon name="layout" :size="16" />
          </button>
          <button
            type="button"
            class="rounded-md p-1.5 transition"
            :class="activeView === 'grid' ? 'bg-[#F97316] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
            title="Grid View"
            @click="activeView = 'grid'"
          >
            <FeatherIcon name="grid" :size="16" />
          </button>
        </div>

        <!-- Sort Modified Dropdown -->
        <div class="relative inline-flex items-center">
          <select
            v-model="sortByModified"
            class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option>Last Modified</option>
            <option>Last Modified by Me</option>
            <option>Last Opened by Me</option>
          </select>
          <FeatherIcon
            name="calendar"
            :size="14"
            class="pointer-events-none absolute left-2.5 text-gray-400"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="paginatedFiles.length === 0" class="py-12 text-center text-xs text-gray-500">
      Tidak ada file yang ditemukan.
    </div>

    <!-- List View Table -->
    <div v-else-if="activeView === 'list'" class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-gray-100 text-gray-400 uppercase text-[11px] font-semibold dark:border-gray-800">
            <th class="py-3 px-3">Name</th>
            <th class="py-3 px-3">Last Modified</th>
            <th class="py-3 px-3">Size</th>
            <th class="py-3 px-3">Owned Member</th>
            <th class="py-3 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="item in paginatedFiles"
            :key="item.id"
            class="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition group"
          >
            <!-- Name with icon -->
            <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">
              <div class="flex items-center gap-2.5">
                <img
                  :src="getFileIcon(item.fileType, item.name)"
                  :alt="item.name"
                  class="size-6 shrink-0 object-contain"
                />
                <span
                  class="cursor-pointer hover:text-primary transition"
                  :title="item.name"
                  @click="$emit('download', item)"
                >
                  {{ item.name }}
                </span>
              </div>
            </td>

            <!-- Last Modified -->
            <td class="py-3 px-3 text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
              {{ item.lastModified || item.uploadedDate }}
            </td>

            <!-- Size -->
            <td class="py-3 px-3 font-medium text-gray-600 dark:text-gray-400">
              {{ item.size }}
            </td>

            <!-- Owned Member with Avatar -->
            <td class="py-3 px-3">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  :class="getAvatarBg(item.ownedBy || item.uploadedBy)"
                >
                  {{ getInitials(item.ownedBy || item.uploadedBy) }}
                </div>
                <span class="text-gray-700 dark:text-gray-300 font-medium">
                  {{ item.ownedBy || item.uploadedBy || 'Me' }}
                </span>
              </div>
            </td>

            <!-- Action -->
            <td class="py-3 px-3 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <!-- Star button -->
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
                    title="Action"
                    @click.stop="toggleDropdown(item.id)"
                  >
                    <FeatherIcon name="more-vertical" :size="15" />
                  </button>

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
                      class="absolute right-0 top-full z-30 mt-1 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-xl dark:border-gray-800 dark:bg-gray-850 text-xs text-left"
                    >
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                        @click="$emit('delete', item)"
                      >
                        <FeatherIcon name="trash-2" :size="13" class="text-rose-500" />
                        <span>Permanent Delete</span>
                      </button>
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                        @click="$emit('edit', item)"
                      >
                        <FeatherIcon name="edit" :size="13" class="text-gray-400" />
                        <span>Restore / Rename</span>
                      </button>
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                        @click="$emit('download', item)"
                      >
                        <FeatherIcon name="download" :size="13" class="text-gray-400" />
                        <span>Download</span>
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid / Layout View -->
    <div
      v-else
      class="grid gap-4 pt-2"
      :class="activeView === 'layout' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'"
    >
      <div
        v-for="item in paginatedFiles"
        :key="item.id"
        class="rounded-xl border border-gray-200 bg-gray-50/40 p-4 transition hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-850"
      >
        <div class="flex items-center justify-between">
          <img
            :src="getFileIcon(item.fileType, item.name)"
            :alt="item.name"
            class="size-8 object-contain"
          />
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-amber-500"
              :class="{ 'text-amber-500': item.isFavorite }"
              @click.stop="$emit('toggleFavorite', item)"
            >
              <FeatherIcon name="star" :size="14" :class="{ 'fill-amber-400': item.isFavorite }" />
            </button>
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-gray-700"
              @click.stop="$emit('delete', item)"
            >
              <FeatherIcon name="trash-2" :size="14" />
            </button>
          </div>
        </div>
        <p class="mt-3 truncate text-xs font-bold text-gray-900 dark:text-gray-100" :title="item.name">
          {{ item.name }}
        </p>
        <div class="mt-1 flex items-center justify-between text-[11px] text-gray-500">
          <span>{{ item.size }}</span>
          <span>{{ item.ownedBy || 'Me' }}</span>
        </div>
      </div>
    </div>

    <!-- Pagination Footer -->
    <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-3 dark:border-gray-800 text-xs">
      <span class="text-gray-500 dark:text-gray-400">
        {{ paginationDisplay }}
      </span>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        >
          <FeatherIcon name="chevron-left" :size="14" />
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          class="flex size-7 items-center justify-center rounded font-semibold transition"
          :class="currentPage === p ? 'bg-[#F97316] text-white shadow-sm' : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'"
          @click="currentPage = p"
        >
          {{ p }}
        </button>

        <button
          type="button"
          class="flex size-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          <FeatherIcon name="chevron-right" :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
