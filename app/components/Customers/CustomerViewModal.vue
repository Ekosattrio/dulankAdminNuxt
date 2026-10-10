<script setup lang="ts">
import type { Customer } from '~/types/customer'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  isOpen: boolean
  customer?: Customer | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-address', customer: Customer): void
}>()
</script>

<template>
  <div v-if="isOpen && customer" class="modal-backdrop-custom">
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 550px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">Customer Details</h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <div class="space-y-3">
            <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mb-3">
              <div>
                <span class="text-xs text-muted d-block">Customer ID</span>
                <span class="fw-bold fs-5 text-primary">{{ customer.customerId }}</span>
              </div>
              <span class="badge bg-primary px-3 py-1.5">{{ customer.type }}</span>
            </div>

            <div class="row g-3">
              <div class="col-6">
                <span class="text-xs text-muted d-block">Full Name</span>
                <span class="fw-semibold text-dark">{{ customer.name }}</span>
              </div>
              <div class="col-6">
                <span class="text-xs text-muted d-block">Email</span>
                <span class="fw-semibold text-dark">{{ customer.email }}</span>
              </div>
              <div class="col-6">
                <span class="text-xs text-muted d-block">Contact Phone</span>
                <span class="fw-semibold text-dark">{{ customer.phone }}</span>
              </div>
              <div class="col-6">
                <span class="text-xs text-muted d-block">Current Balance</span>
                <span class="fw-bold text-success">Rp {{ formatNumber(customer.balance) }}</span>
              </div>
              <div class="col-6">
                <span class="text-xs text-muted d-block">Join Channel</span>
                <span class="badge bg-light text-dark border">{{ customer.channel }}</span>
              </div>
              <div class="col-6">
                <span class="text-xs text-muted d-block">Date Registered</span>
                <span class="small text-muted">{{ customer.dateJoin }}</span>
              </div>
            </div>

            <!-- Flow Action Link: Manage Addresses directly from customer view -->
            <div class="mt-4 p-3 border rounded-3 bg-light-primary d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0 fw-bold text-dark">Delivery Addresses</h6>
                <small class="text-muted">Manage shipping locations for this client</small>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                @click="emit('add-address', customer); emit('close')"
              >
                + Add Address
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer justify-content-end p-0 pt-3 mt-3 border-top">
            <button type="button" class="btn btn-secondary" @click="emit('close')">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 15px;
}
</style>


