<script setup lang="ts">
import type { Blog, BlogFormData } from '~/types/blog'
import BlogFormModal from './BlogFormModal.vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  open: boolean
  isEdit: boolean
  blogData: Blog | null
  categories?: string[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: BlogFormData]
}>()
</script>

<template>
  <BlogFormModal
    :open="open"
    :is-edit="isEdit"
    :blog-data="blogData"
    :categories="categories"
    :busy="busy"
    v-bind="$attrs"
    @close="emit('close')"
    @submit="emit('submit', $event)"
  />
</template>
