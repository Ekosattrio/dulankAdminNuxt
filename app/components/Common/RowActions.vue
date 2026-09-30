<script setup lang="ts">
// Aksi baris tabel (Edit / Delete, opsional View) — blok yang diulang di banyak halaman.
const props = withDefaults(
  defineProps<{
    item: unknown;
    showView?: boolean;
    viewTitle?: string;
  }>(),
  {
    showView: false,
    viewTitle: "View",
  },
);

const emit = defineEmits<{
  (e: "view", item: unknown): void;
  (e: "edit", item: unknown): void;
  (e: "delete", item: unknown): void;
}>();

const btn = "rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800";
</script>

<template>
  <div class="flex items-center justify-end gap-2">
    <button
      v-if="props.showView"
      type="button"
      :class="[btn, 'hover:text-sky-500']"
      :title="props.viewTitle"
      @click="emit('view', props.item)"
    >
      <CommonFeatherIcon name="eye" size="16" />
    </button>
    <button
      type="button"
      :class="[btn, 'hover:text-amber-500']"
      title="Edit"
      @click="emit('edit', props.item)"
    >
      <CommonFeatherIcon name="edit" size="16" />
    </button>
    <button
      type="button"
      :class="[btn, 'hover:text-rose-600']"
      title="Delete"
      @click="emit('delete', props.item)"
    >
      <CommonFeatherIcon name="trash-2" size="16" />
    </button>
  </div>
</template>