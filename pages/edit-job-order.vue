<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header mb-4">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Edit Job Order</h4>
            <h6>Configure workflow routing and production scheduling per product</h6>
          </div>
        </div>
        <div class="page-btn">
          <NuxtLink to="/orders" class="btn btn-secondary">
            <i class="ti ti-arrow-left me-1"></i>Back to Orders
          </NuxtLink>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Panel: Sales Information & Product Order Details -->
        <div class="col-lg-4 col-12">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white border-bottom py-3">
              <h6 class="fw-bold mb-0">Sales Information</h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-2 small mb-4">
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Sales Date:</span>
                  <span class="fw-bold">17/12/2025</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">No Sales:</span>
                  <span class="fw-bold text-primary">25250025452</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Customer:</span>
                  <span class="fw-bold">PT. Makmur Abadi</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Shipping:</span>
                  <span class="badge bg-light text-dark border">Pick Up</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Order Summary:</span>
                  <span class="fw-bold">{{ orderProducts.length }} Products</span>
                </div>
              </div>

              <h6 class="fw-bold border-top pt-3 mb-3">Order Items</h6>
              <div class="d-flex flex-column gap-2">
                <div
                  v-for="(prod, idx) in orderProducts"
                  :key="prod.id"
                  class="p-2 rounded border"
                  :class="selectedProductIndex === idx ? 'bg-light border-primary' : 'bg-white'"
                  style="cursor: pointer;"
                  @click="selectedProductIndex = idx"
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <div class="fw-bold small text-dark">{{ prod.name }}</div>
                      <div class="text-muted small">{{ prod.jobTitle }}</div>
                    </div>
                    <span class="badge" :class="selectedProductIndex === idx ? 'bg-primary' : 'bg-secondary'">
                      {{ selectedProductIndex === idx ? 'Editing' : 'Manage' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Manage Selected Product's Workflow -->
        <div class="col-lg-8 col-12" v-if="currentProduct">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 class="fw-bold mb-0">Manage Job Order: {{ currentProduct.name }}</h5>
                <span class="text-muted small">Job Title: {{ currentProduct.jobTitle }}</span>
              </div>
              <span class="badge bg-warning text-dark">{{ currentProduct.priority }}</span>
            </div>
            <div class="card-body p-4">
              <!-- Specs Overview -->
              <div class="row g-3 mb-4 p-3 bg-light rounded-3">
                <div class="col-md-3">
                  <label class="form-label small text-muted mb-0">Quantity</label>
                  <div class="fw-bold">{{ currentProduct.qty }}</div>
                </div>
                <div class="col-md-5">
                  <label class="form-label small text-muted mb-0">Description</label>
                  <div class="small">{{ currentProduct.description }}</div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small text-muted mb-1">Priority</label>
                  <select v-model="currentProduct.priority" class="form-select form-select-sm">
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <!-- Workflow Steps List -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Sequential Work Flow Steps</h6>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addWorkflowStep">
                  <i class="ti ti-plus me-1"></i>Add Flow Step
                </button>
              </div>

              <div class="d-flex flex-column gap-3 mb-4">
                <div
                  v-for="(step, sIdx) in currentProduct.workflow"
                  :key="step.id"
                  class="card border p-3"
                >
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <span class="badge bg-dark rounded-circle px-2">{{ sIdx + 1 }}</span>
                      <h6 class="fw-bold mb-0 text-primary">{{ step.flowName }}</h6>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                      <button
                        v-if="sIdx > 0"
                        type="button"
                        class="btn btn-sm btn-icon text-secondary"
                        title="Move Up"
                        @click="moveStep(sIdx, -1)"
                      >
                        <i class="ti ti-arrow-up"></i>
                      </button>
                      <button
                        v-if="sIdx < currentProduct.workflow.length - 1"
                        type="button"
                        class="btn btn-sm btn-icon text-secondary"
                        title="Move Down"
                        @click="moveStep(sIdx, 1)"
                      >
                        <i class="ti ti-arrow-down"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger ms-2"
                        title="Remove Step"
                        @click="removeStep(sIdx)"
                      >
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label small text-muted mb-1">Branch Destination</label>
                      <select v-model="step.branch" class="form-select form-select-sm">
                        <option value="Dulank Karawang">Dulank Karawang</option>
                        <option value="Dulank Jakarta">Dulank Jakarta</option>
                        <option value="Dulank Cirebon">Dulank Cirebon</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small text-muted mb-1">Assigned Operator</label>
                      <input v-model="step.assignee" type="text" class="form-control form-control-sm" placeholder="Operator name" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small text-muted mb-1">Incentive (Rp)</label>
                      <input v-model.number="step.incentive" type="number" class="form-control form-control-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Changes -->
              <div class="d-flex justify-content-end gap-2">
                <NuxtLink to="/orders" class="btn btn-secondary">Cancel</NuxtLink>
                <button type="button" class="btn btn-warning" @click="saveJobOrder">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Edit Job Order - Kacetak System'
})

interface WorkflowStep {
  id: number
  flowName: string
  branch: string
  assignee: string
  incentive: number
}

interface OrderProduct {
  id: number
  name: string
  jobTitle: string
  description: string
  qty: string
  priority: 'Urgent' | 'High' | 'Normal' | 'Low'
  workflow: WorkflowStep[]
}

const orderProducts = ref<OrderProduct[]>([
  {
    id: 1,
    name: 'Brosur Full Color Promo',
    jobTitle: 'Brosur SMKN 1 Karawang',
    description: 'Brosur Full Color A4 (210x297 mm), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan',
    qty: '15 Rim',
    priority: 'Urgent',
    workflow: [
      { id: 101, flowName: 'Cetak Multilith', branch: 'Dulank Karawang', assignee: 'Abdul', incentive: 1500 },
      { id: 102, flowName: 'Potong Sisir', branch: 'Dulank Karawang', assignee: 'Nurdin', incentive: 500 },
      { id: 103, flowName: 'Finishing Packing', branch: 'Dulank Karawang', assignee: 'Rapli', incentive: 300 }
    ]
  },
  {
    id: 2,
    name: 'Yasin Soft Cover 192 HVS',
    jobTitle: '40 Hari Alm Kusnadi',
    description: 'Buku Yasin 192 Halaman HVS, Cover Art Carton 260gr Doff + Poly Emas',
    qty: '200 Pcs',
    priority: 'High',
    workflow: [
      { id: 201, flowName: 'Cetak Isi Digital', branch: 'Dulank Jakarta', assignee: 'Dani', incentive: 2000 },
      { id: 202, flowName: 'Hot Print Foil Cover', branch: 'Dulank Jakarta', assignee: 'Adul', incentive: 1000 },
      { id: 203, flowName: 'Jilid Lem Panas (Binding)', branch: 'Dulank Jakarta', assignee: 'Arif', incentive: 1500 }
    ]
  }
])

const selectedProductIndex = ref(0)

const currentProduct = computed(() => {
  return orderProducts.value[selectedProductIndex.value] || null
})

function moveStep(idx: number, delta: number) {
  if (!currentProduct.value) return
  const list = currentProduct.value.workflow
  const targetIdx = idx + delta
  if (targetIdx >= 0 && targetIdx < list.length) {
    const temp = list[idx]
    list[idx] = list[targetIdx]
    list[targetIdx] = temp
  }
}

function removeStep(idx: number) {
  if (currentProduct.value && confirm('Remove this workflow step?')) {
    currentProduct.value.workflow.splice(idx, 1)
  }
}

function addWorkflowStep() {
  if (currentProduct.value) {
    currentProduct.value.workflow.push({
      id: Date.now(),
      flowName: 'New Operation Process',
      branch: 'Dulank Karawang',
      assignee: 'Unassigned',
      incentive: 1000
    })
  }
}

function saveJobOrder() {
  alert('Job Order workflow updated successfully!')
}
</script>
