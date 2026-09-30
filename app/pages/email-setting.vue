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
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="setting-title mb-0">
                  <h4 class="fs-18 fw-bold">Email Settings</h4>
                </div>
                <button class="btn btn-outline-primary" @click="showTestMailModal = true">
                  <i class="ti ti-mail me-1"></i> Send Test Email
                </button>
              </div>

              <!-- Integration Cards -->
              <div class="row g-4">
                <!-- PHP Mailer -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                  <div class="card p-4 border shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="fw-bold mb-0">PHP Mailer</h5>
                        <div class="form-check form-switch mb-0">
                          <input v-model="services.phpMailer.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </div>
                      <p class="text-muted text-sm mb-4">Used to send emails directly via internal PHP server mail functions.</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                      <button class="btn btn-sm btn-outline-primary" @click="openConfigModal('phpMailer')">
                        <i class="ti ti-settings me-1"></i> Configure
                      </button>
                      <span :class="services.phpMailer.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                        {{ services.phpMailer.enabled ? 'Active' : 'Disabled' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- SMTP Mail -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                  <div class="card p-4 border shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="fw-bold mb-0">SMTP Mail</h5>
                        <div class="form-check form-switch mb-0">
                          <input v-model="services.smtp.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </div>
                      <p class="text-muted text-sm mb-4">Industry standard SMTP server connection (Gmail, Outlook, Hostinger, AWS SES).</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                      <button class="btn btn-sm btn-outline-primary" @click="openConfigModal('smtp')">
                        <i class="ti ti-settings me-1"></i> Configure
                      </button>
                      <span :class="services.smtp.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                        {{ services.smtp.enabled ? 'Active' : 'Disabled' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- SendGrid -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                  <div class="card p-4 border shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="fw-bold mb-0">SendGrid API</h5>
                        <div class="form-check form-switch mb-0">
                          <input v-model="services.sendgrid.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </div>
                      <p class="text-muted text-sm mb-4">Cloud-based transactional email delivery API for high deliverability.</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                      <button class="btn btn-sm btn-outline-primary" @click="openConfigModal('sendgrid')">
                        <i class="ti ti-settings me-1"></i> Configure
                      </button>
                      <span :class="services.sendgrid.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                        {{ services.sendgrid.enabled ? 'Connected' : 'Disabled' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Config Modal -->
      <div v-if="showConfigModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ activeServiceTitle }} Settings</h4>
              </div>
              <button type="button" class="btn-close" @click="showConfigModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveConfig">
                <template v-if="activeService === 'phpMailer'">
                  <div class="mb-3">
                    <label class="form-label">From Email Address</label>
                    <input v-model="services.phpMailer.fromEmail" type="email" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">From Name</label>
                    <input v-model="services.phpMailer.fromName" type="text" class="form-control" required />
                  </div>
                </template>

                <template v-else-if="activeService === 'smtp'">
                  <div class="mb-3">
                    <label class="form-label">SMTP Host</label>
                    <input v-model="services.smtp.host" type="text" class="form-control" required placeholder="smtp.gmail.com" />
                  </div>
                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <label class="form-label">Port</label>
                      <input v-model="services.smtp.port" type="text" class="form-control" required placeholder="587" />
                    </div>
                    <div class="col-6">
                      <label class="form-label">Encryption</label>
                      <select v-model="services.smtp.encryption" class="form-select">
                        <option value="TLS">TLS</option>
                        <option value="SSL">SSL</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Username / Email</label>
                    <input v-model="services.smtp.user" type="text" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input v-model="services.smtp.password" type="password" class="form-control" required />
                  </div>
                </template>

                <template v-else-if="activeService === 'sendgrid'">
                  <div class="mb-3">
                    <label class="form-label">SendGrid API Key</label>
                    <input v-model="services.sendgrid.apiKey" type="password" class="form-control" required placeholder="SG.xxxx" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Sender Email</label>
                    <input v-model="services.sendgrid.senderEmail" type="email" class="form-control" required placeholder="noreply@domain.com" />
                  </div>
                </template>

                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showConfigModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Mail Modal -->
      <div v-if="showTestMailModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>Send Test Email</h4>
              </div>
              <button type="button" class="btn-close" @click="showTestMailModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="mb-3">
                <label class="form-label">Recipient Email</label>
                <input v-model="testEmail" type="email" class="form-control" required placeholder="your.email@example.com" />
              </div>
              <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                <button type="button" class="btn btn-light" @click="showTestMailModal = false">Cancel</button>
                <button type="button" class="btn btn-warning text-white" @click="sendTest">Send Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Email Settings - Kacetak System'
})

const showConfigModal = ref(false)
const showTestMailModal = ref(false)
const activeService = ref<'phpMailer' | 'smtp' | 'sendgrid'>('smtp')
const testEmail = ref('')

const services = ref({
  phpMailer: {
    enabled: false,
    fromEmail: 'noreply@kacetak.com',
    fromName: 'Kacetak System'
  },
  smtp: {
    enabled: true,
    host: 'smtp.gmail.com',
    port: '587',
    encryption: 'TLS',
    user: 'admin@kacetak.com',
    password: '••••••••••••'
  },
  sendgrid: {
    enabled: false,
    apiKey: '',
    senderEmail: 'notifications@kacetak.com'
  }
})

const activeServiceTitle = computed(() => {
  switch (activeService.value) {
    case 'phpMailer': return 'PHP Mailer'
    case 'smtp': return 'SMTP Mail'
    case 'sendgrid': return 'SendGrid API'
  }
})

const openConfigModal = (service: 'phpMailer' | 'smtp' | 'sendgrid') => {
  activeService.value = service
  showConfigModal.value = true
}

const saveConfig = () => {
  showConfigModal.value = false
  alert(`${activeServiceTitle.value} configuration updated!`)
}

const sendTest = () => {
  alert(`Test email sent to ${testEmail.value}!`)
  showTestMailModal.value = false
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>

