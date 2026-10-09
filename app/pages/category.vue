<<<<<<< HEAD
<script setup lang="ts">const { data: categoryData } = await useFetch<CategoryItem[]>('/api/category')
const categories = ref<CategoryItem[]>(categoryData.value ?? [])
useMockSync('category', categories)

const searchQuery = ref('')
const selectedStatus = ref('')

const filteredCategories = computed(() => {
  return categories.value.filter((c) => {
    const matchSearch =
      !searchQuery.value ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || c.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

const columns = [
  { key: 'name', label: 'Product Category' },
  { key: 'code', label: 'Category Code' },
  { key: 'createdDate', label: 'Created' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action', class: 'text-end no-sort' }
]

// Modal Add
const isAddModalOpen = ref(false)
const newName = ref('')
const newCode = ref('')

const addCategory = () => {
  if (!newName.value.trim()) return
  categories.value.push({
    id: String(Date.now()),
    name: newName.value.trim(),
    code: newCode.value.trim() || `CAT-0${categories.value.length + 1}`,
    createdDate: new Date().toLocaleDateString('id-ID'),
    status: 'Active'
  })
  newName.value = ''
  newCode.value = ''
  isAddModalOpen.value = false
}

// Modal Edit
const isEditModalOpen = ref(false)
const editingCategory = ref<CategoryItem | null>(null)
const editName = ref('')
const editStatus = ref<'Active' | 'Deactive'>('Active')

const openEditModal = (c: CategoryItem) => {
  editingCategory.value = c
  editName.value = c.name
  editStatus.value = c.status
  isEditModalOpen.value = true
}

const saveEdit = () => {
  if (!editingCategory.value || !editName.value.trim()) return
  editingCategory.value.name = editName.value.trim()
  editingCategory.value.status = editStatus.value
  isEditModalOpen.value = false
}

const deleteCategory = (id: string) => {
  if (confirm('Are you sure you want to delete this category?')) {
    categories.value = categories.value.filter((c) => c.id !== id)
  }
}</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Category" subtitle="Manage your categories">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          @click="isAddModalOpen = true"
        >
          <CommonFeatherIcon name="plus-circle" size="18" />
          <span>Add New Category</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search category..." />

        <CommonFilterSelect v-model="selectedStatus" :options="[{ value: 'Active', label: 'Active' }, { value: 'Deactive', label: 'Deactive' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredCategories">
        <template #cell(name)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(code)="{ item }">
          <span class="font-mono text-xs text-primary">{{ item.code }}</span>
        </template>

        <template #cell(createdDate)="{ item }">
          <span class="text-xs text-gray-500">{{ item.createdDate }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

        <template #cell(action)="{ item }">
          <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteCategory(item.id)" />
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Add Category -->
    <CommonBaseModal v-model="isAddModalOpen" title="Add New Category" maxWidth="md">
      <form @submit.prevent="addCategory" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Category Name</label>
          <input
            v-model="newName"
            type="text"
            required
            placeholder="e.g. Offset Printing"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Category Code</label>
          <input
            v-model="newCode"
            type="text"
            placeholder="e.g. CAT-OP"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <CommonModalFooter submitLabel="Submit" @cancel="isAddModalOpen = false" />
      </form>
    </CommonBaseModal>

    <!-- Modal Edit Category -->
    <CommonBaseModal v-model="isEditModalOpen" title="Edit Category" maxWidth="md">
      <form @submit.prevent="saveEdit" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Category Name</label>
          <input
            v-model="editName"
            type="text"
            required
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="editStatus"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>

        <CommonModalFooter submitLabel="Save Changes" @cancel="isEditModalOpen = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

=======
<script setup lang="ts">
import CategoryWorkspace from '~/components/category/CategoryWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Category',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-category">
    <CategoryWorkspace />
  </div>
</template>
>>>>>>> origin/eko
