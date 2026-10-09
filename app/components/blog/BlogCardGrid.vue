<script setup lang="ts">
import type { Blog } from '#server/types/blog'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  blogs: Blog[]
  pending: boolean
  searchQuery: string
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', blog: Blog): void
  (e: 'delete', blog: Blog): void
  (e: 'clearFilters'): void
}>()

function formatBlogDate(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div>
    <!-- Skeleton Loader for Large Image Card Grid -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 animate-pulse"
      >
        <div class="w-full aspect-[16/10] sm:aspect-[16/9] bg-gray-200 dark:bg-gray-800 relative">
          <div class="absolute top-3 left-3 h-6 w-20 rounded bg-gray-300 dark:bg-gray-700" />
          <div class="absolute top-3 right-3 h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
            <div class="flex gap-2">
              <div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
              <div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <div class="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="blogs.length === 0"
      class="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
        <FeatherIcon name="file-text" size="24" />
      </div>
      <h3 class="mt-3 text-sm font-bold text-gray-900 dark:text-white">No blog posts found</h3>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ searchQuery ? `No articles matching "${searchQuery}". Try adjusting your filters.` : 'Start by creating your first blog article.' }}
      </p>
      <button
        v-if="hasActiveFilters"
        type="button"
        class="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        @click="emit('clearFilters')"
      >
        <FeatherIcon name="x" size="13" />
        <span>Clear Filters</span>
      </button>
      <button
        v-else
        type="button"
        class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#FE9F43] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933]"
        @click="emit('add')"
      >
        <FeatherIcon name="plus" size="14" />
        <span>Add Blog</span>
      </button>
    </div>

    <!-- Large Preview Image Card Grid (2 Columns) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="blog in blogs"
        :key="blog.id"
        class="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
      >
        <!-- Big Image Preview Area -->
        <div class="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            :src="blog.image || 'https://images.unsplash.com/photo-1556742049-0a67e55722ee?w=800&auto=format&fit=crop&q=60'"
            :alt="blog.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <!-- Category Badge (Top Left) -->
          <div class="absolute top-3.5 left-3.5">
            <span class="inline-flex items-center rounded-md bg-[#00A389] px-3 py-1 text-xs font-semibold text-white shadow-md tracking-wide">
              {{ blog.category || 'General' }}
            </span>
          </div>

          <!-- Status Badge (Top Right) -->
          <div class="absolute top-3.5 right-3.5">
            <span
              :class="[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-md backdrop-blur-md',
                blog.status === 'Active'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              ]"
            >
              <span class="size-1.5 rounded-full bg-white animate-pulse" />
              <span>{{ blog.status }}</span>
            </span>
          </div>
        </div>

        <!-- Card Body Content -->
        <div class="flex flex-1 flex-col justify-between p-5">
          <div class="space-y-3">
            <!-- Meta Row: Date, Author & Actions -->
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                  <FeatherIcon name="calendar" size="14" class="text-gray-400" />
                  <span>{{ formatBlogDate(blog.publishedAt) }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <FeatherIcon name="user" size="14" class="text-gray-400" />
                  <span>{{ blog.author || 'Admin' }}</span>
                </div>
              </div>

              <!-- Action Buttons (Edit & Delete) -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  title="Edit Blog"
                  aria-label="Edit Blog"
                  class="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#FE9F43] dark:hover:bg-gray-800"
                  @click="emit('edit', blog)"
                >
                  <FeatherIcon name="edit" size="15" />
                </button>
                <button
                  type="button"
                  title="Delete Blog"
                  aria-label="Delete Blog"
                  class="rounded p-1 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  @click="emit('delete', blog)"
                >
                  <FeatherIcon name="trash-2" size="15" />
                </button>
              </div>
            </div>

            <!-- Blog Title -->
            <h3
              class="text-base sm:text-lg font-bold text-gray-900 transition-colors line-clamp-2 hover:text-[#FE9F43] dark:text-white cursor-pointer"
              :title="blog.title"
              @click="emit('edit', blog)"
            >
              {{ blog.title }}
            </h3>

            <!-- Short Excerpt -->
            <p v-if="blog.excerpt" class="text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
              {{ blog.excerpt }}
            </p>
          </div>

          <!-- Bottom Tags & Engagement info -->
          <div v-if="blog.tags && blog.tags.length" class="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span
              v-for="tag in (Array.isArray(blog.tags) ? blog.tags : [blog.tags])"
              :key="tag"
              class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              #{{ tag }}
            </span>
            <div class="ms-auto flex items-center gap-3 text-xs text-gray-400">
              <span class="inline-flex items-center gap-1" title="Views">
                <FeatherIcon name="eye" size="12" />
                {{ blog.viewsCount ?? 0 }}
              </span>
              <span class="inline-flex items-center gap-1" title="Comments">
                <FeatherIcon name="message-square" size="12" />
                {{ blog.commentsCount ?? 0 }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

