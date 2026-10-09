<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Internal Paper Groups" subtitle="Manage your workshop's own paper group classifications and price types">
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
            <span>Add New Paper Group</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <CommonStatCard label="Paper Groups" :value="String(groups.length)" icon="file-text" tone="primary" />
      <CommonStatCard label="Total Active" :value="String(activeCount)" icon="check-circle" tone="success" />
      <CommonStatCard label="Total Inactive" :value="String(inactiveCount)" icon="x-circle" tone="slate" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search paper group or merk..." />
        <CommonFilterSelect
          v-model="filterStatus"
          allLabel="All Status"
          :options="[
            { value: 'Active', label: 'Active' },
            { value: 'Deactive', label: 'Deactive' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Paper's Group</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Merk</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Price Type</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="g in filteredGroups" :key="g.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ g.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ g.merk }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="g.priceType" :tone="g.priceType === 'Yes' ? 'sky' : 'slate'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ g.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="g.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="g" @edit="openEditModal(g)" @delete="deleteGroup(g.id)" />
              </td>
            </tr>
            <tr v-if="filteredGroups.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No paper groups found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Paper Group' : 'Add New Paper Group'" maxWidth="md">
      <form @submit.prevent="saveGroup" class="space-y-4">
        <CommonFormField label="Paper Group Name" required>
          <input
            v-model="form.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="e.g. Art Paper, HVS Putih"
          />
        </CommonFormField>
        <CommonFormField label="Default Merk / Manufacturer">
          <input
            v-model="form.merk"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Paperone, Sinar Mas, Pindo Deli"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Price Type">
            <select
              v-model="form.priceType"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Yes">Yes (By Weight/Kg)</option>
              <option value="No">No (By Sheet Plano)</option>
            </select>
          </CommonFormField>
          <CommonToggleSwitch v-model="formActive" label="Status Active" />
        </div>
        <CommonModalFooter :submit-label="isEdit ? 'Update' : 'Submit'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasGroupSelfData } = await useFetch<SelfPaperGroup[]>('/api/kertas-group-self')
const groups = ref<SelfPaperGroup[]>(kertasGroupSelfData.value ?? [])
useMockSync('kertas-group-self', groups)

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const activeCount = computed(() => groups.value.filter(g => g.status === 'Active').length)
const inactiveCount = computed(() => groups.value.filter(g => g.status === 'Deactive').length)

const filteredGroups = computed(() => {
  return groups.value.filter(g => {
    const matchStatus = !filterStatus.value || g.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      g.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.merk.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})

const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

const form = ref({
  name: '',
  merk: '',
  priceType: 'Yes' as 'Yes' | 'No',
  status: 'Active' as 'Active' | 'Deactive'
})

const formActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Deactive'
  }
})

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    merk: '',
    priceType: 'Yes',
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(g: SelfPaperGroup) {
  isEdit.value = true
  currentId.value = g.id
  form.value = {
    name: g.name,
    merk: g.merk,
    priceType: g.priceType,
    status: g.status
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveGroup() {
  if (isEdit.value && currentId.value !== null) {
    const idx = groups.value.findIndex(g => g.id === currentId.value)
    if (idx !== -1) {
      groups.value[idx] = {
        ...groups.value[idx],
        name: form.value.name,
        merk: form.value.merk,
        priceType: form.value.priceType,
        status: form.value.status,
        update: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      }
    }
  } else {
    const newId = groups.value.length ? Math.max(...groups.value.map(g => g.id)) + 1 : 1
    groups.value.unshift({
      id: newId,
      name: form.value.name,
      merk: form.value.merk,
      priceType: form.value.priceType,
      status: form.value.status,
      update: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    })
  }
  closeModal()
}

function deleteGroup(id: number) {
  if (confirm('Are you sure you want to delete this paper group?')) {
    groups.value = groups.value.filter(g => g.id !== id)
  }
}

function exportPdf() {
  alert('Exporting paper groups as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>
=======
<script setup lang="ts">
import type { PaperGroup, PaperGroupFormData } from '#server/types/paper-shop'
import PaperGroupStatsWidgets from '~/components/pages/paper-shop/PaperGroupStatsWidgets.vue'
import PaperGroupRecordsTable from '~/components/pages/paper-shop/PaperGroupRecordsTable.vue'
import PaperGroupFormModal from '~/components/pages/paper-shop/PaperGroupFormModal.vue'
import PaperGroupViewModal from '~/components/pages/paper-shop/PaperGroupViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Internal Paper Groups - Master Grup Kertas',
  sweetAlert: false
})

const { groups, stats, pending, error, refresh, saveGroup, deleteGroup } = usePaperGroupsSelf()

const isFormModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedGroup = ref<PaperGroup | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedGroup.value = null
  isFormModalOpen.value = true
}

function handleView(item: PaperGroup) {
  selectedGroup.value = item
  isViewModalOpen.value = true
}

function handleEdit(item: PaperGroup) {
  selectedGroup.value = item
  isFormModalOpen.value = true
}

function handleDelete(id: string) {
  deleteTargetId.value = id
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteGroup(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper group:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperGroupFormData) {
  isSaving.value = true
  try {
    await saveGroup(payload)
    isFormModalOpen.value = false
    selectedGroup.value = null
  } catch (err) {
    console.error('Failed to save paper group:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-group-self space-y-6">
    <SalesListHeader
      title="Internal Paper Groups"
      subtitle="Master data grup dan merk kertas untuk kalkulator & produksi"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Stats Widgets -->
    <PaperGroupStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !groups.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data paper group'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PaperGroupRecordsTable
      v-else
      :groups="groups"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperGroupFormModal
      :open="isFormModalOpen"
      :group="selectedGroup"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- View Detail Modal -->
    <PaperGroupViewModal
      :open="isViewModalOpen"
      :group="selectedGroup"
      @close="isViewModalOpen = false"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Paper Group"
      message="Apakah Anda yakin ingin menghapus data paper group ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
>>>>>>> origin/eko
