<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from "#server/types/work-flow";
import type { DateRangeValue } from "~/composables/useDateRange";
import WorkFlowProcessModal from "~/components/pages/work-flow/WorkFlowProcessModal.vue";
import WorkFlowRecordsTable from "~/components/pages/work-flow/WorkFlowRecordsTable.vue";
import SalesConfirmDelete from "~/components/sales/SalesConfirmDelete.vue";
import SalesFeedback from "~/components/sales/SalesFeedback.vue";
import SalesListHeader from "~/components/sales/SalesListHeader.vue";

definePageMeta({
  layout: 'default',
  alias: ['/work-flow.html'],
})

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
  </div>
</template>
