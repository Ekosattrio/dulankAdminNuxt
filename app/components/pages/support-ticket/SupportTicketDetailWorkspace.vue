<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

withDefaults(
  defineProps<{
    backTo?: string
  }>(),
  {
    backTo: '/ticket-list'
  }
)

const ticketStatus = ref('Pending')

const activityList = ref([
  {
    time: 'Just Now',
    title: 'Ticket Resolved',
    detail: 'Agent closed the ticket after applying a patch for the file upload freeze issue.',
    author: 'Liam Brooks'
  },
  {
    time: 'Today, 10:40 AM',
    title: 'Status Changed to "In Progress"',
    detail: 'Ticket was picked up by the assigned agent for investigation.',
    author: 'Liam Brooks'
  },
  {
    time: 'Yesterday, 4:15 PM',
    title: 'User Comment Added',
    detail: 'User emphasized urgency due to impact on production file uploads.',
    author: 'Ava Sullivan'
  },
  {
    time: '02 Aug, 2025 - 3:00 PM',
    title: 'Ticket Created',
    detail: 'Ticket submitted regarding the app freezing on file upload.',
    author: 'Ava Sullivan'
  }
])

const messages = ref([
  { text: 'Thanks for your time earlier!', time: '09:45 am', isMe: false },
  { text: 'Of course! It was a productive discussion.', time: '09:46 am', isMe: true },
  { text: "I'll send over the updated files by noon.", time: '09:50 am', isMe: false }
])

const newMessage = ref('')

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  messages.value.push({
    text: newMessage.value.trim(),
    time: timeStr,
    isMe: true
  })
  newMessage.value = ''
}

const editTicket = () => {
  navigateTo({ path: '/support-ticket', query: { action: 'edit' } })
}

const toggleTicketClose = () => {
  ticketStatus.value = ticketStatus.value === 'Closed' ? 'In Progress' : 'Closed'
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <!-- Ticket Detail Section -->
    <div class="lg:col-span-8">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h5 class="text-base font-bold text-gray-900 dark:text-white">#SUP-2523 - App freezes when uploading files</h5>
          <span
            :class="[
              'inline-block rounded-full px-3 py-1 text-xs font-semibold',
              ticketStatus === 'Closed'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            ]"
          >
            {{ ticketStatus }}
          </span>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <div class="mb-1 text-xs font-bold text-gray-400">REQUESTED BY</div>
            <div class="flex items-center gap-2">
              <img src="/assets/img/users/user-23.jpg" alt="Ava Sullivan" class="h-9 w-9 rounded-full object-cover" />
              <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Ava Sullivan</span>
            </div>
          </div>
          <div>
            <div class="mb-1 text-xs font-bold text-gray-400">ASSIGNED AGENT</div>
            <div class="flex items-center gap-2">
              <img src="/assets/img/users/user-24.jpg" alt="Liam Brooks" class="h-9 w-9 rounded-full object-cover" />
              <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Liam Brooks</span>
            </div>
          </div>
          <div>
            <div class="mb-1 text-xs font-bold text-gray-400">PRIORITY</div>
            <span class="inline-block rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              High
            </span>
          </div>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div class="mb-1 text-xs font-bold text-gray-400">CREATED ON</div>
            <span class="text-sm text-gray-700 dark:text-gray-300">05 Aug, 2025 1:20 PM</span>
          </div>
          <div>
            <div class="mb-1 text-xs font-bold text-gray-400">DUE DATE</div>
            <span class="text-sm text-gray-700 dark:text-gray-300">09 Aug, 2025</span>
          </div>
        </div>

        <div class="mb-6">
          <div class="mb-1 text-xs font-bold text-gray-400">DESCRIPTION</div>
          <div class="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
            When trying to upload files through the project form, the application becomes unresponsive after selecting a file larger than 5MB. This issue occurs consistently across browsers. Please investigate and apply a fix.
          </div>
        </div>

        <div class="mb-6">
          <div class="mb-1 text-xs font-bold text-gray-400">TAGS</div>
          <div class="flex flex-wrap gap-1.5">
            <span class="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Upload</span>
            <span class="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Performance</span>
            <span class="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">UI Bug</span>
          </div>
        </div>

        <div>
          <div class="mb-3 text-xs font-bold text-gray-400">ACTIVITY TIMELINE:</div>
          <ul class="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
            <li v-for="(act, idx) in activityList" :key="idx" class="relative mb-4">
              <span class="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-600 ring-4 ring-white dark:ring-gray-900" />
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-500">{{ act.time }}</span>
              </div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ act.title }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ act.detail }}</div>
              <div class="text-xs font-medium text-primary-600 dark:text-primary-400">By {{ act.author }}</div>
            </li>
          </ul>
        </div>

        <div class="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button type="button" class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700" @click="editTicket">
            Edit Ticket
          </button>
          <button
            type="button"
            :class="[
              'rounded-lg px-4 py-2 text-sm font-medium',
              ticketStatus === 'Closed'
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            ]"
            @click="toggleTicketClose"
          >
            {{ ticketStatus === 'Closed' ? 'Reopen Ticket' : 'Close Ticket' }}
          </button>
          <NuxtLink :to="backTo" class="rounded-lg border border-primary-600 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30">
            Back to List
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Chat Section -->
    <div class="lg:col-span-4">
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-3 flex items-center justify-between font-bold text-gray-900 dark:text-white">
          <span>Ticket Chat</span>
          <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Online</span>
        </div>
        <div class="mb-3 max-h-[380px] min-h-[280px] space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/40">
          <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.isMe ? 'justify-end' : 'justify-start'">
            <div class="max-w-[80%]">
              <div
                class="rounded-lg px-3 py-2 text-sm leading-relaxed"
                :class="msg.isMe ? 'bg-primary-600 text-white' : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'"
              >
                {{ msg.text }}
              </div>
              <div class="mt-0.5 text-[11px] text-gray-400" :class="msg.isMe ? 'text-end' : 'text-start'">{{ msg.time }}</div>
            </div>
          </div>
        </div>
        <form class="flex gap-2" @submit.prevent="sendMessage">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Enter reply message..."
            class="h-9 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            required
          />
          <button type="submit" class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700">
            <FeatherIcon name="send" size="14" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

