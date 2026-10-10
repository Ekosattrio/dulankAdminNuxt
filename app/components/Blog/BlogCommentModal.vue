<script setup lang="ts">
import type { BlogComment, BlogCommentFormData } from '#server/types/blog'
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
  commentData: BlogComment | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: BlogCommentFormData]
}>()

const form = ref<BlogCommentFormData>({
  id: '',
  blogTitle: '',
  commenterName: '',
  email: '',
  commentBody: '',
  rating: 5,
  status: 'Approved',
})

const errorMessage = ref('')

watch(
  () => props.commentData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        blogId: val.blogId,
        blogTitle: val.blogTitle,
        commenterName: val.commenterName,
        email: val.email || '',
        commentBody: val.commentBody,
        rating: val.rating ?? 5,
        status: val.status || 'Approved',
      }
    } else {
      form.value = {
        id: '',
        blogTitle: '',
        commenterName: '',
        email: '',
        commentBody: '',
        rating: 5,
        status: 'Approved',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.commenterName.trim()) {
    errorMessage.value = 'Commenter name is required'
    return
  }
  if (!form.value.commentBody.trim()) {
    errorMessage.value = 'Comment body is required'
    return
  }

  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Comment' : 'Add Comment'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Blog Title -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Blog Post Title <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.blogTitle"
            type="text"
            placeholder="Related blog post title"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Commenter Name & Email -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Commenter Name <span class="text-rose-500">*</span></label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.commenterName"
              type="text"
              placeholder="e.g. John Doe"
              required
              :class="formControlClass"
            />
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Email</label>
          <div :class="modalFormInputColClass">
            <input
              v-model="form.email"
              type="email"
              placeholder="name@example.com"
              :class="formControlClass"
            />
          </div>
        </div>
      </div>

      <!-- Status & Rating -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Status</label>
          <div :class="modalFormInputColClass">
            <select v-model="form.status" :class="formControlClass">
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Spam">Spam</option>
            </select>
          </div>
        </div>

        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Rating (1 to 5)</label>
          <div :class="modalFormInputColClass">
            <select v-model.number="form.rating" :class="formControlClass">
              <option :value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option :value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option :value="3">⭐⭐⭐ (3 Stars)</option>
              <option :value="2">⭐⭐ (2 Stars)</option>
              <option :value="1">⭐ (1 Star)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Comment Body -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Comment Body <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.commentBody"
            rows="4"
            placeholder="Type comment message..."
            required
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
          <span>{{ isEdit ? 'Update Comment' : 'Create Comment' }}</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
