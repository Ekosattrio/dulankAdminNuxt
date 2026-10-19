<script setup lang="ts">
import type { WorkFlowFormData } from "#server/types/work-flow";
import WorkFlowDocumentForm from "~/components/Pages/WorkFlow/WorkFlowDocumentForm.vue";
import SalesFeedback from "~/components/Sales/SalesFeedback.vue";
import SalesListHeader from "~/components/Sales/SalesListHeader.vue";

useLegacyPage({ title: "Add Work Flow", sweetAlert: false });

const router = useRouter();
const { saveWorkFlow } = useWorkFlows();
const busy = ref(false);
const errorMessage = ref("");

async function handleSubmit(formData: WorkFlowFormData) {
  busy.value = true;
  errorMessage.value = "";
  try {
    await saveWorkFlow(formData);
    router.push("/work-flow");
  } catch (err) {
    errorMessage.value = salesErrorMessage(err);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-add-work-flow space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Add Work Flow</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage your product with default Work Flow</p>
      </div>
      <NuxtLink to="/work-flow" :class="salesSecondaryButton">
        <FeatherIcon name="arrow-left" :size="14" />Back to Work Flow List
      </NuxtLink>
    </div>

    <SalesFeedback :error="errorMessage" />

    <WorkFlowDocumentForm :busy="busy" @submit="handleSubmit" @cancel="router.push('/work-flow')" />
  </div>
</template>
