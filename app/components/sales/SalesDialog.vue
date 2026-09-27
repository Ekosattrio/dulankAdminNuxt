<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  wide?: boolean
  document?: boolean
  busy?: boolean
}>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const titleId = useId()
watch(
  () => props.open,
  async (open) => {
    await nextTick()
    if (open && !dialog.value?.open) dialog.value?.showModal()
    if (!open && dialog.value?.open) dialog.value?.close()
  },
  { immediate: true },
)
function cancel(event: Event) {
  event.preventDefault()
  if (!props.busy) emit('close')
}
</script>
<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    :class="[
      'fixed m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-0 text-gray-900 shadow-xl backdrop:bg-black/50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
      document ? 'max-w-6xl' : wide ? 'max-w-5xl' : 'max-w-xl',
    ]"
    @cancel="cancel"
  >
    <div
      class="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-700"
    >
      <h2 :id="titleId" class="text-lg font-semibold">{{ title }}</h2>
      <button
        type="button"
        :disabled="busy"
        aria-label="Close dialog"
        class="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
        @click="$emit('close')"
      >
        <FeatherIcon name="x" :size="20" />
      </button>
    </div>
    <div v-if="open" class="p-6"><slot /></div>
  </dialog>
</template>
