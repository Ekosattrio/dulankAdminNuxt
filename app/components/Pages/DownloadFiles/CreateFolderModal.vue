<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  open: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [folderName: string]
}>()

const folderName = ref('')
const errorMessage = ref('')

function handleSubmit() {
  if (!folderName.value.trim()) {
    errorMessage.value = 'Nama folder harus diisi'
    return
  }
  errorMessage.value = ''
  emit('submit', folderName.value.trim())
}

watch(() => props.open, (val) => {
  if (val) {
    folderName.value = ''
    errorMessage.value = ''
  }
})
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    />

    <!-- Dialog -->
    <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <h5 class="text-base font-bold text-gray-900 dark:text-gray-100">Create Folder</h5>
        <button
          type="button"
          class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          @click="$emit('close')"
        >
          <FeatherIcon name="x" :size="18" />
        </button>
      </div>

      <!-- Form Body -->
      <form class="space-y-4 pt-4" @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Folder Name</label>
          <input
            v-model="folderName"
            type="text"
            placeholder="Masukkan nama folder..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            autofocus
          />
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            type="button"
            class="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            :disabled="busy"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-xl bg-[#F97316] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#EA580C] disabled:opacity-50"
            :disabled="busy"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
