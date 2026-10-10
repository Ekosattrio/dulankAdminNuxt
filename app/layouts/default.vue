<script setup lang="ts">
import { useThemeStore } from "~/stores/theme";
import AppHeader from "~/components/Layout/AppHeader.vue";
import AppSidebar from "~/components/Layout/AppSidebar.vue";

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f8] dark:bg-gray-950 text-[#212529] dark:text-gray-100 flex flex-col">
    <!-- Header -->
    <AppHeader class="print:hidden" />

    <div class="flex flex-1 print:block">
      <!-- Sidebar -->
      <AppSidebar class="print:hidden" />

      <!-- Main Page Content -->
      <main
        :class="[
          'flex-1 transition-all duration-300 min-w-0 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:ms-0 print:w-full',
          themeStore.isSidebarCollapsed ? 'lg:ms-20' : 'lg:ms-[260px]',
        ]"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
