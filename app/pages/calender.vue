<script setup lang="ts">
import type { CalendarConfig } from '~/types/calendar-setting'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Calendar Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { config, pending, refresh, saveCalendarConfig } = useCalendarSettings()
const activeTab = ref('products')

const isSaving = ref(false)
const saveSuccess = ref(false)

const handleSave = async () => {
  if (!config.value) return
  try {
    isSaving.value = true
    await saveCalendarConfig(config.value)
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to save calendar config:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Calendar Settings</h4>
          <h6 class="text-muted mb-0">Kelola master konfigurasi dan variabel kalkulator kalender</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
            <FeatherIcon name="rotate-cw" size="16" />
          </button>
          <button type="button" class="btn btn-primary btn-sm d-flex align-items-center gap-1" :disabled="isSaving" @click="handleSave">
            <FeatherIcon name="save" size="16" />
            <span>{{ isSaving ? 'Saving...' : 'Save All Settings' }}</span>
          </button>
        </div>
      </div>

      <div v-if="saveSuccess" class="alert alert-success d-flex align-items-center gap-2 mb-3">
        <FeatherIcon name="check-circle" size="16" />
        <span>Konfigurasi kalender berhasil disimpan!</span>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="config" class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <ul class="nav nav-tabs nav-tabs-solid mb-4 flex-wrap">
            <li class="nav-item">
              <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">
                Products ({{ config.products?.length || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'sizes' }" @click="activeTab = 'sizes'">
                Sizes ({{ config.sizes?.length || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'finishings' }" @click="activeTab = 'finishings'">
                Finishings ({{ config.finishings?.length || 0 }})
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link cursor-pointer" :class="{ active: activeTab === 'boards' }" @click="activeTab = 'boards'">
                Boards ({{ config.boards?.length || 0 }})
              </a>
            </li>
          </ul>

          <div v-if="activeTab === 'products'" class="table-responsive">
            <table class="table datanew align-middle">
              <thead class="thead-light">
                <tr>
                  <th>Product Name</th>
                  <th>Default Size</th>
                  <th>Paper Types</th>
                  <th>Machine</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in config.products" :key="p.id">
                  <td class="fw-bold">{{ p.name }}</td>
                  <td>{{ p.defaultSize }}</td>
                  <td>{{ p.paperTypes }}</td>
                  <td>{{ p.machine }}</td>
                  <td>
                    <span class="badge" :class="p.active ? 'bg-success' : 'bg-secondary'">
                      {{ p.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="activeTab === 'sizes'" class="table-responsive">
            <table class="table datanew align-middle">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Dimensions (cm)</th>
                  <th>Cut Width x Length</th>
                  <th>Plano</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in config.sizes" :key="s.id">
                  <td class="fw-bold">{{ s.name }}</td>
                  <td>{{ s.width }} x {{ s.length }} cm</td>
                  <td>{{ s.cutWidth }} x {{ s.cutLength }}</td>
                  <td>{{ s.planoWidth }} x {{ s.planoLength }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="activeTab === 'finishings'" class="table-responsive">
            <table class="table datanew align-middle">
              <thead class="thead-light">
                <tr>
                  <th>Finishing Name</th>
                  <th>Type</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in config.finishings" :key="f.id">
                  <td class="fw-bold">{{ f.name }}</td>
                  <td><span class="badge bg-light text-dark border">{{ f.type }}</span></td>
                  <td class="font-monospace">Rp {{ f.price?.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="activeTab === 'boards'" class="table-responsive">
            <table class="table datanew align-middle">
              <thead class="thead-light">
                <tr>
                  <th>Board Name</th>
                  <th>Thickness</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in config.boards" :key="b.id">
                  <td class="fw-bold">{{ b.name }}</td>
                  <td>{{ b.thickness }}</td>
                  <td class="font-monospace">Rp {{ b.price?.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
