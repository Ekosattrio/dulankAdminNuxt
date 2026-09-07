<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <!-- Priority Filters Header -->
      <div class="d-flex align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
        <span class="me-3 fw-bold text-muted">Priority:</span>
        <div class="d-flex gap-2 flex-wrap">
          <button
            type="button"
            class="btn btn-sm px-4 rounded"
            :class="selectedPriority === 'all' ? 'btn-dark' : 'btn-outline-dark'"
            @click="selectedPriority = 'all'"
          >
            All
          </button>
          <button
            type="button"
            class="btn btn-sm px-4 rounded"
            :class="selectedPriority === 'urgent' ? 'btn-danger' : 'btn-outline-danger'"
            @click="selectedPriority = 'urgent'"
          >
            Urgent
          </button>
          <button
            type="button"
            class="btn btn-sm px-4 rounded"
            :class="selectedPriority === 'high' ? 'btn-info text-white' : 'btn-outline-info'"
            @click="selectedPriority = 'high'"
          >
            High
          </button>
          <button
            type="button"
            class="btn btn-sm px-4 rounded"
            :class="selectedPriority === 'normal' ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="selectedPriority = 'normal'"
          >
            Normal
          </button>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="text-muted mb-0">Your Assigned Jobs in Waiting / Active Queue</h6>
        <span class="badge bg-primary">{{ filteredJobs.length }} Tasks</span>
      </div>

      <!-- Job Cards Grid -->
      <div class="row g-4">
        <div v-for="job in filteredJobs" :key="job.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
          <div class="card h-100 rounded-3 shadow-sm" :class="getCardBorderClass(job.priority)">
            <div class="card-body d-flex flex-column p-3">
              <div class="border-bottom pb-2 mb-2">
                <small class="text-muted d-block" style="font-size: 11px">Flow Name :</small>
                <h6 class="fw-bold mb-0 fs-6 text-dark">{{ job.flowName }}</h6>
              </div>
              <div class="text-end mb-2">
                <span class="small fw-bold" :class="getPriorityTextClass(job.priority)"> Priority : {{ job.priority }} </span>
              </div>

              <div class="mb-2">
                <small class="text-muted d-block" style="font-size: 11px">Product</small>
                <p class="mb-0 fw-bold text-dark" style="font-size: 13px">{{ job.product }}</p>
              </div>
              <div class="mb-2">
                <small class="text-muted d-block" style="font-size: 11px">Job Title</small>
                <p class="mb-0 fw-semibold" style="font-size: 13px">{{ job.title }}</p>
              </div>
              <div class="mb-3">
                <small class="text-muted d-block" style="font-size: 11px">Description</small>
                <p class="text-muted mb-0 small" style="line-height: 1.4">
                  {{ job.description }}
                </p>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top gap-2">
                <div class="flex-grow-1">
                  <select v-model="job.status" class="form-select form-select-sm">
                    <option value="Waiting">Waiting</option>
                    <option value="On Process">On Process</option>
                    <option value="Complete">Complete</option>
                    <option value="Hold">Hold</option>
                  </select>
                </div>
                <button type="button" class="btn btn-sm btn-icon text-warning p-1" title="View Detail" @click="viewJob(job)">
                  <i class="ti ti-eye fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredJobs.length === 0" class="col-12 text-center py-5 text-muted">
          No jobs found for the selected priority.
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="viewModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Job Task Details</h5>
            <button type="button" class="btn-close" @click="viewModalVisible = false"></button>
          </div>
          <div class="modal-body pt-0" v-if="selectedJob">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Flow Operation</span>
                <span class="fw-bold">{{ selectedJob.flowName }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Product</span>
                <span>{{ selectedJob.product }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Job Title</span>
                <span class="fw-bold">{{ selectedJob.title }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Priority</span>
                <span :class="getPriorityTextClass(selectedJob.priority)">{{ selectedJob.priority }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Current Status</span>
                <span class="badge bg-primary">{{ selectedJob.status }}</span>
              </li>
              <li class="list-group-item">
                <div class="text-muted small mb-1">Specifications</div>
                <div>{{ selectedJob.description }}</div>
              </li>
            </ul>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="viewModalVisible = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "My Job - Kacetak System",
});

interface MyJobItem {
  id: number;
  flowName: string;
  priority: "Urgent" | "High" | "Normal";
  product: string;
  title: string;
  description: string;
  status: "Waiting" | "On Process" | "Complete" | "Hold";
}

const jobs = ref<MyJobItem[]>([
  {
    id: 1,
    flowName: "Mesin SM52 4 Warna",
    priority: "High",
    product: "Brosur A5",
    title: "Brosur Penawaran Bisnis",
    description: "Brosur Full Color A4 (210x297 mm), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan",
    status: "Waiting",
  },
  {
    id: 2,
    flowName: "Mesin SM52 4 Warna",
    priority: "Urgent",
    product: "Brosur A5",
    title: "Flyer Diskon Merdeka",
    description: "Brosur Full Color A5, Art carton 210gr, Laminasi Doff 2 Sisi, 1 Lipatan",
    status: "On Process",
  },
  {
    id: 3,
    flowName: "Mesin Pond Putus",
    priority: "Normal",
    product: "Hang Tag Baju",
    title: "Hangtag Vintage Distro",
    description: "Ivory 300gr, Die-cut Custom Shape + Hole 3mm, Foil Gold 1 Sisi",
    status: "Waiting",
  },
  {
    id: 4,
    flowName: "Digital A3+ Konica",
    priority: "High",
    product: "Sticker Kromo",
    title: "Label Botol Minuman",
    description: "Sticker Cromo A3+, Kiss Cut Pola Bulat 5cm, 20 Lembar",
    status: "On Process",
  },
]);

const selectedPriority = ref<"all" | "urgent" | "high" | "normal">("all");

const filteredJobs = computed(() => {
  if (selectedPriority.value === "all") return jobs.value;
  return jobs.value.filter((j) => j.priority.toLowerCase() === selectedPriority.value);
});

function getCardBorderClass(priority: string) {
  if (priority === "Urgent") return "border-danger border-2";
  if (priority === "High") return "border-info border-2";
  return "border-secondary";
}

function getPriorityTextClass(priority: string) {
  if (priority === "Urgent") return "text-danger";
  if (priority === "High") return "text-info";
  return "text-muted";
}

const viewModalVisible = ref(false);
const selectedJob = ref<MyJobItem | null>(null);

function viewJob(job: MyJobItem) {
  selectedJob.value = job;
  viewModalVisible.value = true;
}
</script>
