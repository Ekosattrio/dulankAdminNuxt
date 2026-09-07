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
                  <h4 class="fs-18 fw-bold">Invoice Settings</h4>
                </div>

                <div class="card p-4 border shadow-sm mb-4">
                  <!-- Invoice Logo -->
                  <div class="row align-items-center mb-4 pb-4 border-bottom">
                    <div class="col-md-4">
                      <h6 class="fw-semibold mb-1">Invoice Logo</h6>
                      <p class="text-muted text-xs mb-0">Upload Logo of your Company to display in Invoice</p>
                    </div>
                    <div class="col-md-5">
                      <label class="btn btn-sm btn-outline-primary cursor-pointer mb-2">
                        <i class="ti ti-upload me-1"></i> Upload Photo
                        <input type="file" class="d-none" accept="image/*" @change="onLogoChange" />
                      </label>
                      <p class="text-muted text-xs mb-0">For better preview recommended size is 450px x 450px. Max size 5MB.</p>
                    </div>
                    <div class="col-md-3 text-end">
                      <img
                        :src="invoiceLogo || '/assets/img/logo-small.png'"
                        alt="Logo"
                        class="border rounded p-1"
                        style="max-height: 50px;"
                      />
                    </div>
                  </div>

                  <!-- Configuration Options -->
                  <div class="row align-items-center mb-3">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Invoice Prefix</h6>
                      <p class="text-muted text-xs mb-0">Add prefix to your invoice sequence</p>
                    </div>
                    <div class="col-sm-4">
                      <input v-model="form.prefix" type="text" class="form-control" />
                    </div>
                  </div>

                  <div class="row align-items-center mb-3">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Invoice Due</h6>
                      <p class="text-muted text-xs mb-0">Select default payment terms</p>
                    </div>
                    <div class="col-sm-4 d-flex align-items-center gap-2">
                      <select v-model="form.dueDays" class="form-select">
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="14">14</option>
                        <option value="30">30</option>
                      </select>
                      <span class="text-muted text-sm">Days</span>
                    </div>
                  </div>

                  <div class="row align-items-center mb-3">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Invoice Round Off</h6>
                      <p class="text-muted text-xs mb-0">Value rounding in printed invoice</p>
                    </div>
                    <div class="col-sm-4 d-flex align-items-center gap-3">
                      <div class="form-check form-switch mb-0">
                        <input v-model="form.roundOffEnabled" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                      <select v-model="form.roundOffType" class="form-select">
                        <option value="Round Off Up">Round Off Up</option>
                        <option value="Round Off Down">Round Off Down</option>
                        <option value="Nearest 100">Nearest 100</option>
                      </select>
                    </div>
                  </div>

                  <div class="row align-items-center mb-3">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Show Company Details</h6>
                      <p class="text-muted text-xs mb-0">Show or hide company address in invoice header</p>
                    </div>
                    <div class="col-sm-4">
                      <div class="form-check form-switch mb-0">
                        <input v-model="form.showCompanyDetails" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3 pt-3 border-top">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Invoice Header Terms</h6>
                      <p class="text-muted text-xs mb-0">Default notice shown at header</p>
                    </div>
                    <div class="col-sm-8">
                      <textarea v-model="form.headerTerms" rows="3" class="form-control" placeholder="Type header message..."></textarea>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-sm-4">
                      <h6 class="fw-semibold mb-1">Invoice Footer Terms</h6>
                      <p class="text-muted text-xs mb-0">Default payment notes / bank accounts</p>
                    </div>
                    <div class="col-sm-8">
                      <textarea v-model="form.footerTerms" rows="3" class="form-control" placeholder="Type footer message..."></textarea>
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
  title: 'Invoice Settings - Kacetak System'
})

const invoiceLogo = ref('/assets/img/logo-small.png')

const form = ref({
  prefix: 'INV -',
  dueDays: '7',
  roundOffEnabled: true,
  roundOffType: 'Round Off Up',
  showCompanyDetails: true,
  headerTerms: 'Terima kasih atas pesanan Anda di Percetakan Kacetak.',
  footerTerms: 'Pembayaran transfer melalui Rekening BCA 1234567890 a/n PT Dulank Media Sukses.'
})

const onLogoChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    invoiceLogo.value = URL.createObjectURL(target.files[0])
  }
}

const saveSettings = () => {
  alert('Invoice settings saved successfully!')
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
