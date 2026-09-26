<template>
  <div class="page-wrapper cardhead">
    <div class="content">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2 mt-3">
          <div>
            <h3 class="page-title">Our Clients</h3>
            <ul class="breadcrumb">
              <li class="breadcrumb-item"><NuxtLink to="/">Dashboard</NuxtLink></li>
              <li class="breadcrumb-item active">List Our Clients</li>
            </ul>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="resetOrder">
              <i class="ti ti-rotate me-1"></i>Reset Order
            </button>
            <button type="button" class="btn btn-primary" @click="openAddModal">
              <i class="ti ti-plus me-1"></i>Add Client Logo
            </button>
          </div>
        </div>
      </div>

      <div class="alert alert-info d-flex align-items-center mb-4" role="alert">
        <i class="ti ti-info-circle fs-4 me-2"></i>
        <div>Drag or use arrows to reorder client logos on your public webstore homepage showcase.</div>
      </div>

      <!-- Client Grid -->
      <div class="row gy-4 drag-container">
        <div
          v-for="(client, index) in clients"
          :key="client.id"
          class="col-6 col-sm-4 col-md-3 col-lg-2 text-center"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
        >
          <div class="card h-100 shadow-sm border p-3 position-relative group hover:shadow-md transition-all">
            <div class="position-absolute top-2 end-2 d-flex gap-1 opacity-75 hover:opacity-100">
              <button
                type="button"
                class="btn btn-xs btn-light p-1"
                title="Move Left"
                :disabled="index === 0"
                @click="moveItem(index, -1)"
              >
                <i class="ti ti-chevron-left fs-12"></i>
              </button>
              <button
                type="button"
                class="btn btn-xs btn-light p-1"
                title="Move Right"
                :disabled="index === clients.length - 1"
                @click="moveItem(index, 1)"
              >
                <i class="ti ti-chevron-right fs-12"></i>
              </button>
              <button type="button" class="btn btn-xs btn-danger p-1 text-white" title="Delete" @click="deleteClient(client.id)">
                <i class="ti ti-trash fs-12"></i>
              </button>
            </div>

            <div class="d-flex align-items-center justify-content-center" style="height: 90px">
              <img
                v-if="client.logoUrl"
                :src="client.logoUrl"
                :alt="client.name"
                class="img-fluid object-fit-contain"
                style="max-height: 65px; max-width: 100%"
              />
              <div v-else class="text-secondary p-2">
                <i class="ti ti-building fs-1"></i>
              </div>
            </div>

            <div class="border-top pt-2 mt-2">
              <span class="text-dark small fw-semibold text-truncate d-block">{{ client.name }}</span>
              <span class="text-muted fs-11">Order #{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Client Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" style="background-color: rgba(0, 0, 0, 0.5)" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Client Logo</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveClient">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Client / Partner Name <span class="text-danger">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="e.g. Google, Telkom, Pertamina"
                    required
                  />
                </div>
                <div class="col-md-12">
                  <label class="form-label">Logo Image URL <span class="text-danger">*</span></label>
                  <input
                    v-model="form.logoUrl"
                    type="text"
                    class="form-control"
                    placeholder="https://example.com/logo.svg"
                    required
                  />
                </div>
                <div class="col-12" v-if="form.logoUrl">
                  <label class="form-label">Preview</label>
                  <div class="border p-3 rounded text-center bg-light">
                    <img :src="form.logoUrl" alt="Logo preview" style="max-height: 60px; max-width: 100%" />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">Save Client</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface ClientLogo {
  id: number;
  name: string;
  logoUrl: string;
}

const defaultClients: ClientLogo[] = [
  { id: 1, name: "Google Partner", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { id: 2, name: "YouTube Print", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
  { id: 3, name: "Microsoft 365", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { id: 4, name: "Amazon Media", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { id: 5, name: "Netflix Studio", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: 6, name: "Spotify Music", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  {
    id: 7,
    name: "Adobe Creative",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
  },
  { id: 8, name: "Intel Tech", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg" },
  { id: 9, name: "Cisco Networks", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
  { id: 10, name: "Oracle Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
  {
    id: 11,
    name: "Heidelberg Press",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Heidelberger_Druckmaschinen_logo.svg",
  },
  { id: 12, name: "Canon Solutions", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Canon_wordmark.svg" },
];

const clients = ref<ClientLogo[]>([...defaultClients]);
const draggedIndex = ref<number | null>(null);

// Modal state
const modalVisible = ref(false);
const form = ref({
  name: "",
  logoUrl: "",
});

function onDragStart(index: number) {
  draggedIndex.value = index;
}

function onDrop(targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return;
  const item = clients.value.splice(draggedIndex.value, 1)[0];
  clients.value.splice(targetIndex, 0, item);
  draggedIndex.value = null;
}

function moveItem(index: number, direction: number) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= clients.value.length) return;
  const item = clients.value.splice(index, 1)[0];
  clients.value.splice(newIndex, 0, item);
}

function deleteClient(id: number) {
  if (confirm("Delete this client logo from showcase?")) {
    clients.value = clients.value.filter((c) => c.id !== id);
  }
}

function resetOrder() {
  clients.value = [...defaultClients];
}

function openAddModal() {
  form.value = {
    name: "",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  };
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function saveClient() {
  const newId = clients.value.length ? Math.max(...clients.value.map((c) => c.id)) + 1 : 1;
  clients.value.push({
    id: newId,
    name: form.value.name,
    logoUrl: form.value.logoUrl,
  });
  closeModal();
}
</script>
