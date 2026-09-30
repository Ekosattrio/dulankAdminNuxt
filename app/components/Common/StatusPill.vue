<script setup lang="ts">
// Pill status — standarisasi warna badge status di seluruh aplikasi.
// tone dapat dipaksa via prop; default diturunkan dari nilai status.

type Tone = "emerald" | "amber" | "rose" | "slate" | "sky" | "indigo" | "violet";

const props = withDefaults(
  defineProps<{
    status: string;
    tone?: Tone;
  }>(),
  {
    tone: undefined,
  },
);

const TONES: Record<Tone, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

const ACTIVE = ["active", "open", "paid", "approved", "completed", "success", "enabled", "available", "delivered", "confirmed", "read", "published"];
const WARNING = ["pending", "progress", "processing", "draft", "waiting", "on-hold", "on hold", "partial", "scheduled", "queued", "unread"];
const DANGER = ["inactive", "disable", "closed", "failed", "rejected", "resign", "cancelled", "canceled", "overdue", "expired", "blocked", "banned", "out of stock", "inactive", "returned", "deleted", "void", "refunded", "unpaid"];

const toneClass = computed<Tone>(() => {
  if (props.tone) return props.tone;
  const s = props.status.toLowerCase();
  if (ACTIVE.some((k) => s === k)) return "emerald";
  if (WARNING.some((k) => s.includes(k))) return "amber";
  if (DANGER.some((k) => s === k)) return "rose";
  return "slate";
});
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap', TONES[toneClass]]"
  >
    {{ status }}
  </span>
</template>