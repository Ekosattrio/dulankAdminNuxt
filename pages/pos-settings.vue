<template>
  <div class="page-wrapper">
    <div class="content settings-content">
      <div class="page-header settings-pg-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <form @submit.prevent="saveSettings">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">POS Settings</h4>
                </div>

                <div class="card p-4 border shadow-sm mb-4">
                  <!-- POS Printer Paper Size -->
                  <div class="row align-items-center mb-4">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">POS Receipt Printer</h6>
                      <p class="text-muted text-xs mb-0">Select default paper format for receipt slip</p>
                    </div>
                    <div class="col-sm-4">
                      <select v-model="form.printerSize" class="form-select">
                        <option value="Thermal 80mm">Thermal 80mm</option>
                        <option value="Thermal 58mm">Thermal 58mm</option>
                        <option value="A4">A4 Full Page</option>
                      </select>
                    </div>
                  </div>

                  <!-- Allowed Payment Methods in POS -->
                  <div class="row align-items-center mb-4">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Payment Method</h6>
                      <p class="text-muted text-xs mb-0">Enable allowed payment methods at POS register</p>
                    </div>
                    <div class="col-sm-8">
                      <div class="d-flex flex-wrap gap-3">
                        <label v-for="method in availableMethods" :key="method" class="form-check d-flex align-items-center gap-2 cursor-pointer mb-0">
                          <input
                            v-model="form.methods"
                            type="checkbox"
                            class="form-check-input mt-0"
                            :value="method"
                          />
                          <span class="text-sm font-medium">{{ method }}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Enable Sound Effect -->
                  <div class="row align-items-center mb-4">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Enable Sound Effect</h6>
                      <p class="text-muted text-xs mb-0">Audio beep feedback on barcode scan and checkout</p>
                    </div>
                    <div class="col-sm-4">
                      <div class="form-check form-switch mb-0">
                        <input v-model="form.enableSound" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </div>

                  <!-- Auto Print Slip -->
                  <div class="row align-items-center mb-4">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Auto Print Receipt</h6>
                      <p class="text-muted text-xs mb-0">Automatically trigger print dialog after successful payment</p>
                    </div>
                    <div class="col-sm-4">
                      <div class="form-check form-switch mb-0">
                        <input v-model="form.autoPrint" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                    <button type="button" class="btn btn-light" @click="resetForm">Cancel</button>
                    <button type="submit" class="btn btn-warning text-white">Save Changes</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'POS Settings - Kacetak System'
})

const availableMethods = ['Cash', 'Bank Transfer', 'QRIS', 'Card / EDC', 'COD', 'Cheque']

const form = ref({
  printerSize: 'Thermal 80mm',
  methods: ['Cash', 'Bank Transfer', 'QRIS', 'Card / EDC'],
  enableSound: true,
  autoPrint: true
})

const saveSettings = () => {
  alert('POS Settings saved successfully!')
}

const resetForm = () => {
  // reset
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
