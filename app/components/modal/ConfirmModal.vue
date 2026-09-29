<script setup lang="ts">
import FeatherIcon from "~/components/common/FeatherIcon.vue";
import BaseModal from "~/components/modal/BaseModal.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "primary";
  }>(),
  {
    title: "Are you sure?",
    message: "Do you really want to delete this record? This action cannot be undone.",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
    variant: "danger",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
  emit("cancel");
};

const handleConfirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};
</script>

<template>
  <BaseModal :model-value="modelValue" max-width="sm" @update:model-value="emit('update:modelValue', $event)">
    <div class="text-center py-2">
      <!-- Icon badge -->
      <div
        :class="[
          'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full',
          variant === 'danger'
            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
            : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30',
        ]"
      >
        <FeatherIcon :name="variant === 'danger' ? 'trash-2' : 'alert-circle'" size="28" />
      </div>

      <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h4>
      <p class="text-sm text-gray-500 dark:text-gray-400 px-4 mb-6 leading-relaxed">{{ message }}</p>

      <div class="flex items-center justify-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          @click="close"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors shadow-sm',
            variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-primary hover:bg-primary/90',
          ]"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>
