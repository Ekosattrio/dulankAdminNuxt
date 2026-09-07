<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Job Branch</h4>
            <h6>Manage job distribution and branch operations</h6>
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
        <div class="page-btn">
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="historyModalVisible = true">
            <i class="ti ti-history me-1"></i>History Job Branch
          </button>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search job, branch, customer, flow..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterBranch" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Branches</option>
                <option value="Dulank Karawang">Dulank Karawang</option>
                <option value="Dulank Jakarta">Dulank Jakarta</option>
                <option value="Dulank Cirebon">Dulank Cirebon</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No Job</th>
                  <th>Branch</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Flow Name</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in filteredJobs" :key="job.id">
                  <td class="fw-bold text-primary">{{ job.jobNo }}</td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ job.branch }}</span>
                  </td>
                  <td class="fw-semibold text-dark">{{ job.customer }}</td>
                  <td>{{ job.product }}</td>
                  <td>{{ job.flowName }}</td>
                  <td>
                    <span :class="getPriorityBadge(job.priority)">{{ job.priority }}</span>
                  </td>
                  <td>
                    <span :class="getStatusBadge(job.status)">{{ job.status }}</span>
                  </td>
                  <td class="text-center action-table-data">
                    <button class="btn btn-sm btn-icon text-primary" title="Setting Detail Job" @click="openSettingModal(job)">
                      <i class="ti ti-settings"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredJobs.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">
                    No jobs found matching criteria.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- History Job Branch Modal -->
    <div v-if="historyModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">History Job Branch</h5>
            <button type="button" class="btn-close" @click="historyModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0">
            <div class="table-responsive mb-3">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Branch</th>
                    <th>Customer</th>
                    <th>Flow Name</th>
                    <th>Date Finish</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hist in historyData" :key="hist.id">
                    <td>{{ hist.date }}</td>
                    <td><span class="badge bg-light text-dark border">{{ hist.branch }}</span></td>
                    <td>{{ hist.customer }}</td>
                    <td>{{ hist.flowName }}</td>
                    <td class="fw-semibold text-success">{{ hist.dateFinish }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="historyModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Setting Detail Job Branch Modal -->
    <div v-if="settingModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Setting Detail Job Branch: {{ selectedJob?.jobNo }}</h5>
            <button type="button" class="btn-close" @click="settingModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedJob">
            <div class="p-3 bg-light rounded-3 mb-4">
              <div class="row g-2 small">
                <div class="col-sm-3 text-muted">Job Title:</div>
                <div class="col-sm-9 fw-bold">{{ selectedJob.product }}</div>
                <div class="col-sm-3 text-muted">Customer:</div>
                <div class="col-sm-9">{{ selectedJob.customer }}</div>
                <div class="col-sm-3 text-muted">Flow Process:</div>
                <div class="col-sm-9 fw-bold text-primary">{{ selectedJob.flowName }}</div>
                <div class="col-sm-3 text-muted">Branch:</div>
                <div class="col-sm-9">{{ selectedJob.branch }}</div>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Priority</label>
              <select v-model="selectedJob.priority" class="form-select form-select-sm">
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Reguler">Reguler</option>
              </select>
            </div>

            <!-- Parameters Checklist -->
            <h6 class="fw-bold mb-2">Process Information & Specifications</h6>
            <div class="d-flex flex-column gap-2 mb-3">
              <div v-for="(spec, idx) in jobSpecs" :key="idx" class="d-flex align-items-center gap-2">
                <input v-model="spec.label" type="text" class="form-control form-control-sm" style="width: 180px;" placeholder="Label" />
                <input v-model="spec.value" type="text" class="form-control form-control-sm flex-grow-1" placeholder="Value" />
                <button type="button" class="btn btn-sm btn-icon text-danger" @click="removeSpec(idx)"><i class="ti ti-trash"></i></button>
              </div>
            </div>
            <button type="button" class="btn btn-link text-primary p-0 small text-decoration-none mb-4" @click="addSpec">
              <i class="ti ti-plus me-1"></i>Add Information Field
            </button>

            <!-- Assignee List -->
            <h6 class="fw-bold mb-2">Assignee List</h6>
            <div class="mb-4">
              <input v-model="assigneesText" type="text" class="form-control form-control-sm" placeholder="e.g. Abdul, Nurdin, Arif (comma separated)" />
            </div>

            <!-- Incentive Settings -->
            <h6 class="fw-bold mb-2">Incentive Setting</h6>
            <div class="row g-2 align-items-center mb-3">
              <div class="col-sm-4">
                <label class="form-label small text-muted mb-0">Incentive Amount (Rp)</label>
              </div>
              <div class="col-sm-4">
                <input v-model.number="incentiveAmount" type="number" class="form-control form-control-sm" />
              </div>
              <div class="col-sm-4">
                <select v-model="incentiveUnit" class="form-select form-select-sm">
                  <option value="Job">Per Job</option>
                  <option value="Qty">Per Qty</option>
                  <option value="Rim">Per Rim</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="settingModalVisible = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveJobSetting">Save Changes</button>
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
  title: 'Job Branch - Kacetak System'
})

interface JobBranchItem {
  id: number
  jobNo: string
  branch: string
  customer: string
  product: string
  flowName: string
  priority: 'Urgent' | 'High' | 'Reguler'
  status: 'Waiting' | 'On Process' | 'Complete'
}

const jobs = ref<JobBranchItem[]>([
  { id: 1, jobNo: 'JOB-2510000001', branch: 'Dulank Karawang', customer: 'PT Makmur Abadi', product: 'Brosur A5', flowName: 'Cetak Multilith', priority: 'High', status: 'Waiting' },
  { id: 2, jobNo: 'JOB-2510000002', branch: 'Dulank Jakarta', customer: 'PT Makmur Abadi', product: 'Spanduk 3x1', flowName: 'Cetak Outdoor', priority: 'Urgent', status: 'On Process' },
  { id: 3, jobNo: 'JOB-2510000003', branch: 'Dulank Cirebon', customer: 'PT Makmur Abadi', product: 'Kartu Nama', flowName: 'Print A3', priority: 'Reguler', status: 'On Process' },
  { id: 4, jobNo: 'JOB-2510000004', branch: 'Dulank Karawang', customer: 'CV Cahaya Baru', product: 'Kwitansi NCR', flowName: 'Cetak Multilith', priority: 'High', status: 'Waiting' },
  { id: 5, jobNo: 'JOB-2510000005', branch: 'Dulank Karawang', customer: 'CV Cahaya Baru', product: 'Poster Display', flowName: 'Print A3', priority: 'Urgent', status: 'Waiting' }
])

const searchQuery = ref('')
const filterBranch = ref('')

const filteredJobs = computed(() => {
  return jobs.value.filter(j => {
    const matchSearch =
      j.jobNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.flowName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchBranch = filterBranch.value ? j.branch === filterBranch.value : true
    return matchSearch && matchBranch
  })
})

function getPriorityBadge(priority: string) {
  if (priority === 'Urgent') return 'badge bg-danger bg-opacity-10 text-danger border border-danger'
  if (priority === 'High') return 'badge bg-warning bg-opacity-10 text-warning border border-warning'
  return 'badge bg-info bg-opacity-10 text-info border border-info'
}

function getStatusBadge(status: string) {
  if (status === 'Complete') return 'badge bg-success'
  if (status === 'On Process') return 'badge bg-primary'
  return 'badge bg-secondary'
}

// History Modal
const historyModalVisible = ref(false)
const historyData = ref([
  { id: 1, date: '25/12/2026', branch: 'Dulank Karawang', customer: 'PT Makmur Abadi', flowName: 'Cetak Multilith', dateFinish: '27/12/2026' },
  { id: 2, date: '26/12/2026', branch: 'Dulank Jakarta', customer: 'PT Makmur Abadi', flowName: 'Cetak Outdoor', dateFinish: '28/12/2026' },
  { id: 3, date: '27/12/2026', branch: 'Dulank Cirebon', customer: 'PT Makmur Abadi', flowName: 'Print A3', dateFinish: '29/12/2026' }
])

// Setting Modal
const settingModalVisible = ref(false)
const selectedJob = ref<JobBranchItem | null>(null)
const assigneesText = ref('Abdul, Nurdin')
const incentiveAmount = ref(1500)
const incentiveUnit = ref('Job')

const jobSpecs = ref([
  { label: 'Jumlah Plat', value: '2' },
  { label: 'Warna Cetak', value: 'Hitam' },
  { label: 'Sisi Cetak', value: '1 Sisi' },
  { label: 'Sample Warna', value: 'Tidak Ada' }
])

function openSettingModal(job: JobBranchItem) {
  selectedJob.value = job
  settingModalVisible.value = true
}

function addSpec() {
  jobSpecs.value.push({ label: '', value: '' })
}

function removeSpec(idx: number) {
  jobSpecs.value.splice(idx, 1)
}

function saveJobSetting() {
  alert('Job branch configurations successfully updated!')
  settingModalVisible.value = false
}

function exportPdf() {
  alert('Exporting Job Branch PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterBranch.value = ''
}
</script>
