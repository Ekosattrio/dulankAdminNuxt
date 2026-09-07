<script setup lang="ts">
export interface Customer {
  name: string
  phone: string
  email: string
  address: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Search customer name or phone...'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', customer: Customer): void
}>()

const query = ref(props.modelValue)
const customers = ref<Customer[]>([])
const isOpen = ref(false)
const isLoaded = ref(false)

const loadCustomers = async () => {
  if (isLoaded.value) return
  try {
    const res = await fetch('/assets/json/customer.json')
    const data = await res.json()
    customers.value = data.customer || []
    isLoaded.value = true
  } catch (err) {
    console.error('Failed to load customers:', err)
  }
}

const filteredList = computed(() => {
  if (!query.value || query.value.length < 2) return customers.value.slice(0, 5)
  const q = query.value.toLowerCase()
  return customers.value.filter(c => {
    return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
  }).slice(0, 8)
})

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  query.value = val
  emit('update:modelValue', val)
  isOpen.value = true
}

const selectCustomer = (c: Customer) => {
  query.value = c.name
  emit('update:modelValue', c.name)
  emit('select', c)
  isOpen.value = false
}

const onFocus = () => {
  loadCustomers()
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

    <!-- Autocomplete Dropdown List -->
    <div
      v-if="isOpen && filteredList.length > 0"
      class="absolute start-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800"
    >
      <button
        v-for="(cust, idx) in filteredList"
        :key="idx"
        type="button"
        class="w-full text-start px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col gap-0.5"
        @click="selectCustomer(cust)"
      >
        <span class="font-semibold text-gray-900 dark:text-white">{{ cust.name }}</span>
        <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ cust.phone }} • {{ cust.address }}</span>
      </button>
    </div>
  </div>
</template>

