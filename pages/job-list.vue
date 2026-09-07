<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>All Job List</h4>
            <h6>Manage and review finished production workflows</h6>
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

      <div class="row g-3">
        <!-- Left Panel: All Flow List -->
        <div class="col-xl-3 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 class="fw-bold mb-0">Production Flows</h6>
              <button v-if="selectedFlow" class="btn btn-sm btn-link text-danger p-0" @click="selectedFlow = ''">Reset</button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>All Flow</th>
                      <th class="text-end pe-3">Job Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="f in flowCategories"
                      :key="f.name"
                      class="cursor-pointer"
                      :class="{ 'table-active fw-bold text-primary': selectedFlow === f.name }"
                      style="cursor: pointer;"
                      @click="selectedFlow = (selectedFlow === f.name ? '' : f.name)"
                    >
                      <td class="ps-3">{{ f.name }}</td>
                      <td class="text-end pe-3">
                        <span class="badge" :class="selectedFlow === f.name ? 'bg-primary' : 'bg-light text-dark border'">
                          {{ f.count }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Main Job Table -->
        <div class="col-xl-9 col-lg-8">
          <div class="card table-list-card border-0 shadow-sm">
            <div class="card-body">
              <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                <div class="search-set d-flex align-items-center gap-2 flex-wrap">
                  <div class="search-input">
                    <span class="btn-searchset"><i class="ti ti-search"></i></span>
                    <input v-model="searchQuery" type="text" class="form-control" placeholder="Search order no, customer, product..." />
                  </div>
                </div>
                <div v-if="selectedFlow" class="badge bg-primary fs-6 px-3 py-2">
                  Flow Filter: {{ selectedFlow }}
                  <i class="ti ti-x ms-2" style="cursor: pointer;" @click="selectedFlow = ''"></i>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table datanew">
                  <thead class="thead-light">
                    <tr>
                      <th>No Job Order</th>
                      <th>Sales Date</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Flow</th>
                      <th>Flow Type</th>
                      <th>Assignee</th>
                      <th>Date Complete</th>
                      <th class="text-center" style="width: 70px;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="job in filteredJobs" :key="job.id">
                      <td class="fw-bold text-primary">{{ job.jobOrderNo }}</td>
                      <td>{{ job.salesDate }}</td>
                      <td class="fw-semibold text-dark">{{ job.customer }}</td>
                      <td>{{ job.product }}</td>
                      <td><span class="badge bg-light text-dark border">{{ job.flow }}</span></td>
                      <td>
                        <span :class="job.flowType === 'In-House' ? 'badge bg-success bg-opacity-10 text-success border border-success' : 'badge bg-warning bg-opacity-10 text-warning border border-warning'">
                          {{ job.flowType }}
                        </span>
                      </td>
                      <td>{{ job.assignee }}</td>
                      <td class="small">{{ job.dateComplete }}</td>
                      <td class="text-center action-table-data">
                        <button class="btn btn-sm btn-icon text-info" title="View Job Details" @click="viewJob(job)">
                          <i class="ti ti-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="filteredJobs.length === 0">
                      <td colspan="9" class="text-center py-4 text-muted">
                        No job orders found matching the filter criteria.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Job Details Modal (Printable) -->
    <div v-if="viewModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Job Sheet: {{ selectedJob?.jobOrderNo }}</h5>
            <button type="button" class="btn-close" @click="viewModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedJob">
            <div class="p-3 bg-light rounded-3 mb-4">
              <div class="row g-3">
                <div class="col-sm-6">
                  <div class="text-muted small">Customer</div>
                  <div class="fw-bold fs-6">{{ selectedJob.customer }}</div>
                  <div class="text-muted small">Sales Date: {{ selectedJob.salesDate }}</div>
                </div>
                <div class="col-sm-6 text-sm-end">
                  <div class="text-muted small">Completion Date</div>
                  <div class="fw-bold text-success">{{ selectedJob.dateComplete }}</div>
                  <div class="text-muted small">Assignee: {{ selectedJob.assignee }} ({{ selectedJob.flowType }})</div>
                </div>
              </div>
            </div>

            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Job Title / Product</th>
                  <th>Flow Process</th>
                  <th>Execution Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fw-bold">{{ selectedJob.product }}</td>
                  <td>{{ selectedJob.flow }}</td>
                  <td>{{ selectedJob.flowType }}</td>
                  <td><span class="badge bg-success">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer border-0 justify-content-between">
            <button type="button" class="btn btn-outline-secondary" @click="printTable">
              <i class="ti ti-printer me-1"></i>Print SPK Sheet
            </button>
            <button type="button" class="btn btn-secondary" @click="viewModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'All Job List - Kacetak System'
})

interface FlowCategoryCount {
  name: string
  count: number
}

const flowCategories = ref<FlowCategoryCount[]>([
  { name: 'Design', count: 252 },
  { name: 'Cetak SM 52', count: 15 },
  { name: 'Potong Sisir', count: 210 },
  { name: 'Cetak Outdoor', count: 56 },
  { name: 'Cetak A3+', count: 125 },
  { name: 'Cetak Multilith', count: 137 },
  { name: 'Finishing Komplit', count: 255 },
  { name: 'Sablon Kaos', count: 5 },
  { name: 'Laminating', count: 25 }
])

interface JobItem {
  id: number
  jobOrderNo: string
  salesDate: string
  customer: string
  product: string
  flow: string
  flowType: 'In-House' | 'Outsource'
  assignee: string
  dateComplete: string
}

const jobs = ref<JobItem[]>([
  { id: 1, jobOrderNo: 'JO-000000001', salesDate: '25/12/2025', customer: 'PT Makmur Abadi', product: 'Brosur A5', flow: 'Design', flowType: 'In-House', assignee: 'Bejo', dateComplete: '15/02/2026' },
  { id: 2, jobOrderNo: 'JO-000000002', salesDate: '25/12/2025', customer: 'PT Makmur Abadi', product: 'Brosur A5', flow: 'Cetak SM 52', flowType: 'Outsource', assignee: 'Nurdin', dateComplete: '16/02/2026' },
  { id: 3, jobOrderNo: 'JO-000000003', salesDate: '25/12/2025', customer: 'PT Makmur Abadi', product: 'Brosur A5', flow: 'Potong Sisir', flowType: 'In-House', assignee: 'Rapli', dateComplete: '17/02/2026' },
  { id: 4, jobOrderNo: 'JO-000000004', salesDate: '24/12/2025', customer: 'CV Cahaya Baru', product: 'Spanduk 3x1', flow: 'Cetak Outdoor', flowType: 'In-House', assignee: 'Dani', dateComplete: '18/02/2026' },
  { id: 5, jobOrderNo: 'JO-000000005', salesDate: '23/12/2025', customer: 'Toko Digital Jaya', product: 'Poster A3+', flow: 'Cetak A3+', flowType: 'In-House', assignee: 'Adul', dateComplete: '19/02/2026' }
])

const selectedFlow = ref('')
const searchQuery = ref('')

const filteredJobs = computed(() => {
  return jobs.value.filter(j => {
    const matchFlow = selectedFlow.value ? j.flow === selectedFlow.value : true
    const matchSearch =
      j.jobOrderNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.assignee.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchFlow && matchSearch
  })
})

const viewModalVisible = ref(false)
const selectedJob = ref<JobItem | null>(null)

function viewJob(job: JobItem) {
  selectedJob.value = job
  viewModalVisible.value = true
}

function exportPdf() {
  alert('Exporting Job List PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  selectedFlow.value = ''
  searchQuery.value = ''
}
</script>

