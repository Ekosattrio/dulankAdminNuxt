<<<<<<< HEAD
<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Blog Comments</h4>
            <h6>Manage your blog comments</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
      </div>

      <div class="card table-list-card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="search-set">
            <div class="search-input">
              <span class="btn-searchset"><i class="ti ti-search"></i></span>
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Search comments or author..." />
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="dropdown">
              <button
                class="btn btn-white dropdown-toggle d-inline-flex align-items-center"
                type="button"
                @click="sortDropdownOpen = !sortDropdownOpen"
              >
                Sort By: {{ sortByLabel }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul v-if="sortDropdownOpen" class="dropdown-menu dropdown-menu-end p-2 show" style="display: block; position: absolute;">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="sortBy = 'recent'; sortDropdownOpen = false">Latest</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="sortBy = 'asc'; sortDropdownOpen = false">Ascending</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="sortBy = 'desc'; sortDropdownOpen = false">Descending</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive table-comments">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Comments</th>
                  <th>Created Date</th>
                  <th>Ratings</th>
                  <th>Blog</th>
                  <th>By</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in filteredComments" :key="c.id">
                  <td class="text-gray-9 text-wrap" style="max-width: 280px;">{{ c.comment }}</td>
                  <td>{{ c.createdDate }}</td>
                  <td>
                    <div class="d-flex text-warning gap-1">
                      <i v-for="star in 5" :key="star" class="ti ti-star-filled" :class="{ 'text-muted opacity-25': star > c.rating }"></i>
                    </div>
                  </td>
                  <td class="fw-medium text-dark text-wrap" style="max-width: 240px;">{{ c.blogTitle }}</td>
                  <td class="fw-semibold">{{ c.author }}</td>
                  <td>
                    <select v-model="c.status" class="form-select form-select-sm" style="width: 120px;">
                      <option value="Publish">Publish</option>
                      <option value="Unpublish">Unpublish</option>
                    </select>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete"
                        @click="deleteComment(c.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredComments.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">
                    No comments found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: blogCommentData } = await useFetch<BlogComment[]>('/api/blog-comment')
const comments = ref<BlogComment[]>(blogCommentData.value ?? [])
useMockSync('blog-comment', comments)

const searchQuery = ref('')
const sortBy = ref<'recent' | 'asc' | 'desc'>('recent')
const sortDropdownOpen = ref(false)

const sortByLabel = computed(() => {
  if (sortBy.value === 'asc') return 'Ascending'
  if (sortBy.value === 'desc') return 'Descending'
  return 'Latest'
})

const filteredComments = computed(() => {
  return comments.value
    .filter(c => {
      if (!searchQuery.value) return true
      const q = searchQuery.value.toLowerCase()
      return (
        c.comment.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.blogTitle.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy.value === 'asc') return a.author.localeCompare(b.author)
      if (sortBy.value === 'desc') return b.author.localeCompare(a.author)
      return b.id - a.id
    })
})

function deleteComment(id: number) {
  if (confirm('Are you sure you want to delete this comment?')) {
    comments.value = comments.value.filter(c => c.id !== id)
  }
}

function refresh() {
  searchQuery.value = ''
  sortBy.value = 'recent'
}</script>

=======
<script setup lang="ts">
import BlogCommentWorkspace from '~/components/blog/BlogCommentWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Blog Comments',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blog-comment p-4 md:p-6">
    <BlogCommentWorkspace />
  </div>
</template>
>>>>>>> origin/eko
