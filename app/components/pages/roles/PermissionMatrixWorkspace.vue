<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePermissions } from '~/composables/usePermissions'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import PermissionMatrixTable from '~/components/pages/roles/PermissionMatrixTable.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const {
  matrix,
  groups,
  roles,
  pending,
  error,
  refresh,
  toggleAllowAll,
  toggleField,
  toggleGroupAll,
  isGroupAllAllowed,
  savePermissions,
} = usePermissions()

const isBusy = ref(false)
const toastMessage = ref('')
const searchQuery = ref('')
const activeRoleTab = ref('')
const expandedGroups = ref<Set<string>>(new Set())
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// Initialize active role tab
watch(
  roles,
  (val) => {
    if (val.length && !activeRoleTab.value) {
      activeRoleTab.value = val[0]
    }
  },
  { immediate: true }
)

// Initialize expanded groups when groups load
watch(
  groups,
  (val) => {
    if (val.length && expandedGroups.value.size === 0) {
      val.forEach((g) => expandedGroups.value.add(g.group))
    }
  },
  { immediate: true }
)

function toggleGroup(groupName: string) {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
}

function expandAll() {
  groups.value.forEach((g) => expandedGroups.value.add(g.group))
}

function collapseAll() {
  expandedGroups.value.clear()
}

const allExpanded = computed(() => {
  return groups.value.length > 0 && groups.value.every((g) => expandedGroups.value.has(g.group))
})

function toggleAllExpanded() {
  if (allExpanded.value) {
    collapseAll()
  } else {
    expandAll()
  }
}

// Filtered groups & pages based on search query
const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return groups.value

  return groups.value
    .map((g) => {
      const groupMatches = g.group.toLowerCase().includes(q)
      const matchingPages = g.pages.filter((p) => p.toLowerCase().includes(q))
      if (groupMatches) {
        return { ...g }
      }
      if (matchingPages.length > 0) {
        return { ...g, pages: matchingPages }
      }
      return null
    })
    .filter((g): g is { group: string; pages: string[] } => g !== null)
})

watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    filteredGroups.value.forEach((g) => expandedGroups.value.add(g.group))
  }
})

const totalFilteredPages = computed(() => {
  return filteredGroups.value.reduce((acc, g) => acc + g.pages.length, 0)
})

const printColumns = [
  { key: 'group', label: 'Menu Group' },
  { key: 'page', label: 'Page' },
  { key: 'create', label: 'Create', align: 'center' as const },
  { key: 'edit', label: 'Edit', align: 'center' as const },
  { key: 'delete', label: 'Delete', align: 'center' as const },
  { key: 'view', label: 'View', align: 'center' as const },
  { key: 'allowAll', label: 'Allow All', align: 'center' as const },
]

const printablePermissions = computed(() => filteredGroups.value.flatMap((group) =>
  group.pages.map((page) => {
    const permission = matrix.value[page]?.[activeRoleTab.value]
    return {
      group: group.group,
      page,
      create: permission?.create ? 'Yes' : 'No',
      edit: permission?.edit ? 'Yes' : 'No',
      delete: permission?.delete ? 'Yes' : 'No',
      view: permission?.view ? 'Yes' : 'No',
      allowAll: permission?.allowAll ? 'Yes' : 'No',
    }
  }),
))

async function saveAllPermissions() {
  isBusy.value = true
  try {
    await savePermissions(matrix.value)
    showToast('Permissions configuration updated successfully')
  } catch (err: any) {
    showToast(err?.message || 'Failed to save permissions')
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <SalesListHeader
      title="Permission Matrix"
      subtitle="Manage granular permissions per menu and page across all system roles"
      :refreshing="pending"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <NuxtLink
          to="/role-permissions"
          class="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <FeatherIcon name="arrow-left" size="14" />
          <span>Back to Roles</span>
        </NuxtLink>
        <button
          type="button"
          :disabled="isBusy"
          class="inline-flex items-center gap-1.5 rounded-md bg-[#FE9F43] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933] disabled:opacity-50"
          @click="saveAllPermissions"
        >
          <FeatherIcon v-if="!isBusy" name="check" size="14" />
          <span>{{ isBusy ? 'Saving...' : 'Save Permissions' }}</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton Loader & Error -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="8"
      :error="error ? (error.message || 'Failed to load permissions. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Main Content -->
    <template v-if="!pending && !error">
      <!-- Role Filter Tabs (pill buttons) -->
      <div class="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 me-2">Selected Role:</span>
        <button
          v-for="r in roles"
          :key="r"
          type="button"
          :class="[
            'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors border',
            activeRoleTab === r
              ? 'border-[#FE9F43] bg-[#FE9F43] text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          ]"
          @click="activeRoleTab = r"
        >
          {{ r }}
        </button>
      </div>

      <!-- Search & Controls Toolbar -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search input -->
        <div class="relative w-full sm:w-80">
          <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
            <FeatherIcon name="search" size="14" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search menu group or page..."
            class="block w-full rounded-lg border border-gray-200 bg-white py-2 ps-9 pe-8 text-xs text-gray-900 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-1 focus:ring-[#FE9F43] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="searchQuery = ''"
          >
            <FeatherIcon name="x" size="14" />
          </button>
        </div>

        <!-- Expand / Collapse All & Stats -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ filteredGroups.length }} Groups ({{ totalFilteredPages }} Pages)
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @click="toggleAllExpanded"
          >
            <FeatherIcon :name="allExpanded ? 'chevron-up' : 'chevron-down'" size="13" />
            <span>{{ allExpanded ? 'Collapse All' : 'Expand All' }}</span>
          </button>
        </div>
      </div>

      <!-- Permission Table Component -->
      <PermissionMatrixTable
        v-if="activeRoleTab"
        :filtered-groups="filteredGroups"
        :active-role-tab="activeRoleTab"
        :expanded-groups="expandedGroups"
        :matrix="matrix"
        :is-group-all-allowed="isGroupAllAllowed"
        :search-query="searchQuery"
        :is-busy="isBusy"
        @toggle-group="toggleGroup"
        @toggle-group-all="toggleGroupAll"
        @toggle-field="toggleField"
        @toggle-allow-all="toggleAllowAll"
        @clear-search="searchQuery = ''"
        @save="saveAllPermissions"
      />
    </template>

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :title="`Permission Matrix - ${activeRoleTab || 'Role'}`"
      subtitle="Role-based access control configuration"
      :columns="printColumns"
      :items="printablePermissions"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
