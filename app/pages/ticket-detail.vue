<script setup lang="ts">
import SupportTicketDetailWorkspace from '~/components/pages/support-ticket/SupportTicketDetailWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/ticket-detail.html'],
})

useLegacyPage({
  title: 'Ticket Detail',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-ticket-detail p-4 md:p-6">
    <SupportTicketDetailWorkspace back-to="/ticket-list" />
  </div>
</template>
