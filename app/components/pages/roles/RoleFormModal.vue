<script setup lang="ts">
import type { SystemRole } from '#server/types/user-management'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  role: SystemRole | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: Partial<SystemRole>]
}>()

const form = ref<{
  id?: string
  name: string
  description: string
}>({
  id: undefined,
  name: '',
  description: '',
})

watch(
  [() => props.open, () => props.role],
  ([isOpen, roleVal]) => {
    if (isOpen) {
      if (props.isEdit && roleVal) {
        form.value = {
          id: roleVal.id,
          name: roleVal.name,
          description: roleVal.description || '',
        }
      } else {
        form.value = {
          id: undefined,
          name: '',
          description: '',
        }
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />

    <!-- Modal Box -->
    <div class="relative w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Edit Role' : 'Add New Role' }}
        </h3>
        <button
          type="button"
          class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          <FeatherIcon name="x" size="18" />
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 px-6 py-5">
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Role Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. Sales Executive"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Role Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Role responsibilities and access scope..."
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <button
            type="button"
            class="rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="busy"
            class="inline-flex items-center gap-1.5 rounded-md bg-[#FE9F43] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933] disabled:opacity-50"
          >
            <span v-if="busy">Saving...</span>
            <span v-else>{{ isEdit ? 'Update Role' : 'Submit' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
