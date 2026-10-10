<script setup lang="ts">
import type { BlogTag, BlogTagFormData } from '#server/types/blog'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  tagData: BlogTag | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: BlogTagFormData]
}>()

const form = ref<BlogTagFormData>({
  id: '',
  name: '',
  slug: '',
  description: '',
  taggedPosts: 0,
})

const errorMessage = ref('')

watch(
  () => props.tagData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        slug: val.slug,
        description: val.description || '',
        taggedPosts: val.taggedPosts ?? 0,
      }
    } else {
      form.value = {
        id: '',
        name: '',
        slug: '',
        description: '',
        taggedPosts: 0,
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Tag name is required'
    return
  }

  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Blog Tag' : 'Add Blog Tag'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Tag Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tag Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Packaging, Offset, Security"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Slug -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Slug (Optional)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.slug"
            type="text"
            placeholder="Auto-generated if left empty"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Description -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Description</label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Description of the tag..."
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          :disabled="busy"
          class="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <FeatherIcon v-if="busy" name="rotate-cw" :size="14" class="animate-spin" />
          <span>{{ isEdit ? 'Update Tag' : 'Create Tag' }}</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
