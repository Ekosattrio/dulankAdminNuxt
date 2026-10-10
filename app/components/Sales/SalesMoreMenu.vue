<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { actionIconSizes, resolveActionIcon, type AppActionIcon } from '~/utils/actionIcons'

type MoreMenuAction = {
  label: string
  key: string
  icon?: string
  action?: AppActionIcon
  to?: RouteLocationRaw
}

defineProps<{
  label: string
  actions: MoreMenuAction[]
}>()
const emit = defineEmits<{ select: [key: string] }>()
const menu = ref<HTMLElement | null>(null)
const position = ref({ top: '0px', left: '0px' })
function open(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  position.value = {
    left: `${Math.max(8, Math.min(rect.left, window.innerWidth - 232))}px`,
    top: `${Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - 350))}px`,
  }
  menu.value?.showPopover()
  nextTick(() => menu.value?.querySelector<HTMLElement>('button,a')?.focus())
}
function select(key: string) {
  menu.value?.hidePopover()
  emit('select', key)
}
</script>
<template>
  <SalesActionButton action="more" :label="label" @click="open" />
  <div
    ref="menu"
    popover="auto"
    :style="position"
    class="fixed m-0 w-56 rounded-lg border border-gray-200 bg-white p-1.5 text-sm text-gray-700 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
  >
    <template v-for="action in actions" :key="action.key">
      <NuxtLink
        v-if="action.to"
        :to="action.to"
        class="flex w-full items-center gap-3 rounded px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        @click="menu?.hidePopover()"
        ><FeatherIcon
          :name="resolveActionIcon(action.action, action.icon)"
          :size="actionIconSizes.row"
        />{{ action.label }}</NuxtLink
      >
      <button
        v-else
        type="button"
        class="flex w-full items-center gap-3 rounded px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
        @click="select(action.key)"
      >
        <FeatherIcon
          :name="resolveActionIcon(action.action, action.icon)"
          :size="actionIconSizes.row"
        />{{ action.label }}
      </button>
    </template>
  </div>
</template>
