<script setup lang="ts">
import BaseModal from '~/components/Modal/BaseModal.vue'
const { dashboard, pending, error, refresh } = useAnalyticsDashboard()
const modalOpen = ref(false), modalTitle = ref(''), modalDescription = ref('')
function detail(title: string, description: string) { modalTitle.value = title; modalDescription.value = description; modalOpen.value = true }
</script>

<template>
  <div class="space-y-5">
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load analytics dashboard.' : ''" @retry="refresh()" />
    <template v-if="dashboard && !pending">
      <AnalyticsKpiGrid :items="dashboard.kpis" @detail="detail" />
      <section class="grid grid-cols-1 gap-5 xl:grid-cols-12"><AnalyticsConversionCard :conversion="dashboard.conversion" @detail="detail('Conversions Breakdown', 'Returning customer conversion performance.')" /><AnalyticsPerformanceChart :series="dashboard.performance" /></section>
      <AnalyticsTrafficPanels :browsers="dashboard.browsers" :regions="dashboard.regions" :pages="dashboard.topPages" @detail="detail" />
    </template>
    <BaseModal v-model="modalOpen" :title="modalTitle" max-width="md"><p class="app-body-text">{{ modalDescription }}</p><template #footer><button type="button" class="h-9 rounded-md bg-gray-100 px-4 text-sm font-semibold" @click="modalOpen = false">Close</button></template></BaseModal>
  </div>
</template>
