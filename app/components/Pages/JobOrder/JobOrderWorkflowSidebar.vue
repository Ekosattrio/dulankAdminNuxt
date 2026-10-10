<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  activeType: string
}>()

const emit = defineEmits<{
  'select-type': [type: string, label: string]
}>()

const showMore = ref(false)

const groups = [
  {
    label: 'Design',
    items: [
      { id: 'design', label: 'Design', icon: 'pen-tool', count: 5 },
      { id: 'editing', label: 'Editing', icon: 'edit-3', count: 5 },
    ],
  },
  {
    label: 'Pracetak',
    items: [
      { id: 'klise', label: 'Plate Klise', icon: 'grid', count: 5 },
      { id: 'ctp', label: 'Plate CTP', icon: 'layers', count: 5 },
    ],
  },
  {
    label: 'Cetak',
    items: [
      { id: 'sm52', label: 'Mesin Sm52', icon: 'printer', count: 5 },
      { id: 'multilith', label: 'Mesin Multilith', icon: 'copy', count: 5 },
    ],
  },
  {
    label: 'Finishing',
    items: [
      { id: 'nota', label: 'Finishing Nota', icon: 'file-text', count: 5 },
      { id: 'potong', label: 'Potong', icon: 'scissors', count: 5 },
    ],
  },
]
</script>

<template>
  <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
      <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">All Work Flow</h5>
      <span class="rounded-full bg-[#ff9f43]/10 px-2.5 py-0.5 text-xs font-bold text-[#ff9f43]">
        40
      </span>
    </div>

    <div class="space-y-4">
      <div v-for="group in groups" :key="group.label" class="space-y-1.5">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {{ group.label }}
        </p>

        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.id">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold transition"
              :class="
                activeType === item.id
                  ? 'bg-[#ff9f43] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60'
              "
              @click="$emit('select-type', item.id, item.label)"
            >
              <span class="flex items-center gap-2">
                <FeatherIcon :name="item.icon" :size="14" />
                <span>{{ item.label }}</span>
              </span>
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-bold"
                :class="activeType === item.id ? 'bg-white/20 text-white' : 'text-gray-400'"
              >
                {{ item.count }}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
