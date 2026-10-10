<script setup lang="ts">
import { usePermissions } from '~/composables/usePermissions'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

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
    const first = val[0]
    if (first && !activeRoleTab.value) {
      activeRoleTab.value = first
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

// Accordion toggle helpers
function isGroupExpanded(groupName: string): boolean {
  return expandedGroups.value.has(groupName)
}

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

// Auto-expand groups when searching
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    filteredGroups.value.forEach((g) => expandedGroups.value.add(g.group))
  }
})

// Total count of matching pages
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

      <!-- Permission Table Content -->
      <div
        v-if="activeRoleTab"
        class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="border-b border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th class="px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-100 text-left">
                  Menu &amp; Page Hierarchy
                </th>
                <th class="w-24 px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100 text-center">Create</th>
                <th class="w-24 px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100 text-center">Edit</th>
                <th class="w-24 px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100 text-center">Delete</th>
                <th class="w-24 px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100 text-center">View</th>
                <th class="w-32 px-4 py-3.5 font-semibold text-[#FE9F43] text-center">Allow All</th>
              </tr>
            </thead>

            <!-- Group Accordion Sections -->
            <tbody
              v-for="g in filteredGroups"
              :key="g.group"
              class="border-b border-gray-200 dark:border-gray-800"
            >
              <!-- Menu Group Header Row -->
              <tr
                class="cursor-pointer select-none border-t border-gray-200 bg-gray-50/90 transition-colors hover:bg-gray-100/80 dark:border-gray-800 dark:bg-gray-800/70 dark:hover:bg-gray-800"
                @click="toggleGroup(g.group)"
              >
                <td class="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                  <div class="flex items-center gap-2.5">
                    <button
                      type="button"
                      class="flex size-6 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      :aria-label="isGroupExpanded(g.group) ? 'Collapse ' + g.group : 'Expand ' + g.group"
                      @click.stop="toggleGroup(g.group)"
                    >
                      <FeatherIcon
                        :name="isGroupExpanded(g.group) ? 'chevron-down' : 'chevron-right'"
                        size="16"
                      />
                    </button>
                    <span class="font-bold tracking-wider uppercase text-gray-900 dark:text-white">
                      {{ g.group }}
                    </span>
                    <span class="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-[#ea580c] dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60">
                      {{ g.pages.length }} {{ g.pages.length === 1 ? 'Page' : 'Pages' }}
                    </span>
                  </div>
                </td>
                <td colspan="4" class="px-4 py-3 text-end text-xs text-gray-400 dark:text-gray-500">
                  <span class="hidden sm:inline">Allow all in {{ g.group }}:</span>
                </td>
                <td class="px-4 py-3 text-center bg-[#FE9F43]/[0.03]" @click.stop>
                  <div class="flex items-center justify-center gap-1.5" title="Allow all permissions for this menu group">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                      :checked="isGroupAllAllowed(g.pages, activeRoleTab)"
                      @change="toggleGroupAll(g.pages, activeRoleTab, ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="sm:hidden text-[10px] text-gray-500">All</span>
                  </div>
                </td>
              </tr>

              <!-- Page Rows Under Group -->
              <template v-if="isGroupExpanded(g.group)">
                <tr
                  v-for="page in g.pages"
                  :key="page"
                  class="border-t border-gray-100 transition-colors hover:bg-orange-50/20 dark:border-gray-800/60 dark:hover:bg-gray-800/30"
                >
                  <td class="py-3 ps-10 pe-4">
                    <div class="flex items-center gap-2">
                      <span class="size-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                      <span class="font-medium text-gray-800 dark:text-gray-200">
                        {{ page }}
                      </span>
                    </div>
                  </td>

                  <!-- Create -->
                  <td class="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                      :checked="matrix[page]?.[activeRoleTab]?.create ?? false"
                      @change="toggleField(page, activeRoleTab, 'create', ($event.target as HTMLInputElement).checked)"
                    />
                  </td>

                  <!-- Edit -->
                  <td class="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                      :checked="matrix[page]?.[activeRoleTab]?.edit ?? false"
                      @change="toggleField(page, activeRoleTab, 'edit', ($event.target as HTMLInputElement).checked)"
                    />
                  </td>

                  <!-- Delete -->
                  <td class="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                      :checked="matrix[page]?.[activeRoleTab]?.delete ?? false"
                      @change="toggleField(page, activeRoleTab, 'delete', ($event.target as HTMLInputElement).checked)"
                    />
                  </td>

                  <!-- View -->
                  <td class="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                      :checked="matrix[page]?.[activeRoleTab]?.view ?? false"
                      @change="toggleField(page, activeRoleTab, 'view', ($event.target as HTMLInputElement).checked)"
                    />
                  </td>

                  <!-- Allow All for this specific page -->
                  <td class="px-4 py-3 text-center bg-[#FE9F43]/[0.02]">
                    <input
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                      :checked="matrix[page]?.[activeRoleTab]?.allowAll ?? false"
                      @change="toggleAllowAll(page, activeRoleTab, ($event.target as HTMLInputElement).checked)"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- Empty search results -->
          <div v-if="filteredGroups.length === 0" class="p-8 text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-orange-50 text-[#FE9F43] dark:bg-orange-950/40">
              <FeatherIcon name="search" size="20" />
            </div>
            <p class="mt-3 text-sm font-semibold text-gray-900 dark:text-white">No menus or pages found</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              No items matching "{{ searchQuery }}". Try a different search term.
            </p>
            <button
              type="button"
              class="mt-3 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @click="searchQuery = ''"
            >
              Clear Search
            </button>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Configuring permissions for role: <strong class="text-gray-900 dark:text-white">{{ activeRoleTab }}</strong>
          </div>
          <button
            type="button"
            :disabled="isBusy"
            class="inline-flex items-center gap-1.5 rounded-md bg-[#FE9F43] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933] disabled:opacity-50"
            @click="saveAllPermissions"
          >
            <FeatherIcon v-if="!isBusy" name="check" size="14" />
            <span>{{ isBusy ? 'Saving...' : 'Save Permissions' }}</span>
          </button>
        </div>
      </div>
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

