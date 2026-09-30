<script setup lang="ts">
// Footer modal konsisten: tombol Cancel + Submit.
// Dipakai di dalam <form>: tombol submit tetap memicu submit form native.
withDefaults(
  defineProps<{
    submitLabel?: string;
    cancelLabel?: string;
    submitDisabled?: boolean;
  }>(),
  {
    submitLabel: "Submit",
    cancelLabel: "Cancel",
    submitDisabled: false,
  },
);

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "submit"): void;
}>();
</script>

<template>
  <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
    <button
      type="button"
      class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
      @click="emit('cancel')"
    >
      {{ cancelLabel }}
    </button>
    <button
      type="submit"
      :disabled="submitDisabled"
      class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('submit')"
    >
      {{ submitLabel }}
    </button>
  </div>
</template>