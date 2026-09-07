<template>
  <div class="page-wrapper mt-3">
    <div class="content settings-content">
      <div class="page-header settings-pg-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <div class="setting-title mb-3">
                <h4 class="fs-18 fw-bold">Language</h4>
              </div>

              <div class="page-header d-flex justify-content-between align-items-center mb-3">
                <ul class="table-top-head list-unstyled d-flex gap-2 mb-0">
                  <li>
                    <a href="javascript:void(0);" title="Pdf" class="btn btn-outline-secondary btn-sm" @click="exportPdf">
                      <i class="ti ti-file-type-pdf text-danger"></i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" title="Print" class="btn btn-outline-secondary btn-sm" @click="printPage">
                      <i class="ti ti-printer"></i>
                    </a>
                  </li>
                </ul>
                <div class="page-btn d-flex align-items-center gap-2">
                  <select v-model="selectedLanguage" class="form-select form-select-sm" style="width: 160px;">
                    <option value="">Select Language</option>
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="zh">Chinese</option>
                    <option value="id">Indonesian</option>
                  </select>
                  <button class="btn btn-primary btn-sm" @click="showAddModal = true">
                    <i class="ti ti-circle-plus me-1"></i>Add Translation
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <div class="card table-list-card shadow-sm border">
                    <div class="card-body">
                      <div class="table-top d-flex justify-content-between align-items-center mb-3">
                        <div class="search-set">
                          <div class="input-group">
                            <span class="input-group-text bg-white"><i class="ti ti-search"></i></span>
                            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search language..." />
                          </div>
                        </div>
                        <div>
                          <button class="btn btn-secondary btn-sm" @click="importSample">
                            <i class="ti ti-file-import me-1"></i>Import Sample
                          </button>
                        </div>
                      </div>

                      <div class="table-responsive">
                        <table class="table table-hover align-middle">
                          <thead class="table-light">
                            <tr>
                              <th>Language</th>
                              <th>Code</th>
                              <th>RTL</th>
                              <th>Total</th>
                              <th>Done</th>
                              <th>Progress</th>
                              <th>Status</th>
                              <th class="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="lang in filteredLanguages" :key="lang.code">
                              <td>
                                <div class="d-flex align-items-center gap-2">
                                  <img :src="lang.flag" :alt="lang.name" style="width: 24px; height: 18px; object-fit: cover;" class="rounded border" />
                                  <span class="fw-semibold">{{ lang.name }}</span>
                                </div>
                              </td>
                              <td><span class="badge bg-light text-dark font-monospace">{{ lang.code }}</span></td>
                              <td>
                                <div class="form-check form-switch mb-0">
                                  <input v-model="lang.rtl" class="form-check-input" type="checkbox" role="switch" />
                                </div>
                              </td>
                              <td>{{ lang.total }}</td>
                              <td>{{ lang.done }}</td>
                              <td style="min-width: 140px;">
                                <div class="d-flex align-items-center gap-2">
                                  <div class="progress flex-grow-1" style="height: 6px;">
                                    <div
                                      class="progress-bar"
                                      :class="lang.progress >= 80 ? 'bg-success' : lang.progress >= 40 ? 'bg-warning' : 'bg-primary'"
                                      :style="{ width: `${lang.progress}%` }"
                                    ></div>
                                  </div>
                                  <span class="text-xs text-muted">{{ lang.progress }}%</span>
                                </div>
                              </td>
                              <td>
                                <span :class="lang.status === 'Active' ? 'badge bg-success' : 'badge bg-secondary'">
                                  {{ lang.status }}
                                </span>
                              </td>
                              <td class="text-end">
                                <div class="d-flex align-items-center justify-content-end gap-2">
                                  <button class="btn btn-sm btn-outline-secondary" title="Download" @click="downloadStrings(lang)">
                                    <i class="ti ti-download"></i>
                                  </button>
                                  <NuxtLink to="/language-settings-web" class="btn btn-sm btn-outline-primary">Web</NuxtLink>
                                  <button class="btn btn-sm btn-outline-primary" @click="openScope(lang, 'App')">App</button>
                                  <button class="btn btn-sm btn-outline-primary" @click="openScope(lang, 'Admin')">Admin</button>
                                  <button class="btn btn-sm btn-outline-danger" title="Delete" @click="deleteLanguage(lang.code)">
                                    <i class="ti ti-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr v-if="filteredLanguages.length === 0">
                              <td colspan="8" class="text-center py-4 text-muted">No languages found.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Add Language Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Add Translation Language</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <form @submit.prevent="addLanguage">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Language Name <span class="text-danger">*</span></label>
                  <input v-model="newLang.name" type="text" class="form-control" placeholder="e.g. Indonesian" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Language Code <span class="text-danger">*</span></label>
                  <input v-model="newLang.code" type="text" class="form-control" placeholder="e.g. id" required />
                </div>
                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input v-model="newLang.rtl" class="form-check-input" type="checkbox" role="switch" id="rtlSwitch" />
                    <label class="form-check-label" for="rtlSwitch">Right-to-Left (RTL) Layout</label>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showAddModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Language</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Language Settings - Kacetak System'
})

interface LanguageItem {
  name: string
  code: string
  flag: string
  rtl: boolean
  total: number
  done: number
  progress: number
  status: 'Active' | 'Inactive'
}

const languages = ref<LanguageItem[]>([
  {
    name: 'English',
    code: 'en',
    flag: '/assets/img/icons/flag-01.svg',
    rtl: false,
    total: 2145,
    done: 1815,
    progress: 80,
    status: 'Active'
  },
  {
    name: 'Arabic',
    code: 'ar',
    flag: '/assets/img/icons/flag-02.svg',
    rtl: true,
    total: 2045,
    done: 2045,
    progress: 100,
    status: 'Inactive'
  },
  {
    name: 'Chinese',
    code: 'zh',
    flag: '/assets/img/icons/flag-03.svg',
    rtl: false,
    total: 2245,
    done: 295,
    progress: 5,
    status: 'Active'
  },
  {
    name: 'Hindi',
    code: 'hi',
    flag: '/assets/img/icons/flag-04.svg',
    rtl: false,
    total: 2535,
    done: 1145,
    progress: 40,
    status: 'Active'
  }
])

const searchQuery = ref('')
const selectedLanguage = ref('')
const showAddModal = ref(false)

const newLang = ref({
  name: '',
  code: '',
  rtl: false
})

const filteredLanguages = computed(() => {
  return languages.value.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           item.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const addLanguage = () => {
  languages.value.push({
    name: newLang.value.name,
    code: newLang.value.code.toLowerCase(),
    flag: '/assets/img/icons/flag-01.svg',
    rtl: newLang.value.rtl,
    total: 2145,
    done: 0,
    progress: 0,
    status: 'Active'
  })
  showAddModal.value = false
  newLang.value = { name: '', code: '', rtl: false }
  alert('Language added successfully!')
}

const deleteLanguage = (code: string) => {
  if (confirm('Are you sure you want to remove this language?')) {
    languages.value = languages.value.filter(l => l.code !== code)
  }
}

const downloadStrings = (lang: LanguageItem) => {
  alert(`Exporting translation JSON for ${lang.name}...`)
}

const openScope = (lang: LanguageItem, scope: string) => {
  alert(`Editing ${scope} translations for ${lang.name}`)
}

const importSample = () => {
  alert('Sample translations imported successfully!')
}

const exportPdf = () => {
  alert('Exporting PDF...')
}

const printPage = () => {
  window.print()
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>

