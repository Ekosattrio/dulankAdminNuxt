import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", () => {
  const isSidebarCollapsed = ref(false);
  const isMobileSidebarOpen = ref(false);
  const layoutMode = ref<"light_mode" | "dark_mode">("light_mode");
  const direction = ref<"ltr" | "rtl">("ltr");
  const layoutStyle = ref<"default" | "box" | "collapsed" | "horizontal" | "modern">("default");
  const isCustomizerOpen = ref(false);

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  };

  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  };

  const closeMobileSidebar = () => {
    isMobileSidebarOpen.value = false;
  };

  const setMode = (mode: "light_mode" | "dark_mode") => {
    layoutMode.value = mode;
    if (import.meta.client) {
      document.documentElement.setAttribute("data-layout-mode", mode);
      localStorage.setItem("theme", mode);
    }
  };

  const setDirection = (dir: "ltr" | "rtl") => {
    direction.value = dir;
    if (import.meta.client) {
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("data-direction", dir);
    }
  };

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem("theme") as "light_mode" | "dark_mode" | null;
      if (savedTheme) {
        setMode(savedTheme);
      }
    }
  };

  return {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    layoutMode,
    direction,
    layoutStyle,
    isCustomizerOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    setMode,
    setDirection,
    initTheme,
  };
});
