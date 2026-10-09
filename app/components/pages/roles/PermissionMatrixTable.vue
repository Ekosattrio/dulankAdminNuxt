<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  filteredGroups: { group: string; pages: string[] }[]
  activeRoleTab: string
  expandedGroups: Set<string>
  matrix: Record<string, Record<string, { create: boolean; edit: boolean; delete: boolean; view: boolean; allowAll: boolean }>>
  isGroupAllAllowed: (pages: string[], role: string) => boolean
  searchQuery: string
  isBusy: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleGroup', group: string): void
  (e: 'toggleGroupAll', pages: string[], role: string, checked: boolean): void
  (e: 'toggleField', page: string, role: string, field: 'create' | 'edit' | 'delete' | 'view', checked: boolean): void
  (e: 'toggleAllowAll', page: string, role: string, checked: boolean): void
  (e: 'clearSearch'): void
  (e: 'save'): void
}>()
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
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
            @click="emit('toggleGroup', g.group)"
          >
            <td class="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="flex size-6 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  :aria-label="expandedGroups.has(g.group) ? 'Collapse ' + g.group : 'Expand ' + g.group"
                  @click.stop="emit('toggleGroup', g.group)"
                >
                  <FeatherIcon
                    :name="expandedGroups.has(g.group) ? 'chevron-down' : 'chevron-right'"
                    size="16"
                  />
                </button>
                <span class="font-bold tracking-wider uppercase text-gray-900 dark:text-white">
                  {{ g.group }}
                </span>
                <span class="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-[#ea580c] dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60">
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
                  @change="emit('toggleGroupAll', g.pages, activeRoleTab, ($event.target as HTMLInputElement).checked)"
                />
                <span class="sm:hidden text-xs text-gray-500">All</span>
              </div>
            </td>
          </tr>

          <!-- Page Rows Under Group -->
          <template v-if="expandedGroups.has(g.group)">
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
                  @change="emit('toggleField', page, activeRoleTab, 'create', ($event.target as HTMLInputElement).checked)"
                />
              </td>

              <!-- Edit -->
              <td class="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                  :checked="matrix[page]?.[activeRoleTab]?.edit ?? false"
                  @change="emit('toggleField', page, activeRoleTab, 'edit', ($event.target as HTMLInputElement).checked)"
                />
              </td>

              <!-- Delete -->
              <td class="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                  :checked="matrix[page]?.[activeRoleTab]?.delete ?? false"
                  @change="emit('toggleField', page, activeRoleTab, 'delete', ($event.target as HTMLInputElement).checked)"
                />
              </td>

              <!-- View -->
              <td class="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                  :checked="matrix[page]?.[activeRoleTab]?.view ?? false"
                  @change="emit('toggleField', page, activeRoleTab, 'view', ($event.target as HTMLInputElement).checked)"
                />
              </td>

              <!-- Allow All for this specific page -->
              <td class="px-4 py-3 text-center bg-[#FE9F43]/[0.02]">
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43] dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                  :checked="matrix[page]?.[activeRoleTab]?.allowAll ?? false"
                  @change="emit('toggleAllowAll', page, activeRoleTab, ($event.target as HTMLInputElement).checked)"
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
          @click="emit('clearSearch')"
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
        @click="emit('save')"
      >
        <FeatherIcon v-if="!isBusy" name="check" size="14" />
        <span>{{ isBusy ? 'Saving...' : 'Save Permissions' }}</span>
      </button>
    </div>
  </div>
</template>

