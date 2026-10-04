<script setup lang="ts">
import type { SupportTicket } from '#server/types/support-ticket'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  show: boolean
  ticket: SupportTicket | null
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'send-reply': [ticketId: string, message: string]
  'update-status': [ticketId: string, newStatus: 'Open' | 'Closed' | 'Pending']
}>()

const chatInput = ref('')

function handleSendReply() {
  if (!chatInput.value.trim() || !props.ticket) return
  emit('send-reply', props.ticket.id, chatInput.value.trim())
  chatInput.value = ''
}

function handleStatusChange(status: 'Open' | 'Closed' | 'Pending') {
  if (!props.ticket) return
  emit('update-status', props.ticket.id, status)
}
</script>

<template>
  <SalesDialog
    :open="show"
    :title="ticket ? `${ticket.ticketNo} - ${ticket.subject}` : 'Ticket Detail'"
    wide
    :busy="busy"
    @close="emit('update:show', false)"
  >
    <div v-if="ticket" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold',
                ticket.status === 'Open'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : ticket.status === 'Closed'
                  ? 'bg-gray-100 text-gray-700 border border-gray-300'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              ]"
            >
              {{ ticket.status }}
            </span>
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                ticket.priority === 'High'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : ticket.priority === 'Medium'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              ]"
            >
              Priority: {{ ticket.priority }}
            </span>
          </div>
          <div class="text-xs text-gray-500">
            Created: {{ ticket.createdDate }} | Due: {{ ticket.dueDate }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <span class="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-1">
              REQUESTED BY
            </span>
            <div class="flex items-center gap-2">
              <img
                :src="ticket.avatar || '/assets/img/users/user-23.jpg'"
                :alt="ticket.requestedBy"
                class="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p class="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {{ ticket.requestedBy }}
                </p>
                <p class="text-[11px] text-gray-500">{{ ticket.customerEmail }}</p>
              </div>
            </div>
          </div>

          <div>
            <span class="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-1">
              ASSIGNED AGENT
            </span>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                {{ ticket.assignee ? ticket.assignee[0] : 'A' }}
              </div>
              <div>
                <p class="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {{ ticket.assignee }}
                </p>
                <p class="text-[11px] text-gray-500">Support Specialist</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span class="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-1">
            DESCRIPTION
          </span>
          <div class="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 leading-relaxed">
            {{ ticket.description || 'No description provided.' }}
          </div>
        </div>

        <div v-if="ticket.tags && ticket.tags.length">
          <span class="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-1">
            TAGS
          </span>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in ticket.tags"
              :key="tag"
              class="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div>
          <span class="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-2">
            ACTIVITY TIMELINE
          </span>
          <div class="space-y-3 pl-2 border-l-2 border-amber-300 dark:border-amber-700 ml-1">
            <div
              v-for="(act, idx) in ticket.activities || []"
              :key="idx"
              class="relative pl-3"
            >
              <span class="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-gray-900"></span>
              <p class="text-xs font-bold text-gray-900 dark:text-gray-100">{{ act.title }}</p>
              <p class="text-xs text-gray-500">{{ act.description }}</p>
              <p class="text-[10px] text-gray-400 mt-0.5">{{ act.author }} • {{ act.timeAgo }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            v-if="ticket.status !== 'Closed'"
            type="button"
            class="h-8 px-3 rounded text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
            @click="handleStatusChange('Closed')"
          >
            Close Ticket
          </button>
          <button
            v-if="ticket.status === 'Closed'"
            type="button"
            class="h-8 px-3 rounded text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            @click="handleStatusChange('Open')"
          >
            Re-Open Ticket
          </button>
        </div>
      </div>

      <div class="lg:col-span-5 flex flex-col h-[480px] bg-gray-50 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div class="font-bold text-xs text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span>Ticket Chat History</span>
          <span class="text-[11px] font-normal text-emerald-600 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active
          </span>
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          <div
            v-for="(msg, idx) in ticket.chat || []"
            :key="idx"
            :class="['flex flex-col', msg.isMe ? 'items-end' : 'items-start']"
          >
            <div
              :class="[
                'max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed shadow-xs',
                msg.isMe
                  ? 'bg-amber-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none'
              ]"
            >
              {{ msg.message }}
            </div>
            <span class="text-[10px] text-gray-400 mt-1 px-1">
              {{ msg.senderName }} • {{ msg.time }}
            </span>
          </div>

          <div v-if="!ticket.chat || !ticket.chat.length" class="text-center text-xs text-gray-400 py-10">
            No chat messages yet. Send a reply below.
          </div>
        </div>

        <form @submit.prevent="handleSendReply" class="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <input
            v-model="chatInput"
            type="text"
            placeholder="Type your reply..."
            class="flex-1 h-9 px-3 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            class="h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center justify-center transition-colors"
          >
            <FeatherIcon name="send" class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </SalesDialog>
</template>
