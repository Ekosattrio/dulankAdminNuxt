<script setup lang="ts">
import { ref } from 'vue'
import type { ClientItem } from '#server/types/client'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  clients: ClientItem[]
  isBusy: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', client: ClientItem): void
  (e: 'delete', client: ClientItem): void
  (e: 'reorder', updatedList: ClientItem[]): void
}>()

// Drag and drop state
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const isDragging = ref(false)

function onDragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  if (dragOverIndex.value !== index) {
    dragOverIndex.value = index
  }
}

function onDragLeave(index: number) {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

function onDrop(targetIndex: number) {
  if (dragIndex.value === null || dragIndex.value === targetIndex) {
    onDragEnd()
    return
  }

  const fromIndex = dragIndex.value
  const updatedList = [...props.clients]
  const [movedItem] = updatedList.splice(fromIndex, 1)
  updatedList.splice(targetIndex, 0, movedItem)

  updatedList.forEach((item, idx) => {
    item.order = idx + 1
  })

  onDragEnd()
  emit('reorder', updatedList)
}

function onDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
  isDragging.value = false
}
</script>

<template>
  <div
    id="client-grid"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-4 select-none"
  >
    <div
      v-for="(client, index) in clients"
      :key="client.id"
      draggable="true"
      :data-id="client.id"
      :data-order="index + 1"
      @dragstart="onDragStart(index, $event)"
      @dragover="onDragOver(index, $event)"
      @dragleave="onDragLeave(index)"
      @drop="onDrop(index)"
      @dragend="onDragEnd"
      :class="[
        'group relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 min-h-[130px]',
        'border cursor-grab active:cursor-grabbing',
        dragIndex === index
          ? 'opacity-40 scale-95 border-dashed border-2 border-primary bg-primary/5 shadow-inner'
          : dragOverIndex === index
            ? 'scale-105 border-2 border-primary bg-white shadow-2xl ring-4 ring-primary/20 dark:bg-gray-800 z-10'
            : 'bg-white border-transparent hover:border-gray-200 hover:shadow-xl hover:-translate-y-0.5 dark:bg-gray-850 dark:border-transparent dark:hover:border-gray-700'
      ]"
    >
      <!-- Floating Drag Handle & Quick Actions on Hover -->
      <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          type="button"
          title="Edit Client"
          class="size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-primary hover:text-white text-gray-500 transition dark:bg-gray-800 dark:text-gray-400"
          @click.stop="emit('edit', client)"
        >
          <FeatherIcon name="edit-2" size="11" />
        </button>
        <button
          type="button"
          title="Delete Client"
          class="size-6 flex items-center justify-center rounded bg-gray-100 hover:bg-rose-600 hover:text-white text-rose-500 transition dark:bg-gray-800"
          @click.stop="emit('delete', client)"
        >
          <FeatherIcon name="trash" size="11" />
        </button>
      </div>

      <!-- Position Badge on Hover -->
      <div class="absolute top-2 left-2 text-[10px] font-mono text-gray-400 group-hover:text-primary transition">
        #{{ index + 1 }}
      </div>

      <!-- Vector SVG Logo or Image Fallback -->
      <div class="w-full flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors px-2 py-3">
        <svg
          v-if="client.svgPath"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="65"
          fill="currentColor"
          :viewBox="client.viewBox || '0 0 284 65'"
          class="max-h-[65px] w-full object-contain pointer-events-none"
        >
          <path
            :d="client.svgPath"
            :fill-rule="client.fillRule || 'nonzero'"
          />
        </svg>

        <img
          v-else-if="client.logoUrl"
          :src="client.logoUrl"
          :alt="client.name"
          class="max-h-14 max-w-full object-contain pointer-events-none"
        />

        <span v-else class="text-sm font-bold tracking-wide">
          {{ client.name }}
        </span>
      </div>

      <!-- Tooltip/Company Name Label on Hover -->
      <span class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center truncate max-w-full">
        {{ client.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
#client-grid [draggable="true"] {
  cursor: grab;
}
#client-grid [draggable="true"]:active {
  cursor: grabbing;
}
</style>

