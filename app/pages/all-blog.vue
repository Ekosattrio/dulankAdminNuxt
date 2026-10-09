<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Blogs" subtitle="Manage your blogs">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printBlogs"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refreshBlogs"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Blog</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Filter Controls -->
    <div class="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search blog title or category..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Status"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]"
          />
          <select
            v-model="sortBy"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="recent">Sort By: Recently Added</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Blog Grid -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="blog in filteredBlogs" :key="blog.id" class="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="relative mb-3 overflow-hidden rounded-t-xl">
          <img :src="blog.image" :alt="blog.title" class="h-[220px] w-full rounded-t-xl object-cover" />
          <div class="absolute left-2 top-2 flex gap-2">
            <span class="rounded-md bg-sky-500 px-2 py-0.5 text-[11px] font-medium text-white">{{ blog.category }}</span>
            <CommonStatusPill :status="blog.status" :tone="blog.status === 'Active' ? 'emerald' : 'slate'" />
          </div>
        </div>

        <div class="flex flex-1 flex-col px-5 pb-5">
          <!-- Author and Date -->
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span class="inline-flex items-center gap-1">
                <CommonFeatherIcon name="calendar" size="13" />
                {{ blog.date }}
              </span>
              <span class="inline-flex items-center gap-1 border-l border-gray-200 ps-2 dark:border-gray-700">
                <CommonFeatherIcon name="user" size="13" />
                {{ blog.author }}
              </span>
            </div>
            <CommonRowActions :item="blog" @edit="openEditModal(blog)" @delete="deleteBlog(blog.id)" />
          </div>

          <!-- Title and Excerpt -->
          <h5 class="mb-2 text-sm font-semibold text-gray-900 hover:text-primary dark:text-gray-100">
            {{ blog.title }}
          </h5>
          <p class="line-clamp-2 flex-grow-1 text-xs text-gray-500 dark:text-gray-400">{{ blog.excerpt }}</p>

          <!-- Tags -->
          <div class="mt-2 flex flex-wrap gap-1 border-t border-gray-100 pt-2 dark:border-gray-800">
            <span
              v-for="tag in blog.tags"
              :key="tag"
              class="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredBlogs.length === 0" class="col-span-full py-10 text-center text-gray-400">
        <p>No blogs found matching your criteria.</p>
      </div>
    </div>

    <!-- Add/Edit Blog Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit Blog' : 'Add Blog'" maxWidth="lg">
      <form @submit.prevent="saveBlog" class="space-y-4">
        <CommonFormField label="Image URL / Preview">
          <div class="flex items-center gap-3">
            <img
              :src="form.image || 'https://assets.penguinrandomhouse.com/wp-content/uploads/2025/02/08160313/PRH_BooksBeforeYouDie-1200x628-1.jpg'"
              alt="Preview"
              class="h-[70px] w-[100px] rounded-md border border-gray-200 object-cover dark:border-gray-700"
            />
            <input
              v-model="form.image"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CommonFormField>
        <CommonFormField label="Blog Title" required>
          <input
            v-model="form.title"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="Enter blog title"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Category" required>
            <select
              v-model="form.category"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Features">Features</option>
              <option value="Guide">Guide</option>
              <option value="Security">Security</option>
              <option value="Printing & Packaging">Printing & Packaging</option>
              <option value="Business Tips">Business Tips</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Tags (comma-separated)">
            <input
              v-model="tagsInput"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Retail, POS, Guide"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Excerpt / Short Description">
          <textarea
            v-model="form.excerpt"
            rows="2"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Brief summary of article..."
          ></textarea>
        </CommonFormField>
        <CommonFormField label="Content Description" required>
          <textarea
            v-model="form.content"
            rows="4"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Write blog content here..."
            required
          ></textarea>
        </CommonFormField>
        <CommonToggleSwitch v-model="formStatusBool" label="Status Active" />
        <CommonModalFooter :submit-label="isEdit ? 'Update Blog' : 'Submit Blog'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: allBlogData } = await useFetch<Blog[]>('/api/all-blog')
const blogs = ref<Blog[]>(allBlogData.value ?? [])
useMockSync('all-blog', blogs);

const searchQuery = ref("");
const filterStatus = ref("");
const sortBy = ref<"recent" | "asc" | "desc">("recent");

const statusDropdownOpen = ref(false);
const sortDropdownOpen = ref(false);

const sortByLabel = computed(() => {
  if (sortBy.value === "asc") return "Ascending";
  if (sortBy.value === "desc") return "Descending";
  return "Recently Added";
});

const filteredBlogs = computed(() => {
  return blogs.value
    .filter((b) => {
      const matchSearch =
        !searchQuery.value ||
        b.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.value.toLowerCase()));
      const matchStatus = !filterStatus.value || b.status === filterStatus.value;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy.value === "asc") return a.title.localeCompare(b.title);
      if (sortBy.value === "desc") return b.title.localeCompare(a.title);
      return b.id - a.id;
    });
});

// Modal state
const modalVisible = ref(false);
const isEdit = ref(false);
const currentBlogId = ref<number | null>(null);
const tagsInput = ref("");

const form = ref({
  title: "",
  category: "Features",
  status: "Active" as "Active" | "Inactive",
  image: "",
  excerpt: "",
  content: "",
});

const formStatusBool = computed({
  get: () => form.value.status === "Active",
  set: (val: boolean) => {
    form.value.status = val ? "Active" : "Inactive";
  },
});

function openAddModal() {
  isEdit.value = false;
  currentBlogId.value = null;
  form.value = {
    title: "",
    category: "Features",
    status: "Active",
    image: "https://assets.penguinrandomhouse.com/wp-content/uploads/2025/02/08160313/PRH_BooksBeforeYouDie-1200x628-1.jpg",
    excerpt: "",
    content: "",
  };
  tagsInput.value = "Retail, POS";
  modalVisible.value = true;
}

function openEditModal(blog: Blog) {
  isEdit.value = true;
  currentBlogId.value = blog.id;
  form.value = {
    title: blog.title,
    category: blog.category,
    status: blog.status,
    image: blog.image,
    excerpt: blog.excerpt,
    content: blog.content,
  };
  tagsInput.value = blog.tags.join(", ");
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function saveBlog() {
  const parsedTags = tagsInput.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (isEdit.value && currentBlogId.value !== null) {
    const idx = blogs.value.findIndex((b) => b.id === currentBlogId.value);
    if (idx !== -1) {
      blogs.value[idx] = {
        ...blogs.value[idx],
        ...form.value,
        tags: parsedTags,
      };
    }
  } else {
    const newId = blogs.value.length ? Math.max(...blogs.value.map((b) => b.id)) + 1 : 1;
    blogs.value.unshift({
      id: newId,
      ...form.value,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      author: "Admin",
      tags: parsedTags,
    });
  }
  closeModal();
}

function deleteBlog(id: number) {
  if (confirm("Are you sure you want to delete this blog?")) {
    blogs.value = blogs.value.filter((b) => b.id !== id);
  }
}

function exportPdf() {
  alert("Exporting blog list as PDF...");
}

function printBlogs() {
  window.print();
}

function refreshBlogs() {
  searchQuery.value = "";
  filterStatus.value = "";
  sortBy.value = "recent";
}</script>
=======
<script setup lang="ts">
import AllBlogWorkspace from '~/components/blog/AllBlogWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'All Blogs',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-all-blog p-4 md:p-6">
    <AllBlogWorkspace />
  </div>
</template>
>>>>>>> origin/eko
