<<<<<<< HEAD
<script setup lang="ts">useHead({
  title: "Work Flow List - Kacetak System",
});

const { data: workFlowData } = await useFetch<WorkflowItem[]>('/api/work-flow')
const workflows = ref<WorkflowItem[]>(workFlowData.value ?? [])
useMockSync('work-flow', workflows);

const categoryFilter = ref<string>("All");

const filteredWorkflows = computed(() => {
  if (categoryFilter.value === "All") return workflows.value;
  return workflows.value.filter((w) => w.category === categoryFilter.value);
});

const columns = [
  { key: "no", label: "No", sortable: true },
  { key: "category", label: "Product Category", sortable: true },
  { key: "product", label: "Product", sortable: true },
  { key: "workflowSteps", label: "Work Flow" },
  { key: "actions", label: "Action", align: "center" as const },
];

const deleteModalOpen = ref(false);
const selectedWf = ref<WorkflowItem | null>(null);

const confirmDelete = (item: WorkflowItem) => {
  selectedWf.value = item;
  deleteModalOpen.value = true;
};

const handleDelete = () => {
  if (!selectedWf.value) return;
  workflows.value = workflows.value.filter((w) => w.id !== selectedWf.value?.id);
  deleteModalOpen.value = false;
  selectedWf.value = null;
};</script>

<template>
  <div>
    <!-- Page Header -->
    <CommonPageHeader title="Work Flow List" subtitle="Manage your production workflow templates">
      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="PDF"
          >
            <img src="/assets/img/icons/pdf.svg" alt="PDF" class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="Print"
            @click="() => window.print()"
          >
            <CommonFeatherIcon name="printer" size="16" />
          </button>
          <NuxtLink
            to="/add-work-flow"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            <CommonFeatherIcon name="plus-circle" size="14" />
            <span>Add New Work Flow</span>
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Filter Bar -->
    <div
      class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-2">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">Category Filter:</label>
        <select
          v-model="categoryFilter"
          class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="All">All Categories</option>
          <option value="Offset">Offset</option>
          <option value="Large Format">Large Format</option>
          <option value="Digital A3+">Digital A3+</option>
          <option value="Sablon">Sablon</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <TablesDataTable :columns="columns" :items="filteredWorkflows" search-placeholder="Search product, category, workflow steps...">
      <!-- No -->
      <template #cell(no)="{ item }">
        <span class="font-mono font-bold text-gray-900 dark:text-white">{{ item.no }}</span>
      </template>

      <!-- Category -->
      <template #cell(category)="{ item }">
        <span class="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {{ item.category }}
        </span>
      </template>

      <!-- Product -->
      <template #cell(product)="{ item }">
        <span class="font-bold text-gray-900 dark:text-white">{{ item.product }}</span>
      </template>

      <!-- Workflow Steps -->
      <template #cell(workflowSteps)="{ item }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(step, sIdx) in item.workflowSteps.split(', ')"
            :key="sIdx"
            class="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ step }}
          </span>
        </div>
      </template>

      <!-- Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <NuxtLink
            :to="`/edit-work-flow?no=${item.no}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-warning hover:text-warning dark:border-gray-700"
            title="Edit Work Flow"
          >
            <CommonFeatherIcon name="edit" size="13" />
          </NuxtLink>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-danger hover:text-danger dark:border-gray-700"
            title="Delete"
            @click="confirmDelete(item)"
          >
            <CommonFeatherIcon name="trash-2" size="13" />
          </button>
        </div>
      </template>
    </TablesDataTable>

    <!-- Delete Confirmation Modal -->
    <CommonBaseModal v-model="deleteModalOpen" title="Delete Work Flow" size="sm">
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-danger dark:bg-red-950/50"
        >
          <CommonFeatherIcon name="alert-triangle" size="24" />
        </div>
        <h5 class="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</h5>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Do you really want to delete workflow
          <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedWf?.no }}</span
          >?
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="deleteModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white hover:bg-danger/90"
            @click="handleDelete"
          >
            Yes, Delete It
          </button>
        </div>
      </div>
    </CommonBaseModal>
=======
<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from "#server/types/work-flow";
import type { DateRangeValue } from "~/composables/useDateRange";
import WorkFlowProcessModal from "~/components/pages/work-flow/WorkFlowProcessModal.vue";
import WorkFlowRecordsTable from "~/components/pages/work-flow/WorkFlowRecordsTable.vue";
import SalesConfirmDelete from "~/components/sales/SalesConfirmDelete.vue";
import SalesFeedback from "~/components/sales/SalesFeedback.vue";
import SalesListHeader from "~/components/sales/SalesListHeader.vue";

useLegacyPage({ title: "Work Flow List", sweetAlert: false });

const router = useRouter();
const searchQuery = ref("");
const filterCategory = ref("");
const filterDateRange = ref<DateRangeValue | null>(null);

const editingRecord = ref<WorkFlow | null>(null);
const deletingRecord = ref<WorkFlow | null>(null);
const busy = ref(false);
const actionError = ref("");

const filterParams = computed(() => ({
  search: searchQuery.value,
  category: filterCategory.value,
  startDate: filterDateRange.value?.start || "",
  endDate: filterDateRange.value?.end || "",
}));

const { workFlows, pending, error, refresh, saveWorkFlow, deleteWorkFlow } = useWorkFlows(filterParams);

async function handleProcessSubmit(form: WorkFlowFormData) {
  busy.value = true;
  actionError.value = "";
  try {
    await saveWorkFlow(form);
    editingRecord.value = null;
  } catch (err) {
    actionError.value = salesErrorMessage(err);
  } finally {
    busy.value = false;
  }
}

async function handleConfirmDelete() {
  if (!deletingRecord.value) return;
  busy.value = true;
  actionError.value = "";
  try {
    await deleteWorkFlow(deletingRecord.value.id);
    deletingRecord.value = null;
  } catch (err) {
    actionError.value = salesErrorMessage(err);
  } finally {
    busy.value = false;
  }
}

function printTable() {
  printSalesRows(
    "Work Flow List",
    ["No", "Product Category", "Product", "Work Flow"],
    workFlows.value.map((item) => [item.no, item.category, item.product, item.workflowSteps]),
  );
}
</script>

<template>
  <div class="dulank-page dulank-page-work-flow">
    <SalesListHeader
      title="Work Flow List"
      subtitle="Manage your Work Flow"
      add-label="Add New Work Flow"
      :refreshing="pending"
      @add="router.push('/add-work-flow')"
      @refresh="refresh()"
      @print="printTable"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="6"
      :error="error ? 'Unable to load workflows. Please try again.' : ''"
      @retry="refresh()"
    />

    <WorkFlowRecordsTable
      v-if="!pending && !error"
      :work-flows="workFlows"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @update:filter-date-range="filterDateRange = $event"
      @edit="editingRecord = $event"
      @delete="deletingRecord = $event"
    />

    <!-- Quick Edit Modal -->
    <WorkFlowProcessModal
      :open="!!editingRecord"
      :record="editingRecord"
      :busy="busy"
      :error="actionError"
      @close="editingRecord = null"
      @submit="handleProcessSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!deletingRecord"
      :busy="busy"
      :error="actionError"
      @close="deletingRecord = null"
      @confirm="handleConfirmDelete"
    />
>>>>>>> origin/eko
  </div>
</template>
