<script setup lang="ts">
import SupportTicketWorkspace from '~/components/Pages/SupportTicket/SupportTicketWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Support Ticket List',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-ticket-list">
    <SupportTicketWorkspace />
  </div>
</template>
