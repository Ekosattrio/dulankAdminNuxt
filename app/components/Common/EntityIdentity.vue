<script setup lang="ts">
type IdentityKind = 'person' | 'store' | 'supplier' | 'business'

const props = withDefaults(defineProps<{
  name: string
  subtitle?: string
  image?: string
  kind?: IdentityKind
  size?: 'sm' | 'md'
}>(), {
  subtitle: '',
  image: '',
  kind: 'business',
  size: 'sm',
})

const imageFailed = ref(false)
const assets: Record<IdentityKind, string[]> = {
  person: Array.from({ length: 10 }, (_, index) => `/assets/img/users/user-${String(index + 1).padStart(2, '0')}.jpg`),
  store: Array.from({ length: 4 }, (_, index) => `/assets/img/store/store-${String(index + 1).padStart(2, '0')}.png`),
  supplier: Array.from({ length: 10 }, (_, index) => `/assets/img/supplier/supplier-${String(index + 1).padStart(2, '0')}.png`),
  business: Array.from({ length: 10 }, (_, index) => `/assets/img/supplier/supplier-${String(index + 1).padStart(2, '0')}.png`),
}

const hash = computed(() => Array.from(props.name).reduce((total, char) => total + char.charCodeAt(0), 0))
const resolvedImage = computed(() => props.image || assets[props.kind][hash.value % assets[props.kind].length])
const initials = computed(() => props.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase())

watch(() => [props.image, props.name, props.kind], () => { imageFailed.value = false })
</script>

<template>
  <div class="flex min-w-0 items-center gap-2.5">
    <img
      v-if="!imageFailed"
      :src="resolvedImage"
      :alt="name"
      :class="size === 'md' ? 'size-9' : 'size-7'"
      class="shrink-0 rounded-full border border-gray-200 bg-gray-50 object-cover dark:border-gray-700 dark:bg-gray-800"
      @error="imageFailed = true"
    />
    <span
      v-else
      :class="size === 'md' ? 'size-9' : 'size-7'"
      class="inline-flex shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary"
    >{{ initials }}</span>
    <span class="min-w-0">
      <span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{{ name }}</span>
      <span v-if="subtitle" class="block truncate text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</span>
    </span>
  </div>
</template>
