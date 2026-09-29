<script setup lang="ts">
useHead({
  title: "Job Order List - Kacetak System",
});

interface JobOrder {
  id: string;
  no: string;
  dueDate: string;
  customer: string;
  product: string;
  jobTitle: string;
  priority: "High" | "Medium" | "Low";
  status: "Waiting" | "On Process" | "Completed";
  workflowType: string;
  workflowCategory: "Design" | "Pracetak" | "Cetak" | "Finishing";
  salesNo: string;
  salesDate: string;
  shipping: string;
  orderSummary: string;
  steps: Array<{ name: string; status: "done" | "active" | "pending" }>;
}

const jobOrders = ref<JobOrder[]>([
  {
    id: "1",
    no: "JO-0001",
    dueDate: "17/12/2025",
    customer: "PT. Makmur Abadi",
    product: "Brosur Full Color Promo",
    jobTitle: "Brosur SMKN 1 Karawang",
    priority: "High",
    status: "On Process",
    workflowType: "sm52",
    workflowCategory: "Cetak",
    salesNo: "25250025452",
    salesDate: "15/12/2025",
    shipping: "Pick Up",
    orderSummary: "2 Products",
    steps: [
      { name: "Design / Layout", status: "done" },
      { name: "Plate CTP", status: "done" },
      { name: "Cetak SM52 (4 Warna)", status: "active" },
      { name: "Potong & Lipat", status: "pending" },
      { name: "Packing & QC", status: "pending" },
    ],
  },
  {
    id: "2",
    no: "JO-0002",
    dueDate: "18/12/2025",
    customer: "Toko Buku Cerdas",
    product: "Kalender Dinding 2026",
    jobTitle: "Kalender Yayasan Al-Azhar",
    priority: "Medium",
    status: "Waiting",
    workflowType: "ctp",
    workflowCategory: "Pracetak",
    salesNo: "25250025453",
    salesDate: "15/12/2025",
    shipping: "Shipping",
    orderSummary: "1 Product (500 pcs)",
    steps: [
      { name: "Design / Editing", status: "done" },
      { name: "Plate CTP", status: "active" },
      { name: "Cetak Komori", status: "pending" },
      { name: "Spiral Binding", status: "pending" },
    ],
  },
  {
    id: "3",
    no: "JO-0003",
    dueDate: "19/12/2025",
    customer: "CV Jaya Sentosa",
    product: "Kartu Nama Exclusive",
    jobTitle: "Kartu Nama Direksi",
    priority: "Low",
    status: "Waiting",
    workflowType: "design",
    workflowCategory: "Design",
    salesNo: "25250025454",
    salesDate: "16/12/2025",
    shipping: "Pick Up",
    orderSummary: "5 Box",
    steps: [
      { name: "Design Approval", status: "active" },
      { name: "Digital Print Xerox", status: "pending" },
      { name: "Laminasi Doff & Box", status: "pending" },
    ],
  },
  {
    id: "4",
    no: "JO-0004",
    dueDate: "20/12/2025",
    customer: "PT Global Solusi",
    product: "Company Profile Hardcover",
    jobTitle: "Company Profile 2026",
    priority: "High",
    status: "Completed",
    workflowType: "potong",
    workflowCategory: "Finishing",
    salesNo: "25250025455",
    salesDate: "10/12/2025",
    shipping: "Shipping",
    orderSummary: "100 Buku",
    steps: [
      { name: "Design Final", status: "done" },
      { name: "CTP & Cetak", status: "done" },
      { name: "Hardcover Binding", status: "done" },
      { name: "Potong & Delivery", status: "done" },
    ],
  },
]);

const selectedFlowFilter = ref<string>("all");
const categoryFilter = ref<string>("all");

const filteredJobs = computed(() => {
  return jobOrders.value.filter((job) => {
    const matchesFlow = selectedFlowFilter.value === "all" || job.workflowType === selectedFlowFilter.value;
    const matchesCategory = categoryFilter.value === "all" || job.workflowCategory === categoryFilter.value;
    return matchesFlow && matchesCategory;
  });
});

const columns = [
  { key: "no", label: "No JO", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "product", label: "Product", sortable: true },
  { key: "jobTitle", label: "Job Title" },
  { key: "priority", label: "Priority", sortable: true, align: "center" as const },
  { key: "status", label: "Status", sortable: true, align: "center" as const },
  { key: "actions", label: "Action", align: "center" as const },
];

// Modal: View Flow
const viewFlowModal = ref(false);
const activeFlowJob = ref<JobOrder | null>(null);
const openViewFlow = (job: JobOrder) => {
  activeFlowJob.value = job;
  viewFlowModal.value = true;
};

// Modal: Edit JO
const editModal = ref(false);
const editingJob = ref<JobOrder | null>(null);
const openEditModal = (job: JobOrder) => {
  editingJob.value = JSON.parse(JSON.stringify(job));
  editModal.value = true;
};
const saveJob = () => {
  if (!editingJob.value) return;
  const idx = jobOrders.value.findIndex((j) => j.id === editingJob.value?.id);
  if (idx !== -1) {
    jobOrders.value[idx] = editingJob.value;
  }
  editModal.value = false;
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Job Order List" subtitle="Manage production tickets and track department workflows" />

    <!-- 5 Summary Metric Cards -->
    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FeatherIcon name="clipboard" size="18" />
          </div>
          <div>
            <p class="text-[11px] font-semibold text-gray-500">Total Job Order</p>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">105</h4>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
            <FeatherIcon name="clock" size="18" />
          </div>
          <div>
            <p class="text-[11px] font-semibold text-gray-500">Total Waiting</p>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">100</h4>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40">
            <FeatherIcon name="loader" size="18" />
          </div>
          <div>
            <p class="text-[11px] font-semibold text-gray-500">Total On Process</p>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">5</h4>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
          >
            <FeatherIcon name="home" size="18" />
          </div>
          <div>
            <p class="text-[11px] font-semibold text-gray-500">Total In-House</p>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">90</h4>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
            <FeatherIcon name="truck" size="18" />
          </div>
          <div>
            <p class="text-[11px] font-semibold text-gray-500">Total Outsource</p>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">15</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Main 2-Column Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <!-- Left Panel: All Work Flow Nav Filter -->
      <div class="lg:col-span-1">
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs space-y-4"
        >
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <h5 class="font-bold text-gray-900 dark:text-white">All Work Flow</h5>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">40</span>
          </div>

          <!-- All button -->
          <button
            type="button"
            :class="[
              'flex w-full items-center justify-between rounded-lg px-3 py-2 font-semibold transition text-start',
              selectedFlowFilter === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
            ]"
            @click="selectedFlowFilter = 'all'"
          >
            <span>All Departments</span>
            <span>{{ jobOrders.length }}</span>
          </button>

          <!-- Group: Design -->
          <div>
            <p class="mb-1 text-[11px] font-bold uppercase text-gray-400">Design</p>
            <div class="space-y-1">
              <button
                type="button"
                :class="[
                  'flex w-full items-center justify-between rounded px-2.5 py-1.5 transition',
                  selectedFlowFilter === 'design'
                    ? 'bg-primary/10 font-bold text-primary'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400',
                ]"
                @click="selectedFlowFilter = 'design'"
              >
                <span>Design</span>
                <span class="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] dark:bg-gray-800">5</span>
              </button>
            </div>
          </div>

          <!-- Group: Pracetak -->
          <div>
            <p class="mb-1 text-[11px] font-bold uppercase text-gray-400">Pracetak</p>
            <div class="space-y-1">
              <button
                type="button"
                :class="[
                  'flex w-full items-center justify-between rounded px-2.5 py-1.5 transition',
                  selectedFlowFilter === 'ctp'
                    ? 'bg-primary/10 font-bold text-primary'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400',
                ]"
                @click="selectedFlowFilter = 'ctp'"
              >
                <span>Plate CTP</span>
                <span class="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] dark:bg-gray-800">5</span>
              </button>
            </div>
          </div>

          <!-- Group: Cetak -->
          <div>
            <p class="mb-1 text-[11px] font-bold uppercase text-gray-400">Cetak</p>
            <div class="space-y-1">
              <button
                type="button"
                :class="[
                  'flex w-full items-center justify-between rounded px-2.5 py-1.5 transition',
                  selectedFlowFilter === 'sm52'
                    ? 'bg-primary/10 font-bold text-primary'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400',
                ]"
                @click="selectedFlowFilter = 'sm52'"
              >
                <span>Mesin SM 52</span>
                <span class="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] dark:bg-gray-800">5</span>
              </button>
            </div>
          </div>

          <!-- Group: Finishing -->
          <div>
            <p class="mb-1 text-[11px] font-bold uppercase text-gray-400">Finishing</p>
            <div class="space-y-1">
              <button
                type="button"
                :class="[
                  'flex w-full items-center justify-between rounded px-2.5 py-1.5 transition',
                  selectedFlowFilter === 'potong'
                    ? 'bg-primary/10 font-bold text-primary'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400',
                ]"
                @click="selectedFlowFilter = 'potong'"
              >
                <span>Potong & Packaging</span>
                <span class="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] dark:bg-gray-800">5</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Data Table -->
      <div class="lg:col-span-3">
        <!-- Filter dropdown bar -->
        <div
          class="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <h5 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Job Orders : {{ selectedFlowFilter.toUpperCase() }}
          </h5>

          <div class="flex items-center gap-2 text-xs">
            <span class="text-gray-500">Flow Type:</span>
            <select
              v-model="categoryFilter"
              class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="all">All Types</option>
              <option value="Design">Design</option>
              <option value="Pracetak">Pracetak</option>
              <option value="Cetak">Cetak</option>
              <option value="Finishing">Finishing</option>
            </select>
          </div>
        </div>

        <DataTable :columns="columns" :items="filteredJobs" search-placeholder="Search job title, product, customer...">
          <!-- No JO -->
          <template #cell(no)="{ item }">
            <NuxtLink :to="`/job-order-detail?no=${item.no}`" class="font-semibold text-primary hover:underline">
              {{ item.no }}
            </NuxtLink>
          </template>

          <!-- Priority -->
          <template #cell(priority)="{ item }">
            <span
              :class="[
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                item.priority === 'High'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : item.priority === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200',
              ]"
            >
              {{ item.priority }}
            </span>
          </template>

          <!-- Status -->
          <template #cell(status)="{ item }">
            <span
              :class="[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                item.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : item.status === 'On Process'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200',
              ]"
            >
              {{ item.status }}
            </span>
          </template>

          <!-- Actions -->
          <template #cell(actions)="{ item }">
            <div class="flex items-center justify-center gap-1.5">
              <NuxtLink
                :to="`/job-order-detail?no=${item.no}`"
                class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700"
                title="View SPK Sheet"
              >
                <FeatherIcon name="eye" size="13" />
              </NuxtLink>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-info hover:text-info dark:border-gray-700"
                title="View Flow Progress"
                @click="openViewFlow(item)"
              >
                <FeatherIcon name="git-branch" size="13" />
              </button>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-warning hover:text-warning dark:border-gray-700"
                title="Edit Job"
                @click="openEditModal(item)"
              >
                <FeatherIcon name="edit" size="13" />
              </button>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Modal: View Flow Progress -->
    <BaseModal v-model="viewFlowModal" title="View Work Flow" size="md">
      <div v-if="activeFlowJob" class="p-5 text-xs space-y-4">
        <div>
          <h5 class="mb-2 font-bold text-gray-900 dark:text-white">Sales Information</h5>
          <div class="grid grid-cols-2 gap-1 text-gray-600 dark:text-gray-400">
            <span class="font-semibold">Sales Date:</span> <span>{{ activeFlowJob.salesDate }}</span>
            <span class="font-semibold">No Sales:</span> <span class="font-mono">{{ activeFlowJob.salesNo }}</span>
            <span class="font-semibold">Customer:</span> <span>{{ activeFlowJob.customer }}</span>
            <span class="font-semibold">Shipping:</span> <span>{{ activeFlowJob.shipping }}</span>
            <span class="font-semibold">Order Summary:</span> <span>{{ activeFlowJob.orderSummary }}</span>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-3 dark:border-gray-800">
          <h5 class="mb-2 font-bold text-gray-900 dark:text-white">Job Details</h5>
          <p><strong class="text-gray-800 dark:text-gray-200">Product:</strong> {{ activeFlowJob.product }}</p>
          <p class="mt-1"><strong class="text-gray-800 dark:text-gray-200">Job Title:</strong> {{ activeFlowJob.jobTitle }}</p>
        </div>

        <div class="border-t border-gray-100 pt-3 dark:border-gray-800">
          <h5 class="mb-3 font-bold text-gray-900 dark:text-white">Production Steps</h5>
          <div class="space-y-2">
            <div
              v-for="(step, idx) in activeFlowJob.steps"
              :key="idx"
              class="flex items-center justify-between rounded-lg border p-2.5"
              :class="[
                step.status === 'done'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : step.status === 'active'
                    ? 'border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800',
              ]"
            >
              <div class="flex items-center gap-2">
                <span
                  class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  :class="step.status === 'done' ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700'"
                >
                  {{ idx + 1 }}
                </span>
                <span class="font-medium">{{ step.name }}</span>
              </div>
              <span class="text-[10px] uppercase font-bold">{{ step.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Modal: Edit Job Order -->
    <BaseModal v-model="editModal" title="Edit Job Order" size="sm">
      <form v-if="editingJob" class="p-5 text-xs space-y-3" @submit.prevent="saveJob">
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Customer</label>
          <input v-model="editingJob.customer" type="text" class="mt-1 w-full rounded border p-2" required />
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Product</label>
          <input v-model="editingJob.product" type="text" class="mt-1 w-full rounded border p-2" required />
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Job Title</label>
          <input v-model="editingJob.jobTitle" type="text" class="mt-1 w-full rounded border p-2" required />
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Priority</label>
          <select v-model="editingJob.priority" class="mt-1 w-full rounded border p-2">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select v-model="editingJob.status" class="mt-1 w-full rounded border p-2">
            <option value="Waiting">Waiting</option>
            <option value="On Process">On Process</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="rounded border px-3 py-1.5" @click="editModal = false">Cancel</button>
          <button type="submit" class="rounded bg-primary px-4 py-1.5 font-semibold text-white">Save Changes</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
