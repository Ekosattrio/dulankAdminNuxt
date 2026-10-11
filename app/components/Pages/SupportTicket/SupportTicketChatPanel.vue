<script setup lang="ts">
import type { SupportTicket } from '#server/types/support-ticket'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{ ticket: SupportTicket; busy?: boolean }>()
const emit = defineEmits<{ send: [message: string] }>()
const value = ref('')

function submit() {
  const message = value.value.trim()
  if (!message) return
  emit('send', message)
  value.value = ''
}
</script>

<template>
  <aside class="flex min-h-[420px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <h2 class="app-section-title border-b border-gray-100 pb-3 dark:border-gray-800">Chat</h2>
    <div class="flex-1 space-y-3 overflow-y-auto py-4">
      <div v-for="message in ticket.chat || []" :key="message.id" class="flex" :class="message.isMe ? 'justify-end' : 'justify-start'">
        <div class="max-w-[85%]">
          <p class="rounded-lg px-3 py-2 text-sm" :class="message.isMe ? 'bg-primary text-white' : 'border border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'">{{ message.message }}</p>
          <p class="mt-1 text-xs text-gray-500" :class="message.isMe ? 'text-right' : ''">{{ message.senderName }} · {{ message.time }}</p>
        </div>
      </div>
      <p v-if="!ticket.chat?.length" class="py-10 text-center text-sm text-gray-500">No chat messages yet.</p>
    </div>
    <form class="flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800" @submit.prevent="submit">
      <input v-model="value" type="text" required class="h-9 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-800" placeholder="Enter message..." />
      <button type="submit" :disabled="busy || !value.trim()" class="flex size-9 items-center justify-center rounded-md bg-primary text-white disabled:opacity-60" aria-label="Send message"><FeatherIcon name="send" :size="16" /></button>
    </form>
  </aside>
</template>
