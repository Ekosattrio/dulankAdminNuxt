<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from "#server/types/work-flow";
import WorkFlowDocumentForm from "~/components/Pages/WorkFlow/WorkFlowDocumentForm.vue";
import SalesFeedback from "~/components/Sales/SalesFeedback.vue";
import SalesListHeader from "~/components/Sales/SalesListHeader.vue";

useLegacyPage({ title: "Edit Work Flow", sweetAlert: false });

const route = useRoute();
const router = useRouter();
const { getWorkFlow, saveWorkFlow } = useWorkFlows();

const targetId = computed(() => (route.query.id as string) || (route.query.no as string) || "1");
const record = ref<WorkFlow | null>(null);
const loading = ref(true);
const loadError = ref("");
const busy = ref(false);
const saveError = ref("");

async function fetchWorkflow() {
  loading.value = true;
  loadError.value = "";
  try {
    record.value = await getWorkFlow(targetId.value);
  } catch (err) {
    loadError.value = "Failed to load workflow data. Please try again.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchWorkflow();
});

async function handleSubmit(formData: WorkFlowFormData) {
  busy.value = true;
  saveError.value = "";
  try {
    await saveWorkFlow({
      ...formData,
      id: record.value?.id || targetId.value,
    });
    router.push("/work-flow");
  } catch (err) {
    saveError.value = salesErrorMessage(err);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-edit-work-flow space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Edit Work Flow</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage your product with default Work Flow</p>
      </div>
      <NuxtLink to="/work-flow" :class="salesSecondaryButton">
        <FeatherIcon name="arrow-left" :size="14" />Back to Work Flow List
      </NuxtLink>
    </div>

    <SalesFeedback :pending="loading" :error="loadError || saveError" @retry="fetchWorkflow()" />

    <WorkFlowDocumentForm
      v-if="!loading && record"
      :initial-data="record"
      is-edit
      :busy="busy"
      @submit="handleSubmit"
      @cancel="router.push('/work-flow')"
    />
  </div>
</template>
