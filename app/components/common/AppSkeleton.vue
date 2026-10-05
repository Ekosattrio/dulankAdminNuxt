<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    circle?: boolean
    animated?: boolean
  }>(),
  {
    width: '',
    height: 'h-4',
    rounded: 'md',
    circle: false,
    animated: true,
  },
)

const roundedClass = computed(() => {
  if (props.circle) return 'rounded-full'
  switch (props.rounded) {
    case 'none':
      return 'rounded-none'
    case 'sm':
      return 'rounded-sm'
    case 'lg':
      return 'rounded-lg'
    case 'xl':
      return 'rounded-xl'
    case 'full':
      return 'rounded-full'
    case 'md':
    default:
      return 'rounded-md'
  }
})

const styleObject = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width && !props.width.startsWith('w-')) {
    styles.width = props.width
  }
  if (props.height && !props.height.startsWith('h-')) {
    styles.height = props.height
  }
  if (props.circle && props.width && !props.height) {
    styles.height = props.width
  }
  return styles
})
</script>

<template>
  <div
    role="status"
    aria-label="Loading..."
    :class="[
      'bg-gray-200/80 dark:bg-gray-700/60 transition-colors',
      animated ? 'animate-pulse' : '',
      roundedClass,
      width.startsWith('w-') ? width : '',
      height.startsWith('h-') ? height : '',
    ]"
    :style="styleObject"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
