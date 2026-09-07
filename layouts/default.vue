<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f8] dark:bg-gray-950 text-[#212529] dark:text-gray-100 flex flex-col">
    <!-- Header -->
    <AppHeader />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main Page Content -->
      <main
        :class="[
          'flex-1 transition-all duration-300 min-w-0 p-4 sm:p-6 lg:p-8',
          themeStore.isSidebarCollapsed ? 'lg:ms-20' : 'lg:ms-64'
        ]"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

