<script setup lang="ts">
interface CategoryItem {
  id: string
  name: string
  code: string
  createdDate: string
  status: 'Active' | 'Deactive'
}

const categories = ref<CategoryItem[]>([
  { id: '1', name: 'Large Format', code: 'CAT-LF', createdDate: '25/12/2024', status: 'Active' },
  { id: '2', name: 'Digital Print', code: 'CAT-DP', createdDate: '26/12/2024', status: 'Active' },
  { id: '3', name: 'Offset Print', code: 'CAT-OP', createdDate: '27/12/2024', status: 'Active' },
  { id: '4', name: 'Finishing & Merchandise', code: 'CAT-FM', createdDate: '28/12/2024', status: 'Active' },
  { id: '5', name: 'Merchandise', code: 'CAT-MC', createdDate: '02/01/2025', status: 'Active' },
  { id: '6', name: 'Display Promo', code: 'CAT-DSP', createdDate: '05/01/2025', status: 'Active' },
  { id: '7', name: 'Sablon & Tekstil', code: 'CAT-SB', createdDate: '10/01/2025', status: 'Active' }
])

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
}
</script>

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
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Category</span>
        </button>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="relative w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search category..."
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
            <FeatherIcon name="search" size="16" />
          </span>
        </div>

        <div class="flex items-center gap-3">
          <select
            v-model="selectedStatus"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Status: All</option>
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>
      </div>

      <TableDataTable :columns="columns" :rows="filteredCategories">
        <template #cell(name)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
        </template>

        <template #cell(code)="{ row }">
          <span class="font-mono text-xs text-primary">{{ row.code }}</span>
        </template>

        <template #cell(createdDate)="{ row }">
          <span class="text-xs text-gray-500">{{ row.createdDate }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
              @click="openEditModal(row)"
            >
              <FeatherIcon name="edit" size="16" />
            </button>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deleteCategory(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal Add Category -->
    <ModalBaseModal v-model="isAddModalOpen" title="Add New Category" size="md">
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

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isAddModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </ModalBaseModal>

    <!-- Modal Edit Category -->
    <ModalBaseModal v-model="isEditModalOpen" title="Edit Category" size="md">
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

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isEditModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalBaseModal>
  </div>
</template>

