<script setup lang="ts" generic="T extends Record<string, any>">
const props = withDefaults(
  defineProps<{
    columns: Array<{
      key: string
      label: string
      sortable?: boolean
      class?: string
      align?: 'start' | 'center' | 'end'
    }>
    items: T[]
    searchable?: boolean
    searchPlaceholder?: string
    defaultPageSize?: number
  }>(),
  {
    searchable: true,
    searchPlaceholder: 'Search...',
    defaultPageSize: 10
  }
)

const emit = defineEmits<{
  (e: 'print'): void
  (e: 'export-pdf'): void
  (e: 'export-excel'): void
}>()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(props.defaultPageSize)
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const handleSort = (key: string, sortable?: boolean) => {
  if (!sortable) return
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const filteredItems = computed(() => {
  let result = [...props.items]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(item => {
      return Object.values(item).some(val => {
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(q)
      })
    })
  }

  if (sortKey.value) {
    result.sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]
      if (valA === valB) return 0
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1

      const comparison = valA > valB ? 1 : -1
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / pageSize.value) || 1)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

const startIndex = computed(() => {
  if (filteredItems.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredItems.value.length)
})

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <!-- Table Controls Bar -->
    <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800">
      <!-- Search Input -->
      <div v-if="searchable" class="relative max-w-xs flex-1">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 ps-9 pe-3 text-xs transition-colors focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
        <span class="absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
          <FeatherIcon name="search" size="14" />
        </span>
      </div>

      <!-- Action Tools (PDF, Excel, Print, Per Page) -->
      <div class="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          title="Print Table"
          @click="emit('print')"
        >
          <FeatherIcon name="printer" size="14" />
        </button>

        <!-- Page Size Selector -->
        <select
          v-model="pageSize"
          class="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option :value="10">10 / page</option>
          <option :value="25">25 / page</option>
          <option :value="50">50 / page</option>
          <option :value="100">100 / page</option>
        </select>
      </div>
    </div>

    <!-- Table Body -->
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-4 py-3 whitespace-nowrap select-none',
                col.sortable ? 'cursor-pointer hover:text-gray-800 dark:hover:text-white' : '',
                col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start',
                col.class || ''
              ]"
              @click="handleSort(col.key, col.sortable)"
            >
              <div class="inline-flex items-center gap-1.5">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable" class="text-gray-400">
                  <FeatherIcon
                    v-if="sortKey === col.key"
                    :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                    size="12"
                  />
                  <FeatherIcon v-else name="chevrons-up" size="12" class="opacity-40" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-if="paginatedItems.length === 0">
            <td :colspan="columns.length" class="p-8 text-center text-gray-400">
              No matching records found
            </td>
          </tr>
          <tr
            v-for="(item, idx) in paginatedItems"
            :key="idx"
            class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-4 py-3 whitespace-nowrap',
                col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start',
                col.class || ''
              ]"
            >
              <slot :name="`cell(${col.key})`" :item="item" :index="(currentPage - 1) * pageSize + idx">
                {{ item[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="$slots.footer" class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
          <slot name="footer" :items="filteredItems" :paginated="paginatedItems" />
        </tfoot>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <div>
        Showing <span class="font-semibold text-gray-800 dark:text-white">{{ startIndex }}</span> to
        <span class="font-semibold text-gray-800 dark:text-white">{{ endIndex }}</span> of
        <span class="font-semibold text-gray-800 dark:text-white">{{ filteredItems.length }}</span> entries
      </div>

      <div class="flex items-center gap-1 self-end sm:self-auto">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          @click="currentPage--"
        >
          <FeatherIcon name="chevron-left" size="14" />
        </button>

        <span class="px-2 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>

        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          @click="currentPage++"
        >
          <FeatherIcon name="chevron-right" size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
