<script setup lang="ts">
import SupportTicketDetailWorkspace from '~/components/Pages/SupportTicket/SupportTicketDetailWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Ticket Detail',
  sweetAlert: false,
})

const route = useRoute()
const ticketId = computed(() => String(route.query.id || route.query.ticketNo || '1'))
</script>

<template>
  <div class="dulank-page dulank-page-ticket-detail">
    <SupportTicketDetailWorkspace :ticket-id="ticketId" />
  </div>
</template>
