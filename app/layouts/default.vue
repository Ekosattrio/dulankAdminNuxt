<script setup lang="ts">
import { useThemeStore } from "~/stores/theme";

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f8] dark:bg-gray-950 text-[#212529] dark:text-gray-100 flex flex-col">
    <!-- Header -->
<<<<<<< HEAD
    <AppLayoutHeader />
=======
    <AppHeader class="print:hidden" />
>>>>>>> origin/eko

    <div class="flex flex-1 print:block">
      <!-- Sidebar -->
<<<<<<< HEAD
      <AppLayoutSidebar />
=======
      <AppSidebar class="print:hidden" />
>>>>>>> origin/eko

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
