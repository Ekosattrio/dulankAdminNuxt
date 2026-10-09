<script setup lang="ts">
import SupportTicketDetailWorkspace from '~/components/pages/support-ticket/SupportTicketDetailWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/support-ticket-detail.html'],
})

useLegacyPage({
  title: 'Support Ticket Detail',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-support-ticket-detail p-4 md:p-6">
    <SupportTicketDetailWorkspace back-to="/support-ticket" />
  </div>
</template>
