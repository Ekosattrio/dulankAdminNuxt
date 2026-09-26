<template>
  <div class="page-wrapper">
    <div class="content">
      <div class="page-header mt-3">
        <div class="page-title">
          <h4>Banners Management</h4>
          <h6>Manage store main hero sliders and product promo banners</h6>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <!-- Main Banner Section -->
        <div class="col-lg-6">
          <div class="card h-100 shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
              <h5 class="card-title mb-0 fw-bold">Main Banner</h5>
              <button type="button" class="btn btn-sm btn-primary" @click="openAddModal('main')">
                <i class="ti ti-plus me-1"></i>Add Main Banner
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div v-for="b in mainBanners" :key="b.id" class="col-12">
                  <div class="card border mb-0 overflow-hidden">
                    <div class="position-relative">
                      <img
                        :src="b.src"
                        :alt="b.title"
                        class="w-100 object-fit-cover"
                        style="height: 180px;"
                      />
                      <span class="position-absolute top-2 start-2 badge bg-dark bg-opacity-75 text-white fs-11">
                        {{ b.id }}
                      </span>
                      <div class="position-absolute top-2 end-2 d-flex gap-2">
                        <button
                          type="button"
                          class="btn btn-light btn-sm shadow-sm py-1 px-2"
                          title="Edit"
                          @click="openEditModal(b, 'main')"
                        >
                          <i class="ti ti-edit fs-14"></i>
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm shadow-sm py-1 px-2"
                          title="Delete"
                          @click="deleteBanner(b.id, 'main')"
                        >
                          <i class="ti ti-trash fs-14"></i>
                        </button>
                      </div>
                    </div>
                    <div class="card-body p-3">
                      <h6 class="fw-bold mb-1">{{ b.title || 'Untitled Banner' }}</h6>
                      <p class="text-muted small mb-2">{{ b.desc || 'No description provided' }}</p>
                      <div class="d-flex flex-wrap gap-2 text-muted fs-12 border-top pt-2">
                        <span><i class="ti ti-calendar-event me-1"></i>Start: {{ formatDate(b.start) }}</span>
                        <span><i class="ti ti-calendar-off me-1"></i>End: {{ formatDate(b.end) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="mainBanners.length === 0" class="col-12 text-center py-5 text-muted">
                  <i class="ti ti-photo-off fs-1 text-muted"></i>
                  <p class="mt-2">No main banners added yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Banner Section -->
        <div class="col-lg-6">
          <div class="card h-100 shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
              <h5 class="card-title mb-0 fw-bold">Product Banner</h5>
              <button type="button" class="btn btn-sm btn-primary" @click="openAddModal('product')">
                <i class="ti ti-plus me-1"></i>Add Product Banner
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div v-for="b in productBanners" :key="b.id" class="col-12">
                  <div class="card border mb-0 overflow-hidden">
                    <div class="position-relative">
                      <img
                        :src="b.src"
                        :alt="b.title"
                        class="w-100 object-fit-cover"
                        style="height: 180px;"
                      />
                      <span class="position-absolute top-2 start-2 badge bg-dark bg-opacity-75 text-white fs-11">
                        {{ b.id }}
                      </span>
                      <div class="position-absolute top-2 end-2 d-flex gap-2">
                        <button
                          type="button"
                          class="btn btn-light btn-sm shadow-sm py-1 px-2"
                          title="Edit"
                          @click="openEditModal(b, 'product')"
                        >
                          <i class="ti ti-edit fs-14"></i>
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm shadow-sm py-1 px-2"
                          title="Delete"
                          @click="deleteBanner(b.id, 'product')"
                        >
                          <i class="ti ti-trash fs-14"></i>
                        </button>
                      </div>
                    </div>
                    <div class="card-body p-3">
                      <h6 class="fw-bold mb-1">{{ b.title || 'Untitled Banner' }}</h6>
                      <p class="text-muted small mb-2">{{ b.desc || 'No description provided' }}</p>
                      <div class="d-flex flex-wrap gap-2 text-muted fs-12 border-top pt-2">
                        <span><i class="ti ti-calendar-event me-1"></i>Start: {{ formatDate(b.start) }}</span>
                        <span><i class="ti ti-calendar-off me-1"></i>End: {{ formatDate(b.end) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="productBanners.length === 0" class="col-12 text-center py-5 text-muted">
                  <i class="ti ti-photo-off fs-1 text-muted"></i>
                  <p class="mt-2">No product banners added yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Banner Modal -->
    <div
      v-if="modalVisible"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Banner' : 'Add Banner' }} ({{ targetType === 'main' ? 'Main' : 'Product' }})</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveBanner">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label">Image URL</label>
                  <input
                    v-model="form.src"
                    class="form-control"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Upload Preset</label>
                  <select class="form-select" @change="applySampleImage($event)">
                    <option value="">Select Sample...</option>
                    <option value="https://percetakan-dulank.netlify.app/images/brosur.jpg">Brosur Promo</option>
                    <option value="https://percetakan-dulank.netlify.app/images/yasin.jpg">Buku Yasin</option>
                    <option value="https://percetakan-dulank.netlify.app/images/kaos.jpg">Kaos Custom</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Title</label>
                  <input v-model="form.title" class="form-control" placeholder="Optional promo title" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Description</label>
                  <input v-model="form.desc" class="form-control" placeholder="Optional description / tagline" />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Start Date & Time</label>
                  <input v-model="form.start" type="datetime-local" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">End Date & Time</label>
                  <input v-model="form.end" type="datetime-local" class="form-control" />
                </div>

                <div class="col-12">
                  <label class="form-label">Banner Preview</label>
                  <div class="p-2 border rounded text-center bg-light">
                    <img
                      v-if="form.src"
                      :src="form.src"
                      alt="Banner Preview"
                      class="img-fluid rounded"
                      style="max-height: 200px; object-fit: contain;"
                    />
                    <span v-else class="text-muted small">No image URL specified</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update Banner' : 'Submit Banner' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface BannerItem {
  id: string
  src: string
  title: string
  desc: string
  start: string
  end: string
  created: string
}

const mainBanners = ref<BannerItem[]>([
  {
    id: 'm1',
    src: 'https://percetakan-dulank.netlify.app/images/brosur.jpg',
    title: 'Promo Utama 1',
    desc: 'Diskon besar-besaran cetak brosur A4 & A5',
    start: '2024-11-01T08:00',
    end: '2024-12-31T23:59',
    created: '2024-11-01T08:00'
  },
  {
    id: 'm2',
    src: 'https://percetakan-dulank.netlify.app/images/yasin.jpg',
    title: 'Promo Utama 2',
    desc: 'Penawaran terbatas cetak buku Yasin hard cover',
    start: '2024-11-05T08:00',
    end: '2024-12-25T23:59',
    created: '2024-11-05T08:00'
  }
])

const productBanners = ref<BannerItem[]>([
  {
    id: 'p1',
    src: 'https://percetakan-dulank.netlify.app/images/yasin.jpg',
    title: 'Produk Pilihan',
    desc: 'Koleksi blangko dan cover terlengkap',
    start: '2024-11-10T08:00',
    end: '2024-12-20T23:59',
    created: '2024-11-10T08:00'
  },
  {
    id: 'p2',
    src: 'https://percetakan-dulank.netlify.app/images/kaos.jpg',
    title: 'Diskon Sablon Kaos',
    desc: 'Hemat biaya cetak sablon DTF lusinan',
    start: '2024-11-15T08:00',
    end: '2024-12-15T23:59',
    created: '2024-11-15T08:00'
  }
])

const modalVisible = ref(false)
const isEdit = ref(false)
const targetType = ref<'main' | 'product'>('main')
const currentId = ref<string | null>(null)

const form = ref({
  src: '',
  title: '',
  desc: '',
  start: '',
  end: ''
})

function formatDate(val: string) {
  if (!val) return '-'
  try {
    const d = new Date(val)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return val
  }
}

function openAddModal(type: 'main' | 'product') {
  isEdit.value = false
  targetType.value = type
  currentId.value = null
  form.value = {
    src: 'https://percetakan-dulank.netlify.app/images/brosur.jpg',
    title: '',
    desc: '',
    start: new Date().toISOString().slice(0, 16),
    end: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16)
  }
  modalVisible.value = true
}

function openEditModal(b: BannerItem, type: 'main' | 'product') {
  isEdit.value = true
  targetType.value = type
  currentId.value = b.id
  form.value = {
    src: b.src,
    title: b.title,
    desc: b.desc,
    start: b.start ? b.start.slice(0, 16) : '',
    end: b.end ? b.end.slice(0, 16) : ''
  }
  modalVisible.value = true
}

function applySampleImage(e: Event) {
  const select = e.target as HTMLSelectElement
  if (select.value) {
    form.value.src = select.value
  }
}

function closeModal() {
  modalVisible.value = false
}

function saveBanner() {
  const targetList = targetType.value === 'main' ? mainBanners : productBanners
  if (isEdit.value && currentId.value !== null) {
    const idx = targetList.value.findIndex(b => b.id === currentId.value)
    if (idx !== -1) {
      targetList.value[idx] = {
        ...targetList.value[idx],
        src: form.value.src,
        title: form.value.title,
        desc: form.value.desc,
        start: form.value.start,
        end: form.value.end
      }
    }
  } else {
    const prefix = targetType.value === 'main' ? 'm' : 'p'
    const newId = `${prefix}${Date.now()}`
    targetList.value.push({
      id: newId,
      src: form.value.src,
      title: form.value.title,
      desc: form.value.desc,
      start: form.value.start,
      end: form.value.end,
      created: new Date().toISOString()
    })
  }
  closeModal()
}

function deleteBanner(id: string, type: 'main' | 'product') {
  if (confirm('Are you sure you want to delete this banner?')) {
    if (type === 'main') {
      mainBanners.value = mainBanners.value.filter(b => b.id !== id)
    } else {
      productBanners.value = productBanners.value.filter(b => b.id !== id)
    }
  }
}
</script>

