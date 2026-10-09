<script setup lang="ts">
import { useThemeStore } from "~/stores/theme";
import FeatherIcon from "~/components/common/FeatherIcon.vue";

const themeStore = useThemeStore();
const isSearchOpen = ref(false);
const isStoreDropdownOpen = ref(false);
const isFlagDropdownOpen = ref(false);
const isNotificationsOpen = ref(false);
const isUserMenuOpen = ref(false);
const isFullscreen = ref(false);

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  }
};

const closeAllDropdowns = () => {
  isSearchOpen.value = false;
  isStoreDropdownOpen.value = false;
  isFlagDropdownOpen.value = false;
  isNotificationsOpen.value = false;
  isUserMenuOpen.value = false;
};
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 transition-colors dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Left Section: Logo & Toggle Button -->
    <div class="flex items-center space-x-3">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/assets/img/logo-small.png" alt="Logo" class="h-8 w-auto" />
        <span class="text-lg font-bold tracking-tight text-secondary dark:text-white">Kacetak System</span>
      </NuxtLink>

      <!-- Sidebar Desktop Toggle -->
      <button
        id="toggle_btn"
        type="button"
        class="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#FE9F43] lg:flex dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-[#FE9F43]"
        :title="themeStore.isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        @click="themeStore.toggleSidebar"
      >
        <!-- chevrons-right when collapsed, chevrons-left when expanded -->
        <svg v-if="themeStore.isSidebarCollapsed" class="h-5 w-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
        <svg v-else class="h-5 w-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>

      <!-- Mobile Hamburger Button -->
      <button
        id="mobile_btn"
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#FE9F43] lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        title="Open Mobile Menu"
        @click="themeStore.toggleMobileSidebar"
      >
        <svg class="h-5 w-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Center/Left: Search Bar -->
    <div class="relative hidden max-w-md flex-1 md:block md:mx-6">
      <div class="relative">
        <input
          type="text"
          placeholder="Search..."
          class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 ps-10 pe-4 text-sm text-gray-800 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @focus="isSearchOpen = true"
        />
        <span class="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
          <FeatherIcon name="search" size="16" />
        </span>
      </div>

      <!-- Search Dropdown Preview -->
      <div
        v-if="isSearchOpen"
        class="absolute start-0 top-full z-50 mt-1.5 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
          <span class="text-xs font-semibold uppercase text-gray-400">Recent Searches</span>
          <button type="button" class="text-xs text-gray-400 hover:text-gray-600" @click="isSearchOpen = false">
            <FeatherIcon name="x" size="14" />
          </button>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <NuxtLink
            to="/product-list"
            class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-primary-100 hover:text-primary dark:bg-gray-700 dark:text-gray-300"
            >Products</NuxtLink
          >
          <NuxtLink
            to="/sales"
            class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-primary-100 hover:text-primary dark:bg-gray-700 dark:text-gray-300"
            >Sales</NuxtLink
          >
          <NuxtLink
            to="/job-order"
            class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-primary-100 hover:text-primary dark:bg-gray-700 dark:text-gray-300"
            >Job Orders</NuxtLink
          >
        </div>
      </div>
    </div>

    <!-- Right Section: Store, Language, Notifications, Fullscreen, Profile -->
    <div class="flex items-center space-x-2 sm:space-x-3">
      <!-- Select Store Dropdown -->
      <div class="relative hidden sm:block">
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="isStoreDropdownOpen = !isStoreDropdownOpen"
        >
          <img src="/assets/img/store/store-01.png" alt="Store" class="h-4 w-4 rounded-full" />
          <span>Select Store</span>
          <FeatherIcon name="chevron-down" size="14" />
        </button>
        <div
          v-if="isStoreDropdownOpen"
          class="absolute end-0 mt-1.5 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <a
            href="javascript:void(0)"
            class="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >Grocery Alpha</a
          >
          <a
            href="javascript:void(0)"
            class="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >Grocery Apex</a
          >
          <a
            href="javascript:void(0)"
            class="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >Grocery Bevy</a
          >
        </div>
      </div>

      <!-- Language Flag Dropdown (Architecture Ready - English default) -->
      <div class="relative">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          title="Language (English)"
          @click="isFlagDropdownOpen = !isFlagDropdownOpen"
        >
          <img src="/assets/img/flags/us.png" alt="English" class="h-4 w-5 rounded-sm object-cover" />
        </button>
        <div
          v-if="isFlagDropdownOpen"
          class="absolute end-0 mt-1.5 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary bg-primary-50 dark:bg-gray-700">
            <img src="/assets/img/flags/us.png" alt="English" class="h-3.5 w-4.5 rounded-sm" />
            <span>English</span>
          </div>
        </div>
      </div>

      <!-- Fullscreen Button -->
      <button
        type="button"
        class="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 sm:flex dark:text-gray-400 dark:hover:bg-gray-800"
        title="Toggle Fullscreen"
        @click="toggleFullscreen"
      >
        <FeatherIcon :name="isFullscreen ? 'minimize' : 'maximize'" size="18" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button
          type="button"
          class="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title="Notifications"
          @click="isNotificationsOpen = !isNotificationsOpen"
        >
          <FeatherIcon name="bell" size="18" />
          <span class="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
        </button>
        <div
          v-if="isNotificationsOpen"
          class="absolute end-0 mt-1.5 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
            <h6 class="text-xs font-bold text-gray-800 dark:text-white">Notifications</h6>
            <span class="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary">2 New</span>
          </div>
          <div class="mt-2 space-y-2">
            <div class="flex gap-2.5 text-xs">
              <div class="mt-0.5 text-primary"><FeatherIcon name="check-circle" size="14" /></div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">Job Order #25250025452 approved</p>
                <span class="text-[10px] text-gray-400">4 mins ago</span>
              </div>
            </div>
            <div class="flex gap-2.5 text-xs">
              <div class="mt-0.5 text-primary"><FeatherIcon name="shopping-bag" size="14" /></div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">New Sales Order PT002 received</p>
                <span class="text-[10px] text-gray-400">12 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile Dropdown -->
      <div class="relative ps-1">
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg p-1 text-start hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="isUserMenuOpen = !isUserMenuOpen"
        >
          <img src="/assets/img/profiles/avator1.jpg" alt="User" class="h-8 w-8 rounded-full object-cover" />
          <div class="hidden text-start lg:block">
            <p class="text-xs font-bold leading-tight text-gray-800 dark:text-white">John Smilga</p>
            <span class="text-[11px] leading-tight text-gray-400">Super Admin</span>
          </div>
          <FeatherIcon name="chevron-down" size="14" class="hidden text-gray-400 lg:block" />
        </button>

        <div
          v-if="isUserMenuOpen"
          class="absolute end-0 mt-1.5 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FeatherIcon name="user" size="14" />
            <span>My Profile</span>
          </NuxtLink>
          <NuxtLink
            to="/company-setting"
            class="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FeatherIcon name="settings" size="14" />
            <span>Settings</span>
          </NuxtLink>
          <hr class="my-1 border-gray-100 dark:border-gray-700" />
          <NuxtLink
            to="/signin"
            class="flex items-center gap-2 px-4 py-2 text-xs text-danger hover:bg-danger-50 dark:hover:bg-gray-700"
          >
            <FeatherIcon name="log-out" size="14" />
            <span>Logout</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
