<<<<<<< HEAD
<script setup lang="ts">const route = useRoute();
const router = useRouter();

const flowNo = computed(() => (route.query.no as string) || "JAP-0001");

useHead({
  title: computed(() => `Edit Work Flow ${flowNo.value} - Kacetak System`),
});

const selectedProduct = ref("Brosur A5");
const selectedCategory = ref("Offset");

const { data: editWorkFlowData } = await useFetch<EditFlowStepOption[]>('/api/edit-work-flow')
const flowSteps = ref<EditFlowStepOption[]>(editWorkFlowData.value ?? [])
useMockSync('edit-work-flow', flowSteps);

const activeSequence = computed(() => {
  return flowSteps.value.filter((s) => s.selected);
});

const toggleStep = (step: EditFlowStepOption) => {
  step.selected = !step.selected;
};

const removeSequenceItem = (step: EditFlowStepOption) => {
  step.selected = false;
};

const isSaving = ref(false);
const handleSave = () => {
  isSaving.value = true;
  setTimeout(() => {
    isSaving.value = false;
    router.push("/work-flow");
  }, 500);
};</script>

<template>
  <div>
    <!-- Page Header -->
    <CommonPageHeader :title="`Edit Work Flow #${flowNo}`" subtitle="Update production workflow steps and templates">
      <template #actions>
        <NuxtLink
          to="/work-flow"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <CommonFeatherIcon name="arrow-left" size="14" />
          <span>Back to Work Flow List</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left 2 Cols -->
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Target Product</h4>
          <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <span class="font-semibold text-gray-700 dark:text-gray-300">Product:</span>
            <span class="font-bold text-primary">{{ selectedProduct }}</span>
            <span class="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{{ selectedCategory }}</span>
            <span class="font-mono text-gray-400 ms-auto">ID: {{ flowNo }}</span>
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs space-y-4"
        >
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">Configure Department Steps</h4>

          <div
            v-for="cat in ['Design', 'Pracetak', 'Cetak', 'Finishing'] as const"
            :key="cat"
            class="border-t border-gray-100 pt-3 dark:border-gray-800"
          >
            <h5 class="mb-2 font-bold uppercase text-[11px] text-gray-500">{{ cat }} Department</h5>
            <div class="space-y-2">
              <div
                v-for="step in flowSteps.filter((s) => s.category === cat)"
                :key="step.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
              >
                <label class="flex cursor-pointer items-center gap-2.5 font-medium text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    :checked="step.selected"
                    class="h-4 w-4 rounded text-primary focus:ring-primary"
                    @change="toggleStep(step)"
                  />
                  <span>{{ step.name }}</span>
                </label>

                <div v-if="step.selected" class="flex items-center gap-2">
                  <span class="text-[11px] text-gray-400">Template:</span>
                  <input
                    v-model="step.template"
                    type="text"
                    class="rounded border border-gray-200 bg-gray-50 p-1 text-[11px] dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col -->
      <div class="lg:col-span-1">
        <div
          class="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs space-y-4"
        >
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Updated Workflow Route</h4>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {{ activeSequence.length }} Steps
            </span>
          </div>

          <div class="space-y-2">
            <div
              v-for="(item, idx) in activeSequence"
              :key="item.id"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 p-2.5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex items-center gap-2">
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {{ idx + 1 }}
                </span>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">{{ item.name }}</p>
                  <p class="text-[10px] text-gray-500">{{ item.template }}</p>
                </div>
              </div>
              <button type="button" class="text-gray-400 hover:text-danger" title="Remove Step" @click="removeSequenceItem(item)">
                <CommonFeatherIcon name="x" size="13" />
              </button>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
            <button
              type="button"
              :disabled="activeSequence.length === 0 || isSaving"
              class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              @click="handleSave"
            >
              <CommonFeatherIcon v-if="!isSaving" name="check" size="14" />
              <span>{{ isSaving ? "Updating..." : "Update Work Flow" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
=======
<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from "#server/types/work-flow";
import WorkFlowDocumentForm from "~/components/pages/work-flow/WorkFlowDocumentForm.vue";
import SalesFeedback from "~/components/sales/SalesFeedback.vue";
import SalesListHeader from "~/components/sales/SalesListHeader.vue";

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
  <div class="dulank-page dulank-page-edit-work-flow">
    <SalesListHeader title="Edit Work Flow" subtitle="Manage your product with default Work Flow" />

    <SalesFeedback :pending="loading" :error="loadError || saveError" @retry="fetchWorkflow()" />

    <WorkFlowDocumentForm
      v-if="!loading && record"
      :initial-data="record"
      is-edit
      :busy="busy"
      @submit="handleSubmit"
      @cancel="router.push('/work-flow')"
    />
>>>>>>> origin/eko
  </div>
</template>
