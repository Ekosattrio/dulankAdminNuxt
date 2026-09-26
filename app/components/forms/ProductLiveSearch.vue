<script setup lang="ts">
export interface ProductItem {
  name: string
  code: string
  category: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Search product by name or code...'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', product: ProductItem): void
}>()

const query = ref(props.modelValue)
const products = ref<ProductItem[]>([])
const isOpen = ref(false)
const isLoaded = ref(false)

const loadProducts = async () => {
  if (isLoaded.value) return
  try {
    const res = await fetch('/assets/json/product.json')
    const data = await res.json()
    products.value = data.product || []
    isLoaded.value = true
  } catch (err) {
    console.error('Failed to load products:', err)
  }
}

const filteredList = computed(() => {
  if (!query.value || query.value.length < 2) return products.value.slice(0, 5)
  const q = query.value.toLowerCase()
  return products.value.filter(p => {
    return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  }).slice(0, 8)
})

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  query.value = val
  emit('update:modelValue', val)
  isOpen.value = true
}

const selectProduct = (p: ProductItem) => {
  query.value = p.name
  emit('update:modelValue', p.name)
  emit('select', p)
  isOpen.value = false
}

const onFocus = () => {
  loadProducts()
  isOpen.value = true
}

// Close on outside click
const root = ref<HTMLElement | null>(null)
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (root.value && !root.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  })
})
</script>

<template>
  <div ref="root" class="relative w-full">
    <div class="relative">
      <input
        type="text"
        :value="query"
        :placeholder="placeholder"
        class="w-full h-9 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-xs text-gray-800 transition-colors focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        @input="handleInput"
        @focus="onFocus"
      />
      <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
        <FeatherIcon name="search" size="14" />
      </span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen && filteredList.length > 0"
      class="absolute start-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800"
    >
      <button
        v-for="(prod, idx) in filteredList"
        :key="idx"
        type="button"
        class="w-full text-start px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
        @click="selectProduct(prod)"
      >
        <div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ prod.name }}</span>
          <span class="block text-[11px] text-gray-400">{{ prod.code }}</span>
        </div>
        <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {{ prod.category }}
        </span>
      </button>
    </div>
  </div>
</template>

