// Mock data untuk halaman /support-ticket-detail (dipindah dari app/pages/support-ticket-detail.vue)
// Dikonsumsi oleh server/api (catch-all) via mock store.
export const activityList = [
  {
    time: "Just Now",
    title: "Ticket Resolved",
    detail: "Agent closed the ticket after applying a patch for the file upload freeze issue.",
    author: "Liam Brooks",
  },
  {
    time: "Today, 10:40 AM",
    title: 'Status Changed to "In Progress"',
    detail: "Ticket was picked up by the assigned agent for investigation.",
    author: "Liam Brooks",
  },
  {
    time: "Yesterday, 4:15 PM",
    title: "User Comment Added",
    detail: "User emphasized urgency due to impact on production file uploads.",
    author: "Ava Sullivan",
  },
  {
    time: "02 Aug, 2025 - 3:00 PM",
    title: "Ticket Created",
    detail: "Ticket submitted regarding the app freezing on file upload.",
    author: "Ava Sullivan",
  },
]
export const messages = [
  { text: "Thanks for your time earlier!", time: "09:45 am", isMe: false },
  { text: "Of course! It was a productive discussion.", time: "09:46 am", isMe: true },
  { text: "I'll send over the updated files by noon.", time: "09:50 am", isMe: false },
]
