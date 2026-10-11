<script setup lang="ts">
import type { SupportTicket } from '#server/types/support-ticket'

defineProps<{ ticket: SupportTicket; busy?: boolean }>()
defineEmits<{
  edit: []
  'update-status': [status: SupportTicket['status']]
}>()

function statusClass(status: SupportTicket['status']) {
  if (status === 'Closed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  return 'bg-sky-100 text-sky-700'
}

function priorityClass(priority: SupportTicket['priority']) {
  if (priority === 'High') return 'bg-rose-100 text-rose-700'
  if (priority === 'Medium') return 'bg-sky-100 text-sky-700'
  return 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
    <div class="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
      <h1 class="app-page-title mr-auto">{{ ticket.ticketNo }} - {{ ticket.subject }}</h1>
      <span class="rounded px-2 py-1 text-xs font-semibold" :class="statusClass(ticket.status)">{{ ticket.status }}</span>
    </div>

    <div class="mt-5 grid gap-4 sm:grid-cols-3">
      <div>
        <p class="app-supporting-text font-semibold uppercase">Requested By</p>
        <div class="mt-2 flex items-center gap-2">
          <img :src="ticket.avatar || '/assets/img/users/user-23.jpg'" :alt="ticket.requestedBy" class="size-9 rounded-full object-cover" />
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ ticket.requestedBy }}</p>
            <p class="text-xs text-gray-500">{{ ticket.customerEmail }}</p>
          </div>
        </div>
      </div>
      <div>
        <p class="app-supporting-text font-semibold uppercase">Assigned Agent</p>
        <p class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ ticket.assignee }}</p>
      </div>
      <div>
        <p class="app-supporting-text font-semibold uppercase">Priority</p>
        <span class="mt-2 inline-flex rounded px-2 py-1 text-xs font-semibold" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span>
      </div>
    </div>

    <div class="mt-5 grid gap-4 sm:grid-cols-3">
      <div><p class="app-supporting-text font-semibold uppercase">Created On</p><p class="mt-1 text-sm">{{ ticket.createdDate }}</p></div>
      <div><p class="app-supporting-text font-semibold uppercase">Due Date</p><p class="mt-1 text-sm">{{ ticket.dueDate }}</p></div>
    </div>

    <div class="mt-5">
      <p class="app-supporting-text font-semibold uppercase">Description</p>
      <p class="mt-2 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ ticket.description || 'No description provided.' }}</p>
    </div>

    <div v-if="ticket.tags?.length" class="mt-5">
      <p class="app-supporting-text font-semibold uppercase">Tags</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <span v-for="tag in ticket.tags" :key="tag" class="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ tag }}</span>
      </div>
    </div>

    <div class="mt-5">
      <p class="app-supporting-text font-semibold uppercase">Activity:</p>
      <div v-if="ticket.activities?.length" class="mt-3 space-y-4 border-l-2 border-gray-200 pl-5 dark:border-gray-700">
        <article v-for="(activity, index) in ticket.activities" :key="activity.id || index" class="relative">
          <span class="absolute -left-[25px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-gray-900" />
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ activity.timeAgo }}</p>
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ activity.title }}</p>
          <p class="text-xs text-gray-500">{{ activity.description }}</p>
          <p class="text-xs text-primary">By {{ activity.author }}</p>
        </article>
      </div>
      <p v-else class="mt-2 text-sm text-gray-500">No activity recorded.</p>
    </div>

    <div class="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-white disabled:opacity-60" :disabled="busy" @click="$emit('edit')">Edit Ticket</button>
      <button v-if="ticket.status !== 'Closed'" type="button" class="h-9 rounded-md bg-rose-600 px-4 text-sm font-medium text-white disabled:opacity-60" :disabled="busy" @click="$emit('update-status', 'Closed')">Close Ticket</button>
      <button v-else type="button" class="h-9 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white disabled:opacity-60" :disabled="busy" @click="$emit('update-status', 'Open')">Reopen Ticket</button>
      <NuxtLink to="/support-ticket" class="inline-flex h-9 items-center rounded-md border border-primary px-4 text-sm font-medium text-primary">Back to List</NuxtLink>
    </div>
  </section>
</template>
