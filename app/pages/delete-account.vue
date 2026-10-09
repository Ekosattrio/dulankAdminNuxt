<<<<<<< HEAD
<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Delete Account Request</h4>
            <h6>Review and process user account deletion requests</h6>
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
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="card table-list-card">
        <div class="card-body pb-0">
          <div class="table-top table-top-two d-flex justify-content-between align-items-center mb-3">
            <div class="input-blocks search-set mb-0">
              <div class="search-input position-relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search user or email..."
                />
              </div>
            </div>
            <div class="search-path d-flex align-items-center search-path-new">
              <div class="form-sort">
                <select v-model="sortOrder" class="form-select form-select-sm">
                  <option value="newest">Sort by Date: Newest</option>
                  <option value="oldest">Sort by Date: Oldest</option>
                </select>
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>User Name</th>
                  <th>Requisition Date</th>
                  <th>Delete Request Date</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(req, idx) in filteredRequests" :key="idx">
                  <td>{{ req.email }}</td>
                  <td>
                    <div class="userimgname d-flex align-items-center gap-2">
                      <a href="javascript:void(0);" class="product-img">
                        <img :src="req.avatar" alt="user" class="rounded-circle" style="width: 32px; height: 32px; object-fit: cover;" />
                      </a>
                      <div>
                        <a href="javascript:void(0);" class="fw-semibold text-dark">{{ req.name }}</a>
                      </div>
                    </div>
                  </td>
                  <td>{{ req.requisitionDate }}</td>
                  <td>{{ req.requestDate }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action d-inline-flex">
                      <button
                        class="btn btn-sm btn-outline-danger p-2"
                        title="Delete / Process Request"
                        @click="deleteRequest(idx)"
                      >
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredRequests.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">No delete requests found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Delete Account Request - Kacetak System'
})

const searchQuery = ref('')
const sortOrder = ref('newest')

const { data: deleteAccountData } = await useFetch<any[]>('/api/delete-account')
const requests = ref(deleteAccountData.value ?? [])

const filteredRequests = computed(() => {
  return requests.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    return item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)
  })
})

const deleteRequest = (index: number) => {
  if (confirm('Are you sure you want to permanently delete this user account?')) {
    requests.value.splice(index, 1)
  }
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  // refresh list
}

const toggleCollapse = () => {
  // toggle
}
</script>


useMockSync('delete-account', requests);
=======
<script setup lang="ts">
import DeleteAccountWorkspace from '~/components/pages/delete-account/DeleteAccountWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Delete Account Request - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-delete-account p-4 md:p-6">
    <DeleteAccountWorkspace />
  </div>
</template>
>>>>>>> origin/eko
