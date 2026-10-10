<script setup lang="ts">
import type { CartItem } from '#server/types/pos'
const props = defineProps<{ open: boolean; item: CartItem | null }>()
const emit = defineEmits<{ close: []; save: [item: CartItem] }>()
const form = ref<CartItem | null>(null)
watch(
  () => [props.open, props.item] as const,
  ([open, item]) => {
    if (open && item) form.value = { ...item }
  },
  { immediate: true },
)
const field =
  'mt-1 block w-full rounded border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800'
</script>
<template>
  <SalesDialog :open="open" title="Edit Product / Printing Specification" @close="$emit('close')">
    <form v-if="form" class="space-y-4" @submit.prevent="emit('save', { ...form })">
      <p class="font-semibold">{{ form.name }}</p>
      <label class="block text-sm">Job Title<input v-model="form.jobTitle" :class="field" required /></label>
      <label class="block text-sm"
        >Specifications<textarea
          v-model="form.specs"
          :class="field"
          rows="3"
          placeholder="Paper size, material, print sides, lamination, folds…"
        />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="text-sm"
          >Quantity<input
            v-model.number="form.qty"
            type="number"
            min="1"
            step="1"
            :class="field"
            required /></label
        ><label class="text-sm"
          >Price (IDR)<input v-model.number="form.price" type="number" min="0" :class="field" required
        /></label>
      </div>
      <div class="flex justify-end gap-3">
        <button type="button" class="rounded border px-4 py-2 text-sm" @click="$emit('close')">Cancel</button
        ><button type="submit" class="rounded bg-primary px-4 py-2 text-sm font-semibold text-white">
          Save Item
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
