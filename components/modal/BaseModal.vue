<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }>(),
  {
    title: '',
    maxWidth: 'lg'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'lg': return 'max-w-lg'
    case 'xl': return 'max-w-xl'
    case '2xl': return 'max-w-2xl'
    default: return 'max-w-lg'
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      @click.self="close"
    >
      <div
        :class="[
          'relative w-full rounded-xl bg-white shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transform transition-all',
          maxWidthClass
        ]"
      >
        <!-- Modal Header -->
        <div v-if="title || $slots.header" class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <slot name="header">
            <h5 class="text-base font-bold text-gray-900 dark:text-white">{{ title }}</h5>
          </slot>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            @click="close"
          >
            <FeatherIcon name="x" size="18" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4">
          <slot />
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-3 rounded-b-xl dark:border-gray-800 dark:bg-gray-800/40">
          <slot name="footer" :close="close" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

