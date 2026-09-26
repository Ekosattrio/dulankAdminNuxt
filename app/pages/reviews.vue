<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Product Reviews</h4>
            <h6>Manage customer ratings, product feedback, and testimonial publication</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
      </div>

      <!-- Dashboard Metric Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-messages fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Reviews</h6>
              <h4 class="fw-bold mb-0">{{ reviews.length }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash1 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-warning bg-opacity-10 p-3 rounded">
              <i class="ti ti-star fs-2 text-warning"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Average Rating</h6>
              <h4 class="fw-bold mb-0">{{ avgRating }} / 5.0</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-sm-6 col-12 d-flex">
          <div class="dash-widget dash2 w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-circle-check fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Published Reviews</h6>
              <h4 class="fw-bold mb-0">{{ publishedCount }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search product, user or review text..."
                />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2 flex-wrap">
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="ratingDropdownOpen = !ratingDropdownOpen"
                >
                  Rating: {{ filterRating ? `${filterRating} Stars` : "All Ratings" }}
                </button>
                <ul v-if="ratingDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute">
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterRating = null;
                        ratingDropdownOpen = false;
                      "
                      >All Ratings</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterRating = 5;
                        ratingDropdownOpen = false;
                      "
                      >5 Stars</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterRating = 4;
                        ratingDropdownOpen = false;
                      "
                      >4 Stars</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterRating = 3;
                        ratingDropdownOpen = false;
                      "
                      >3 Stars</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterRating = 2;
                        ratingDropdownOpen = false;
                      "
                      >2 Stars</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterRating = 1;
                        ratingDropdownOpen = false;
                      "
                      >1 Star</a
                    >
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <button
                  class="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || "All Status" }}
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu show" style="display: block; position: absolute">
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = '';
                        statusDropdownOpen = false;
                      "
                      >All Status</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Publish';
                        statusDropdownOpen = false;
                      "
                      >Publish</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="javascript:void(0);"
                      @click="
                        filterStatus = 'Archived';
                        statusDropdownOpen = false;
                      "
                      >Archived</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>User</th>
                  <th>Product Code</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Rating</th>
                  <th>Title</th>
                  <th style="min-width: 250px">Review Content</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 80px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in filteredReviews" :key="r.id">
                  <td class="fw-medium text-dark">{{ r.user }}</td>
                  <td>
                    <span class="badge bg-light text-dark font-monospace">{{ r.productCode }}</span>
                  </td>
                  <td class="fw-semibold text-dark">{{ r.product }}</td>
                  <td>{{ r.date }}</td>
                  <td>
                    <div class="d-flex text-warning gap-1">
                      <i
                        v-for="star in 5"
                        :key="star"
                        class="ti ti-star-filled"
                        :class="{ 'text-muted opacity-25': star > r.rating }"
                      ></i>
                    </div>
                  </td>
                  <td class="fw-semibold">{{ r.title }}</td>
                  <td class="small text-muted text-wrap">{{ r.content }}</td>
                  <td>
                    <select v-model="r.status" class="form-select form-select-sm" style="width: 110px">
                      <option value="Publish">Publish</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete review"
                        @click="deleteReview(r.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredReviews.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No reviews found matching filter criteria.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface ReviewItem {
  id: number;
  user: string;
  productCode: string;
  product: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  status: "Publish" | "Archived";
}

const reviews = ref<ReviewItem[]>([
  {
    id: 1,
    user: "john.doe@email.com",
    productCode: "P-101",
    product: "Brosur Full Color A4",
    date: "2025-09-30",
    rating: 5,
    title: "Suka banget!",
    content: "Kualitas cetaknya bagus, warnanya cerah, dan pengiriman cepat.",
    status: "Publish",
  },
  {
    id: 2,
    user: "jane.smith@email.com",
    productCode: "P-102",
    product: "Label Tag Hangtag",
    date: "2025-09-29",
    rating: 3,
    title: "Cukup OK",
    content: "Labelnya lumayan, tapi ada sedikit goresan di beberapa tag.",
    status: "Publish",
  },
  {
    id: 3,
    user: "david.williams@email.com",
    productCode: "P-103",
    product: "Label Product Vinyl",
    date: "2025-09-29",
    rating: 1,
    title: "Kecewa",
    content: "Produk yang datang tidak sesuai dengan deskripsi, ukurannya salah potong.",
    status: "Publish",
  },
  {
    id: 4,
    user: "sarah.jones@email.com",
    productCode: "P-104",
    product: "Brosur Full Color A4",
    date: "2025-09-28",
    rating: 5,
    title: "Sangat Puas",
    content: "Hasil cetak brosur sangat profesional, desain terlihat mewah.",
    status: "Publish",
  },
  {
    id: 5,
    user: "michael.brown@email.com",
    productCode: "P-105",
    product: "Label Tag Baju",
    date: "2025-09-27",
    rating: 4,
    title: "Bagus",
    content: "Bahannya kuat dan tidak mudah robek. Pengiriman standar.",
    status: "Archived",
  },
  {
    id: 6,
    user: "emily.davis@email.com",
    productCode: "P-106",
    product: "Kartu Nama Premium",
    date: "2025-09-27",
    rating: 5,
    title: "Perfect!",
    content: "Kartu namanya elegan, hasil emboss-nya rapi. Sangat merekomendasikan!",
    status: "Archived",
  },
  {
    id: 7,
    user: "chris.wilson@email.com",
    productCode: "P-107",
    product: "Amplop Custom Kop Surat",
    date: "2025-09-26",
    rating: 2,
    title: "Perlu ditingkatkan",
    content: "Lem pada amplop kurang rekat, beberapa amplop sudah terbuka saat diterima.",
    status: "Archived",
  },
  {
    id: 8,
    user: "olivia.moore@email.com",
    productCode: "P-108",
    product: "Banner Roll-Up Aluminium",
    date: "2025-09-26",
    rating: 5,
    title: "Kualitas Terbaik",
    content: "Banner-nya tebal dan kokoh, cetakan tidak pecah. Pelayanan cepat.",
    status: "Archived",
  },
  {
    id: 9,
    user: "james.taylor@email.com",
    productCode: "P-109",
    product: "Stiker Vinyl Kromo",
    date: "2025-09-25",
    rating: 4,
    title: "Cepat dan Akurat",
    content: "Pemotongan stikernya presisi, hanya saja pengemasan kurang aman.",
    status: "Archived",
  },
]);

const searchQuery = ref("");
const filterRating = ref<number | null>(null);
const filterStatus = ref("");
const ratingDropdownOpen = ref(false);
const statusDropdownOpen = ref(false);

const avgRating = computed(() => {
  if (!reviews.value.length) return "0.0";
  const total = reviews.value.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews.value.length).toFixed(1);
});

const publishedCount = computed(() => reviews.value.filter((r) => r.status === "Publish").length);

const filteredReviews = computed(() => {
  return reviews.value.filter((r) => {
    const matchRating = filterRating.value === null || r.rating === filterRating.value;
    const matchStatus = !filterStatus.value || r.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      r.user.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchRating && matchStatus && matchSearch;
  });
});

function deleteReview(id: number) {
  if (confirm("Delete this customer review?")) {
    reviews.value = reviews.value.filter((r) => r.id !== id);
  }
}

function refresh() {
  searchQuery.value = "";
  filterRating.value = null;
  filterStatus.value = "";
}
</script>
