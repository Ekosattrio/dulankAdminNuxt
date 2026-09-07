<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Blogs</h4>
            <h6>Manage your blogs</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printBlogs"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refreshBlogs"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add Blog
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="card mb-4">
        <div class="card-body pb-3">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div class="search-set mb-0">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search blog title or category..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-3 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-white dropdown-toggle d-inline-flex align-items-center"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || "All" }}
                  <i class="ti ti-chevron-down ms-1"></i>
                </button>
                <ul
                  v-if="statusDropdownOpen"
                  class="dropdown-menu dropdown-menu-end p-2 show"
                  style="display: block; position: absolute"
                >
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item rounded-1"
                      @click="
                        filterStatus = '';
                        statusDropdownOpen = false;
                      "
                      >All Status</a
                    >
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item rounded-1"
                      @click="
                        filterStatus = 'Active';
                        statusDropdownOpen = false;
                      "
                      >Active</a
                    >
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item rounded-1"
                      @click="
                        filterStatus = 'Inactive';
                        statusDropdownOpen = false;
                      "
                      >Inactive</a
                    >
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <button
                  class="btn btn-white dropdown-toggle d-inline-flex align-items-center"
                  type="button"
                  @click="sortDropdownOpen = !sortDropdownOpen"
                >
                  Sort By: {{ sortByLabel }}
                  <i class="ti ti-chevron-down ms-1"></i>
                </button>
                <ul
                  v-if="sortDropdownOpen"
                  class="dropdown-menu dropdown-menu-end p-2 show"
                  style="display: block; position: absolute"
                >
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item rounded-1"
                      @click="
                        sortBy = 'recent';
                        sortDropdownOpen = false;
                      "
                      >Recently Added</a
                    >
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item rounded-1"
                      @click="
                        sortBy = 'asc';
                        sortDropdownOpen = false;
                      "
                      >Ascending</a
                    >
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item rounded-1"
                      @click="
                        sortBy = 'desc';
                        sortDropdownOpen = false;
                      "
                      >Descending</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blog Grid -->
      <div class="row g-4">
        <div v-for="blog in filteredBlogs" :key="blog.id" class="col-xxl-4 col-md-6">
          <div class="card h-100 shadow-sm border">
            <div class="card-body d-flex flex-column">
              <div class="w-100 position-relative mb-3 overflow-hidden rounded">
                <img class="w-100 object-fit-cover rounded" style="height: 220px" :src="blog.image" :alt="blog.title" />
                <div class="position-absolute top-2 start-2 d-flex gap-2">
                  <span class="badge bg-info badge-custom fs-11 fw-medium px-2 py-1">{{ blog.category }}</span>
                  <span
                    class="badge badge-status fs-11 fw-medium px-2 py-1"
                    :class="blog.status === 'Active' ? 'bg-success' : 'bg-secondary'"
                  >
                    • {{ blog.status }}
                  </span>
                </div>
              </div>

              <!-- Author and Date -->
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center text-muted small">
                  <span class="me-3 d-flex align-items-center"> <i class="ti ti-calendar me-1"></i> {{ blog.date }} </span>
                  <span class="border-start ps-2 d-flex align-items-center">
                    <i class="ti ti-user me-1"></i> {{ blog.author }}
                  </span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button type="button" class="btn btn-sm btn-icon text-primary p-0" title="Edit" @click="openEditModal(blog)">
                    <i class="ti ti-edit fs-16"></i>
                  </button>
                  <button type="button" class="btn btn-sm btn-icon text-danger p-0" title="Delete" @click="deleteBlog(blog.id)">
                    <i class="ti ti-trash fs-16"></i>
                  </button>
                </div>
              </div>

              <!-- Title and Excerpt -->
              <h5 class="card-title mb-2">
                <a href="javascript:void(0);" class="text-dark hover:text-primary text-decoration-none fw-semibold">
                  {{ blog.title }}
                </a>
              </h5>
              <p class="text-muted small flex-grow-1 line-clamp-2">{{ blog.excerpt }}</p>

              <!-- Tags -->
              <div class="d-flex flex-wrap gap-1 mt-2 pt-2 border-top">
                <span v-for="tag in blog.tags" :key="tag" class="badge bg-light text-secondary border fs-11"> #{{ tag }} </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredBlogs.length === 0" class="col-12 text-center py-5">
          <i class="ti ti-article-off text-muted" style="font-size: 3rem"></i>
          <p class="text-muted mt-2">No blogs found matching your criteria.</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Blog Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" style="background-color: rgba(0, 0, 0, 0.5)" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ isEdit ? "Edit Blog" : "Add Blog" }}</h4>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveBlog">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Image URL / Preview</label>
                  <div class="d-flex gap-3 align-items-center mb-2">
                    <img
                      :src="
                        form.image ||
                        'https://assets.penguinrandomhouse.com/wp-content/uploads/2025/02/08160313/PRH_BooksBeforeYouDie-1200x628-1.jpg'
                      "
                      alt="Preview"
                      class="rounded border object-fit-cover"
                      style="width: 100px; height: 70px"
                    />
                    <div class="flex-grow-1">
                      <input v-model="form.image" type="text" class="form-control" placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Blog Title <span class="text-danger">*</span></label>
                  <input v-model="form.title" type="text" class="form-control" required placeholder="Enter blog title" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Category <span class="text-danger">*</span></label>
                  <select v-model="form.category" class="form-select form-select-lg" required>
                    <option value="Features">Features</option>
                    <option value="Guide">Guide</option>
                    <option value="Security">Security</option>
                    <option value="Printing & Packaging">Printing & Packaging</option>
                    <option value="Business Tips">Business Tips</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Tags (comma-separated)</label>
                  <input v-model="tagsInput" type="text" class="form-control" placeholder="Retail, POS, Guide" />
                </div>

                <div class="col-md-12">
                  <label class="form-label">Excerpt / Short Description</label>
                  <textarea
                    v-model="form.excerpt"
                    rows="2"
                    class="form-control"
                    placeholder="Brief summary of article..."
                  ></textarea>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Content Description <span class="text-danger">*</span></label>
                  <textarea
                    v-model="form.content"
                    rows="4"
                    class="form-control"
                    placeholder="Write blog content here..."
                    required
                  ></textarea>
                </div>

                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-3">
                    <label class="form-label mb-0 me-3">Status Active</label>
                    <div class="form-check form-switch">
                      <input
                        v-model="formStatusBool"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="blogStatusSwitch"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? "Update Blog" : "Submit Blog" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Blog {
  id: number;
  title: string;
  category: string;
  status: "Active" | "Inactive";
  date: string;
  author: string;
  image: string;
  excerpt: string;
  tags: string[];
  content: string;
}

const blogs = ref<Blog[]>([
  {
    id: 1,
    title: "What is a POS System? A Beginner’s Guide",
    category: "Features",
    status: "Active",
    date: "25 Nov 2024",
    author: "Gertrude Bowie",
    image: "https://assets.penguinrandomhouse.com/wp-content/uploads/2025/02/08160313/PRH_BooksBeforeYouDie-1200x628-1.jpg",
    excerpt: "Comprehensive overview on how point of sale systems modernize printing businesses and transactions.",
    tags: ["Retail", "POS", "Tech"],
    content: "Full beginner guide explaining POS hardware, software, and accounting integration...",
  },
  {
    id: 2,
    title: "Top 10 Tips for Offset Printing Maintenance",
    category: "Guide",
    status: "Active",
    date: "20 Nov 2024",
    author: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    excerpt: "Essential daily, weekly, and monthly maintenance steps for Heidelberg and Komori offset presses.",
    tags: ["Offset", "Maintenance", "Quality"],
    content: "Keeping your cylinder rollers clean and dampening system balanced ensures sharp dot reproduction...",
  },
  {
    id: 3,
    title: "Securing Customer Data and Financial Privacy",
    category: "Security",
    status: "Inactive",
    date: "15 Nov 2024",
    author: "Alex Thorne",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    excerpt: "Best practices for handling corporate customer printing files, contracts, and banking information securely.",
    tags: ["Security", "Privacy", "Compliance"],
    content: "Cloud encrypted storage and strict RBAC privileges ensure that sensitive print orders remain confidential...",
  },
  {
    id: 4,
    title: "How to Choose the Right Paper Stock for Packaging Boxes",
    category: "Printing & Packaging",
    status: "Active",
    date: "10 Nov 2024",
    author: "Gertrude Bowie",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60",
    excerpt: "Understanding GSM, calipers, Duplex vs Ivory, and corrugated fluting for maximum durability.",
    tags: ["Packaging", "Paper", "Duplex"],
    content: "Packaging structural rigidity depends heavily on choosing between 310gsm Ivory board vs Kraft fluting...",
  },
  {
    id: 5,
    title: "Automating Quotations & Work Orders with Nuxt ERP",
    category: "Features",
    status: "Active",
    date: "02 Nov 2024",
    author: "David Tan",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    excerpt: "Eliminate manual calculator errors by utilizing dynamic paper cost formulas and automated job ticket generation.",
    tags: ["ERP", "Automation", "Workflow"],
    content: "Direct calculation algorithms allow real-time margin adjustments and fast customer estimates...",
  },
]);

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
}
</script>
