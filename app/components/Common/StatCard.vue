<script setup lang="ts">
// Kartu statistik (KPI widget) — dipakai di dashboard & halaman list.
withDefaults(
  defineProps<{
    label: string;
    value: string;
    icon?: string;
    tone?: "primary" | "warning" | "success" | "danger" | "slate" | "sky" | "indigo";
    trend?: string;
    trendType?: "up" | "down";
  }>(),
  {
    icon: undefined,
    tone: "primary",
    trend: undefined,
    trendType: "up",
  },
);
</script>

<template>
  <div
    class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="min-w-0">
      <h6 class="mb-1 truncate text-xs font-medium text-gray-500 dark:text-gray-400">{{ label }}</h6>
      <h4 class="truncate text-xl font-bold text-gray-900 dark:text-gray-100">{{ value }}</h4>
      <span
        v-if="trend"
        :class="[
          'mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold',
          trendType === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
        ]"
      >
        <CommonFeatherIcon :name="trendType === 'up' ? 'trending-up' : 'trending-down'" size="12" />
        {{ trend }}
      </span>
    </div>
    <div
      v-if="icon"
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
      :class="{
        'bg-primary/10 text-primary': tone === 'primary',
        'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400': tone === 'warning',
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400': tone === 'success',
        'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400': tone === 'danger',
        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300': tone === 'slate',
        'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400': tone === 'sky',
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400': tone === 'indigo',
      }"
    >
      <CommonFeatherIcon :name="icon" size="22" />
    </div>
  </div>
</template>