<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Contact Form Messages</h4>
            <h6>Manage public inquiries, quotation requests, and feedback</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
      </div>

      <!-- Stats Widget -->
      <div class="row mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-primary bg-opacity-10 p-3 rounded">
              <i class="ti ti-mail-opened fs-2 text-primary"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Total Inquiries</h6>
              <h4 class="fw-bold mb-0">{{ messages.length }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-warning bg-opacity-10 p-3 rounded">
              <i class="ti ti-clock fs-2 text-warning"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Pending Replies</h6>
              <h4 class="fw-bold mb-0">{{ pendingCount }}</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 shadow-sm border p-3 rounded bg-white d-flex align-items-center">
            <div class="dash-widgetimg me-3 bg-success bg-opacity-10 p-3 rounded">
              <i class="ti ti-check fs-2 text-success"></i>
            </div>
            <div class="dash-widgetcontent">
              <h6 class="text-muted small mb-1">Answered</h6>
              <h4 class="fw-bold mb-0">{{ answeredCount }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search name, email, or message..." />
              </div>
              <div class="dropdown">
                <button
                  class="btn btn-white dropdown-toggle d-inline-flex align-items-center"
                  type="button"
                  @click="statusDropdownOpen = !statusDropdownOpen"
                >
                  Status: {{ filterStatus || 'All' }}
                  <i class="ti ti-chevron-down ms-1"></i>
                </button>
                <ul v-if="statusDropdownOpen" class="dropdown-menu p-2 show" style="display: block; position: absolute;">
                  <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = ''; statusDropdownOpen = false">All Status</a></li>
                  <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = 'Pending'; statusDropdownOpen = false">Pending</a></li>
                  <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterStatus = 'Answered'; statusDropdownOpen = false">Answered</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="table-responsive product-list">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style="min-width: 250px;">Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in filteredMessages" :key="m.id">
                  <td class="fw-semibold text-dark">{{ m.name }}</td>
                  <td>
                    <a :href="`mailto:${m.email}`" class="text-primary">{{ m.email }}</a>
                  </td>
                  <td>
                    <a :href="`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`" target="_blank" class="text-success text-decoration-none">
                      <i class="ti ti-brand-whatsapp me-1"></i>{{ m.phone }}
                    </a>
                  </td>
                  <td class="text-wrap small text-muted">{{ m.message }}</td>
                  <td>{{ m.date }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="m.status === 'Answered' ? 'badge-success' : 'badge-warning'"
                    >
                      • {{ m.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="View / Reply"
                        @click="openReplyModal(m)"
                      >
                        <i class="ti ti-eye fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete"
                        @click="deleteMessage(m.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMessages.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">
                    No contact messages found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply / Detail Modal -->
    <div
      v-if="modalVisible && activeMessage"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Inquiry Details — {{ activeMessage.name }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <div class="modal-body pb-0">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Sender Name</label>
                <p class="fw-semibold text-dark">{{ activeMessage.name }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Received Date</label>
                <p class="fw-semibold text-dark">{{ activeMessage.date }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Email</label>
                <p><a :href="`mailto:${activeMessage.email}`" class="text-primary">{{ activeMessage.email }}</a></p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Phone</label>
                <p class="fw-semibold">{{ activeMessage.phone }}</p>
              </div>
              <div class="col-12">
                <label class="form-label text-muted small mb-0">Original Message</label>
                <div class="p-3 bg-light rounded border text-dark">
                  {{ activeMessage.message }}
                </div>
              </div>
              <div class="col-12">
                <label class="form-label fw-medium">Quick Reply via Email</label>
                <textarea v-model="replyText" rows="3" class="form-control" placeholder="Write response to customer..."></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer modal-action-footer justify-content-end gap-2">
            <button type="button" class="btn btn-dark modal-action-cancel" @click="modalVisible = false">Close</button>
            <button type="button" class="btn btn-primary modal-action-submit" @click="sendReply">
              <i class="ti ti-send me-1"></i>Send Response
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  message: string
  date: string
  status: 'Pending' | 'Answered'
}

const messages = ref<ContactMessage[]>([
  { id: 1, name: 'John Doe', email: 'john.doe@email.com', phone: '+62 812 3456 7890', message: 'Hello, I want to know more about your hardbox packaging and minimum order quantity.', date: '20/01/2024', status: 'Pending' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+62 823 4567 8901', message: 'Can I get a price list for bulk orders of 10,000 pcs brochures?', date: '15/01/2024', status: 'Answered' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@email.com', phone: '+62 834 5678 9012', message: 'I have an issue with the cutting registration on my last job order.', date: '05/12/2023', status: 'Pending' },
  { id: 4, name: 'Sarah Jones', email: 'sarah.jones@email.com', phone: '+62 845 6789 0123', message: 'Do you offer expedited delivery to Bali for wedding invitations?', date: '22/11/2023', status: 'Answered' },
  { id: 5, name: 'David Williams', email: 'david.williams@email.com', phone: '+62 856 7890 1234', message: 'Thank you for the fast response on the quotation!', date: '10/10/2023', status: 'Answered' },
  { id: 6, name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+62 867 8901 2345', message: 'Looking for partnership opportunities for local publishing distribution.', date: '01/09/2023', status: 'Pending' },
  { id: 7, name: 'Chris Wilson', email: 'chris.wilson@email.com', phone: '+62 878 9012 3456', message: 'How do I download tax invoice PPN reports from my client portal?', date: '19/08/2023', status: 'Answered' }
])

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const pendingCount = computed(() => messages.value.filter(m => m.status === 'Pending').length)
const answeredCount = computed(() => messages.value.filter(m => m.status === 'Answered').length)

const filteredMessages = computed(() => {
  return messages.value.filter(m => {
    const matchStatus = !filterStatus.value || m.status === filterStatus.value
    const matchQuery = !searchQuery.value ||
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.phone.includes(searchQuery.value) ||
      m.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchQuery
  })
})

const modalVisible = ref(false)
const activeMessage = ref<ContactMessage | null>(null)
const replyText = ref('')

function openReplyModal(m: ContactMessage) {
  activeMessage.value = m
  replyText.value = `Dear ${m.name},\n\nThank you for contacting Dulank Printing. Regarding your inquiry:\n`
  modalVisible.value = true
}

function sendReply() {
  if (!replyText.value.trim()) {
    alert('Please enter a reply message.')
    return
  }
  if (activeMessage.value) {
    activeMessage.value.status = 'Answered'
  }
  alert('Reply sent successfully to ' + activeMessage.value?.email)
  modalVisible.value = false
}

function deleteMessage(id: number) {
  if (confirm('Are you sure you want to delete this contact message?')) {
    messages.value = messages.value.filter(m => m.id !== id)
  }
}

function exportPdf() {
  alert('Exporting messages as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>

