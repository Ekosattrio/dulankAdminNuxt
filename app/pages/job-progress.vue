<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Job Progress List</h4>
            <h6>Monitor real-time status of individual production stages</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
      </div>

      <!-- KPI Card -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
              <i class="ti ti-activity fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Job Progress</div>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search progress code, product, or operator..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterProcess" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Processes</option>
                <option value="Printing">Printing</option>
                <option value="Cutting">Cutting</option>
                <option value="Finishing">Finishing</option>
                <option value="Laminating">Laminating</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th># Progress</th>
                  <th>Product</th>
                  <th>Product Description</th>
                  <th>Job Process</th>
                  <th>Completed By</th>
                  <th>Time Completed</th>
                  <th>Note</th>
                  <th class="text-center" style="width: 80px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredList" :key="item.id">
                  <td class="fw-bold text-primary">{{ item.progressCode }}</td>
                  <td class="fw-semibold text-dark">{{ item.product }}</td>
                  <td class="small text-muted" style="max-width: 280px;">{{ item.description }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.process }}</span>
                  </td>
                  <td>{{ item.completedBy || '-' }}</td>
                  <td class="small">{{ item.time || '-' }}</td>
                  <td class="small fst-italic">{{ item.note || '-' }}</td>
                  <td class="text-center action-table-data">
                    <button
                      class="btn btn-sm"
                      :class="item.isCompleted ? 'btn-success text-white' : 'btn-outline-secondary'"
                      :title="item.isCompleted ? 'Completed' : 'Mark as Completed'"
                      @click="toggleComplete(item)"
                    >
                      <i :class="item.isCompleted ? 'ti ti-circle-check' : 'ti ti-circle'"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">
                    No progress entries found.
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

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Job Progress List - Kacetak System'
})

const { data: jobProgressData } = await useFetch<JobProgressItem[]>('/api/job-progress')
const progressList = ref<JobProgressItem[]>(jobProgressData.value ?? [])
useMockSync('job-progress', progressList)

const searchQuery = ref('')
const filterProcess = ref('')

const filteredList = computed(() => {
  return progressList.value.filter(p => {
    const matchSearch =
      p.progressCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.completedBy.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchProc = filterProcess.value ? p.process === filterProcess.value : true
    return matchSearch && matchProc
  })
})

function toggleComplete(item: JobProgressItem) {
  item.isCompleted = !item.isCompleted
  if (item.isCompleted) {
    item.completedBy = 'Current User'
    item.time = new Date().toLocaleString()
  } else {
    item.completedBy = ''
    item.time = ''
  }
}

function exportPdf() {
  alert('Exporting Job Progress PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterProcess.value = ''
}</script>

