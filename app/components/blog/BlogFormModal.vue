<script setup lang="ts">
import type { Blog, BlogFormData } from '#server/types/blog'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
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

const form = ref<BlogFormData>({
  id: '',
  title: '',
  slug: '',
  category: 'Features',
  tags: '',
  author: 'Admin',
  publishedAt: '',
  status: 'Active',
  image: '',
  excerpt: '',
  content: '',
})

const errorMessage = ref('')
const imageLoadError = ref(false)

// Generate slug automatically when title changes in add mode
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

watch(
  () => form.value.title,
  (newTitle) => {
    if (!props.isEdit && newTitle) {
      form.value.slug = slugify(newTitle)
    }
  }
)

watch(
  () => [props.open, props.blogData],
  () => {
    if (!props.open) return

    imageLoadError.value = false
    errorMessage.value = ''

    if (props.blogData && props.isEdit) {
      form.value = {
        id: props.blogData.id,
        title: props.blogData.title || '',
        slug: props.blogData.slug || slugify(props.blogData.title || ''),
        category: props.blogData.category || 'Features',
        tags: Array.isArray(props.blogData.tags) ? props.blogData.tags.join(', ') : (props.blogData.tags || ''),
        author: props.blogData.author || 'Admin',
        publishedAt: props.blogData.publishedAt || new Date().toISOString().slice(0, 10),
        status: props.blogData.status || 'Active',
        image: props.blogData.image || '',
        excerpt: props.blogData.excerpt || '',
        content: props.blogData.content || '',
      }
    } else {
      form.value = {
        id: '',
        title: '',
        slug: '',
        category: props.categories?.[0] || 'Features',
        tags: 'Retail, POS, Tech',
        author: 'Admin',
        publishedAt: new Date().toISOString().slice(0, 10),
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1556742049-0a67e55722ee?w=800&auto=format&fit=crop&q=60',
        excerpt: '',
        content: '',
      }
    }
  },
  { immediate: true }
)

const parsedTags = computed(() => {
  if (!form.value.tags) return []
  const raw = Array.isArray(form.value.tags) ? form.value.tags : form.value.tags.split(',')
  return raw.map((t: string) => t.trim()).filter(Boolean)
})

function handleSubmit() {
  if (!form.value.title.trim()) {
    errorMessage.value = 'Blog title is required.'
    return
  }
  if (!form.value.category.trim()) {
    errorMessage.value = 'Blog category is required.'
    return
  }

  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
    <!-- Backdrop Blur -->
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      @click="!busy && emit('close')"
    />

    <!-- Modal Box Container -->
    <div
      class="relative flex w-full max-w-4xl flex-col max-h-[92vh] rounded-2xl bg-white shadow-2xl transition-all dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
        <div class="flex items-center gap-3">
          <div class="flex size-9 items-center justify-center rounded-xl bg-[#FE9F43]/10 text-[#FE9F43] dark:bg-[#FE9F43]/20">
            <FeatherIcon :name="isEdit ? 'edit-3' : 'plus-circle'" size="18" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {{ isEdit ? 'Edit Blog Article' : 'Create New Blog Article' }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ isEdit ? 'Update blog details, image preview, and content body' : 'Publish a new editorial or guide article' }}
            </p>
          </div>
        </div>

        <button
          type="button"
          :disabled="busy"
          class="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          @click="emit('close')"
        >
          <FeatherIcon name="x" size="18" />
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <form class="flex-1 overflow-y-auto px-6 py-5 space-y-6" @submit.prevent="handleSubmit">
        <!-- Error Banner -->
        <div
          v-if="errorMessage"
          class="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-medium text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400"
        >
          <FeatherIcon name="alert-circle" size="16" class="shrink-0 text-rose-500" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Section 1: Title & Slug -->
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Article Title <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="e.g. What is a POS System? A Beginner's Guide"
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
            <span class="font-medium text-gray-400">Slug:</span>
            <span class="font-mono text-gray-700 dark:text-gray-300">/{{ form.slug || slugify(form.title || 'untitled') }}</span>
          </div>
        </div>

        <!-- Section 2: Metadata Grid (Category, Status, Author, Date) -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Category -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Category <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.category"
                required
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white cursor-pointer"
              >
                <option v-for="cat in (categories?.length ? categories : ['Features', 'Printing Guide', 'Security & Tech', 'Printing & Packaging'])" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white cursor-pointer"
            >
              <option value="Active">Active (Published)</option>
              <option value="Inactive">Inactive (Draft)</option>
            </select>
          </div>

          <!-- Author -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Author Name
            </label>
            <div class="relative">
              <input
                v-model="form.author"
                type="text"
                placeholder="Author name"
                class="w-full rounded-xl border border-gray-200 bg-white ps-8 pe-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <span class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
                <FeatherIcon name="user" size="13" />
              </span>
            </div>
          </div>

          <!-- Publish Date -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Publish Date
            </label>
            <div class="relative">
              <input
                v-model="form.publishedAt"
                type="date"
                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Featured Image with Live Preview Box -->
        <div class="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-gray-800 dark:text-gray-200">
              Featured Image
            </label>
            <span class="text-[11px] text-gray-400">Supports direct image URL or Unsplash link</span>
          </div>

          <!-- Image URL Input -->
          <div class="relative">
            <input
              v-model="form.image"
              type="url"
              placeholder="https://images.unsplash.com/... or paste image URL"
              class="w-full rounded-xl border border-gray-200 bg-white ps-8 pe-8 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              @input="imageLoadError = false"
            />
            <span class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
              <FeatherIcon name="image" size="14" />
            </span>
            <button
              v-if="form.image"
              type="button"
              class="absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="form.image = ''"
            >
              <FeatherIcon name="x" size="14" />
            </button>
          </div>

          <!-- Live Image Preview Frame -->
          <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 aspect-[21/9] sm:aspect-[16/7] w-full flex items-center justify-center">
            <img
              v-if="form.image && !imageLoadError"
              :src="form.image"
              alt="Featured image preview"
              class="h-full w-full object-cover transition-opacity duration-300"
              @error="imageLoadError = true"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center p-6 text-center text-gray-400"
            >
              <FeatherIcon name="image" size="28" class="mb-2 text-gray-300 dark:text-gray-600" />
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ imageLoadError ? 'Image failed to load. Please verify the URL.' : 'Preview will appear here when an image URL is provided.' }}
              </p>
            </div>

            <!-- Preview Badge -->
            <div
              v-if="form.image && !imageLoadError"
              class="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white shadow"
            >
              Live Preview
            </div>
          </div>
        </div>

        <!-- Section 4: Tags Input & Badges -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Tags (Comma-separated)
          </label>
          <input
            v-model="form.tags"
            type="text"
            placeholder="e.g. Retail, POS, Tech, Printing, Equipment"
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <!-- Tag Chips Preview -->
          <div v-if="parsedTags.length" class="flex flex-wrap items-center gap-1.5 pt-1">
            <span
              v-for="tag in parsedTags"
              :key="tag"
              class="inline-flex items-center rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Section 5: Excerpt -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Short Excerpt (Summary displayed on card previews)
          </label>
          <textarea
            v-model="form.excerpt"
            rows="2"
            placeholder="Write a concise overview of this article..."
            class="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
          />
        </div>

        <!-- Section 6: Full Article Content -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Blog Content Body
            </label>
            <span class="text-[11px] text-gray-400">
              {{ form.content ? form.content.length : 0 }} characters
            </span>
          </div>
          <textarea
            v-model="form.content"
            rows="6"
            placeholder="Full article content text or markdown notes..."
            class="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none focus:ring-2 focus:ring-[#FE9F43]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white leading-relaxed"
          />
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
        <button
          type="button"
          :disabled="busy"
          class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
          @click="emit('close')"
        >
          Cancel
        </button>

        <button
          type="button"
          :disabled="busy"
          class="inline-flex items-center gap-1.5 rounded-xl bg-[#FE9F43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e08933] disabled:opacity-50"
          @click="handleSubmit"
        >
          <FeatherIcon v-if="busy" name="rotate-cw" :size="14" class="animate-spin" />
          <FeatherIcon v-else :name="isEdit ? 'check' : 'plus'" :size="14" />
          <span>{{ isEdit ? 'Update Blog' : 'Publish Blog' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
