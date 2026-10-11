<script setup lang="ts">
import SupportTicketDetailWorkspace from '~/components/Pages/SupportTicket/SupportTicketDetailWorkspace.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Support Ticket Detail', sweetAlert: false })

const route = useRoute()
const ticketId = computed(() => String(route.query.id || '__missing__'))
</script>

<template>
  <div class="dulank-page dulank-page-support-ticket-detail">
    <SupportTicketDetailWorkspace :ticket-id="ticketId" />
  </div>
</template>
