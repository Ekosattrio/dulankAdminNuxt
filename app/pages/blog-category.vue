<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Blog Categories" subtitle="Manage your blog categories">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Categories</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search category..." />
        <select
          v-model="sortBy"
          class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="recent">Sort By: Recently Added</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="w-10 px-4 py-3 text-center whitespace-nowrap">
                <input type="checkbox" class="h-3.5 w-3.5 accent-primary" :checked="selectAll" @change="toggleSelectAll" />
              </th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="w-24 px-4 py-3 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="cat in filteredCategories" :key="cat.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <input type="checkbox" :value="cat.id" v-model="selectedIds" class="h-3.5 w-3.5 accent-primary" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ cat.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ cat.createdDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="cat.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="cat" @edit="openEditModal(cat)" @delete="deleteCategory(cat.id)" />
              </td>
            </tr>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-400">No categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Blog Category' : 'Add Blog Category'" maxWidth="md">
      <form @submit.prevent="saveCategory" class="space-y-4">
        <CommonFormField label="Category Name" required>
          <input
            v-model="form.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Digital Printing"
          />
        </CommonFormField>
        <CommonFormField label="Status">
          <CommonToggleSwitch v-model="statusActive" label="Status" />
        </CommonFormField>
        <CommonModalFooter :submit-label="isEdit ? 'Update' : 'Submit'" @cancel="modalVisible = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: blogCategoryData } = await useFetch<BlogCategory[]>('/api/blog-category')
const categories = ref<BlogCategory[]>(blogCategoryData.value ?? [])
useMockSync('blog-category', categories)

const searchQuery = ref('')
const sortBy = ref<'recent' | 'asc' | 'desc'>('recent')
const sortDropdownOpen = ref(false)
const selectedIds = ref<number[]>([])

const sortByLabel = computed(() => {
  if (sortBy.value === 'asc') return 'Ascending'
  if (sortBy.value === 'desc') return 'Descending'
  return 'Recently Added'
})

const filteredCategories = computed(() => {
  return categories.value
    .filter(c => !searchQuery.value || c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .sort((a, b) => {
      if (sortBy.value === 'asc') return a.name.localeCompare(b.name)
      if (sortBy.value === 'desc') return b.name.localeCompare(a.name)
      return b.id - a.id
    })
})

const selectAll = computed(() => {
  return filteredCategories.value.length > 0 && selectedIds.value.length === filteredCategories.value.length
})

function toggleSelectAll(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    selectedIds.value = filteredCategories.value.map(c => c.id)
  } else {
    selectedIds.value = []
  }
}

// Modal state
const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)
const form = ref({
  name: '',
  status: 'Active' as 'Active' | 'Inactive'
})

const statusActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Inactive'
  }
})

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(cat: BlogCategory) {
  isEdit.value = true
  currentId.value = cat.id
  form.value = {
    name: cat.name,
    status: cat.status
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveCategory() {
  if (isEdit.value && currentId.value !== null) {
    const idx = categories.value.findIndex(c => c.id === currentId.value)
    if (idx !== -1) {
      categories.value[idx].name = form.value.name
      categories.value[idx].status = form.value.status
    }
  } else {
    const newId = categories.value.length ? Math.max(...categories.value.map(c => c.id)) + 1 : 1
    categories.value.unshift({
      id: newId,
      name: form.value.name,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: form.value.status
    })
  }
  closeModal()
}

function deleteCategory(id: number) {
  if (confirm('Are you sure you want to delete this category?')) {
    categories.value = categories.value.filter(c => c.id !== id)
    selectedIds.value = selectedIds.value.filter(item => item !== id)
  }
}

function exportPdf() {
  alert('Exporting categories as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  sortBy.value = 'recent'
  selectedIds.value = []
}
</script>
=======
<script setup lang="ts">
import BlogCategoryWorkspace from '~/components/blog/BlogCategoryWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Blog Categories',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blog-category p-4 md:p-6">
    <BlogCategoryWorkspace />
  </div>
</template>
>>>>>>> origin/eko
