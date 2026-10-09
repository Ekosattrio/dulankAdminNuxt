<script setup lang="ts">
import type { WorkFlowFormData } from "#server/types/work-flow";
import WorkFlowDocumentForm from "~/components/pages/work-flow/WorkFlowDocumentForm.vue";
import SalesFeedback from "~/components/sales/SalesFeedback.vue";
import SalesListHeader from "~/components/sales/SalesListHeader.vue";

definePageMeta({
  layout: 'default',
  alias: ['/add-work-flow.html'],
})

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
  <div class="dulank-page dulank-page-add-work-flow">
    <SalesListHeader title="Add Work Flow" subtitle="Manage your product with default Work Flow" />

    <SalesFeedback :error="errorMessage" class="mb-4" />

    <WorkFlowDocumentForm :busy="busy" @submit="handleSubmit" @cancel="router.push('/work-flow')" />
  </div>
</template>
