<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="row">
        <!-- Ticket Detail Section -->
        <div class="col-lg-8 mb-4">
          <div class="card p-4">
            <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <h5 class="mb-0 fw-bold">#SUP-2523 - App freezes when uploading files</h5>
              <span class="badge" :class="ticketStatus === 'Closed' ? 'bg-success text-white' : 'bg-warning text-dark'">
                {{ ticketStatus }}
              </span>
            </div>

            <div class="row mb-4 g-3">
              <div class="col-md-4">
                <div class="fw-bold text-muted small mb-1">REQUESTED BY</div>
                <div class="d-flex align-items-center">
                  <img
                    src="/assets/img/users/user-23.jpg"
                    alt="Ava Sullivan"
                    class="rounded-circle me-2"
                    width="36"
                    height="36"
                  />
                  <span class="fw-medium">Ava Sullivan</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="fw-bold text-muted small mb-1">ASSIGNED AGENT</div>
                <div class="d-flex align-items-center">
                  <img src="/assets/img/users/user-24.jpg" alt="Liam Brooks" class="rounded-circle me-2" width="36" height="36" />
                  <span class="fw-medium">Liam Brooks</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="fw-bold text-muted small mb-1">PRIORITY</div>
                <span class="badge bg-danger">High</span>
              </div>
            </div>

            <div class="row mb-4 g-3">
              <div class="col-md-6">
                <div class="fw-bold text-muted small mb-1">CREATED ON</div>
                <span>05 Aug, 2025 1:20 PM</span>
              </div>
              <div class="col-md-6">
                <div class="fw-bold text-muted small mb-1">DUE DATE</div>
                <span>09 Aug, 2025</span>
              </div>
            </div>

            <div class="mb-4">
              <div class="fw-bold text-muted small mb-1">DESCRIPTION</div>
              <div class="p-3 bg-light rounded text-dark">
                When trying to upload files through the project form, the application becomes unresponsive after selecting a file
                larger than 5MB. This issue occurs consistently across browsers. Please investigate and apply a fix.
              </div>
            </div>

            <div class="mb-4">
              <div class="fw-bold text-muted small mb-1">TAGS</div>
              <span class="badge bg-light text-dark border me-1">Upload</span>
              <span class="badge bg-light text-dark border me-1">Performance</span>
              <span class="badge bg-light text-dark border">UI Bug</span>
            </div>

            <div>
              <div class="fw-bold text-muted small mb-3">ACTIVITY TIMELINE:</div>
              <ul class="list-unstyled ps-2 border-start border-2 ms-2">
                <li v-for="(act, idx) in activityList" :key="idx" class="mb-4 ps-3 position-relative">
                  <div class="d-flex align-items-center mb-1">
                    <span class="badge bg-primary me-2 rounded-circle p-1"></span>
                    <span class="fw-bold small">{{ act.time }}</span>
                  </div>
                  <div class="fw-bold text-dark">{{ act.title }}</div>
                  <div class="text-muted small mb-1">{{ act.detail }}</div>
                  <div class="text-primary small">By {{ act.author }}</div>
                </li>
              </ul>
            </div>

            <div class="mt-4 pt-3 border-top d-flex gap-2 flex-wrap">
              <button type="button" class="btn btn-primary" @click="editTicket">Edit Ticket</button>
              <button
                type="button"
                class="btn"
                :class="ticketStatus === 'Closed' ? 'btn-outline-secondary' : 'btn-danger'"
                @click="toggleTicketClose"
              >
                {{ ticketStatus === "Closed" ? "Reopen Ticket" : "Close Ticket" }}
              </button>
              <NuxtLink to="/ticket-list" class="btn btn-outline-primary">Back to List</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="col-lg-4">
          <div class="card p-3 shadow-sm">
            <div class="fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>Ticket Chat</span>
              <span class="badge bg-success small">Online</span>
            </div>
            <div class="mb-3 p-2 bg-light rounded" style="max-height: 380px; min-height: 280px; overflow-y: auto">
              <div v-for="(msg, i) in messages" :key="i" class="mb-3" :class="msg.isMe ? 'd-flex flex-row-reverse' : 'd-flex'">
                <div style="max-width: 80%">
                  <div class="rounded px-3 py-2 mb-1" :class="msg.isMe ? 'bg-primary text-white' : 'bg-white border text-dark'">
                    {{ msg.text }}
                  </div>
                  <div class="text-muted small" :class="msg.isMe ? 'text-end' : ''">{{ msg.time }}</div>
                </div>
              </div>
            </div>
            <form class="d-flex gap-2" @submit.prevent="sendMessage">
              <input v-model="newMessage" type="text" class="form-control" placeholder="Enter reply message..." required />
              <button class="btn btn-primary" type="submit"><i class="ti ti-send"></i></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: "Ticket Detail - Kacetak System",
});

const ticketStatus = ref("Pending");

const activityList = ref([
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
]);

const messages = ref([
  { text: "Thanks for your time earlier!", time: "09:45 am", isMe: false },
  { text: "Of course! It was a productive discussion.", time: "09:46 am", isMe: true },
  { text: "I'll send over the updated files by noon.", time: "09:50 am", isMe: false },
]);

const newMessage = ref("");

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  messages.value.push({
    text: newMessage.value.trim(),
    time: timeStr,
    isMe: true,
  });
  newMessage.value = "";
};

const editTicket = () => {
  alert("Edit ticket dialog opened.");
};

const toggleTicketClose = () => {
  ticketStatus.value = ticketStatus.value === "Closed" ? "In Progress" : "Closed";
};
</script>
