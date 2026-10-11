<script setup lang="ts">
import type { SupportTicketCommand } from '#server/types/support-ticket'
import { useSupportTicketDetail } from '~/composables/useSupportTicketDetail'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SupportTicketAddModal from './SupportTicketAddModal.vue'
import SupportTicketChatPanel from './SupportTicketChatPanel.vue'
import SupportTicketDetailPanel from './SupportTicketDetailPanel.vue'

const props = defineProps<{ ticketId: string }>()
const id = toRef(props, 'ticketId')
const { ticket, pending, error, busy, message, mutationError, refresh, saveEditor, sendReply, setStatus } = useSupportTicketDetail(id)
const editorOpen = ref(false)

async function save(command: SupportTicketCommand) {
  try {
    await saveEditor(command)
    editorOpen.value = false
  } catch {}
}

async function reply(value: string) {
  try { await sendReply(value) } catch {}
}

async function changeStatus(status: 'Open' | 'Closed' | 'Pending') {
  try { await setStatus(status) } catch {}
}

function retry() {
  if (mutationError.value) mutationError.value = ''
  else refresh()
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <SalesFeedback
      :pending="pending"
      skeleton="card"
      :error="mutationError || (error ? (error.message || 'Support ticket not found.') : '')"
      :message="message"
      @retry="retry"
    />
    <div v-if="ticket && !pending" class="grid gap-5 lg:grid-cols-12">
      <SupportTicketDetailPanel class="lg:col-span-8" :ticket="ticket" :busy="busy" @edit="editorOpen = true" @update-status="changeStatus" />
      <SupportTicketChatPanel class="lg:col-span-4" :ticket="ticket" :busy="busy" @send="reply" />
    </div>
    <SupportTicketAddModal v-if="ticket" v-model:show="editorOpen" :ticket="ticket" :busy="busy" @submit="save" />
  </div>
</template>
