<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header justify-content-between">
        <div class="page-title">
          <h4>Input Tax (Pajak Masukan)</h4>
          <h6>Manage your Purchase & Input VAT Invoices</h6>
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

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search purchase no, faktur, supplier..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterCredited" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Credited</option>
                <option value="Yes">Credited: Yes</option>
                <option value="No">Credited: No</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No. Purchase</th>
                  <th>Date e-tax Invoice</th>
                  <th>Supplier Faktur No.</th>
                  <th>Supplier Name</th>
                  <th class="text-end">Tax Base / DPP</th>
                  <th class="text-end">VAT - Input Tax</th>
                  <th class="text-center">Credited</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredInvoices" :key="item.id">
                  <td class="fw-semibold text-primary">{{ item.purchaseNo }}</td>
                  <td>{{ item.invoiceDate }}</td>
                  <td class="fw-medium">{{ item.fakturNo }}</td>
                  <td>{{ item.supplierName }}</td>
                  <td class="text-end">{{ formatNumber(item.dpp) }}</td>
                  <td class="text-end fw-semibold text-success">{{ formatNumber(item.vat) }}</td>
                  <td class="text-center">
                    <span class="badge" :class="item.credited === 'Yes' ? 'bg-success' : 'bg-warning'">
                      {{ item.credited }}
                    </span>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredInvoices.length === 0">
                  <td colspan="8" class="text-center py-4 text-muted">No input tax records found.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold bg-light">
                  <td colspan="4" class="text-start">Total</td>
                  <td class="text-end">{{ formatNumber(totalDpp) }}</td>
                  <td class="text-end text-success fs-15">{{ formatNumber(totalVat) }}</td>
                  <td colspan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal && editingItem" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Input Tax</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateInvoice">
              <div class="modal-body custom-modal-body">
                <div class="row g-2 mb-3">
                  <div class="col-4 text-muted">No. Purchase</div>
                  <div class="col-8 fw-bold">{{ editingItem.purchaseNo }}</div>
                  <div class="col-4 text-muted">Supplier Faktur No.</div>
                  <div class="col-8 fw-bold">{{ editingItem.fakturNo }}</div>
                  <div class="col-4 text-muted">Supplier Name</div>
                  <div class="col-8 fw-bold">{{ editingItem.supplierName }}</div>
                  <div class="col-4 text-muted">DPP</div>
                  <div class="col-8 fw-bold">Rp {{ formatNumber(editingItem.dpp) }}</div>
                  <div class="col-4 text-muted">VAT Input</div>
                  <div class="col-8 fw-bold text-success">Rp {{ formatNumber(editingItem.vat) }}</div>
                </div>

                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Date e-tax Invoice</label>
                    <input v-model="editForm.invoiceDate" type="text" class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Credited</label>
                    <select v-model="editForm.credited" class="form-select">
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Input Tax - Kacetak System'
})

interface InputTaxItem {
  id: number
  purchaseNo: string
  invoiceDate: string
  fakturNo: string
  supplierName: string
  dpp: number
  vat: number
  credited: 'Yes' | 'No'
}

const invoices = ref<InputTaxItem[]>([
  { id: 1, purchaseNo: 'PO-001', invoiceDate: '02-02-2026', fakturNo: 'INV-KN-2026-01', supplierName: 'PT. Kertas Nusantara', dpp: 35000000, vat: 3850000, credited: 'Yes' },
  { id: 2, purchaseNo: 'PO-002', invoiceDate: '03-02-2026', fakturNo: 'FKT-TP-2026-05', supplierName: 'CV. Tinta Pelangi', dpp: 12000000, vat: 1320000, credited: 'Yes' },
  { id: 3, purchaseNo: 'PO-003', invoiceDate: '04-02-2026', fakturNo: 'GS-SERV-882', supplierName: 'Global Sparepart', dpp: 4500000, vat: 495000, credited: 'Yes' },
  { id: 4, purchaseNo: 'PO-004', invoiceDate: '05-02-2026', fakturNo: 'MM-LAM-102', supplierName: 'Master Laminating', dpp: 2800000, vat: 308000, credited: 'Yes' },
  { id: 5, purchaseNo: 'PO-005', invoiceDate: '06-02-2026', fakturNo: 'SURYA-OFF-03', supplierName: 'Surya Offset Supplier', dpp: 15000000, vat: 1650000, credited: 'Yes' }
])

const searchQuery = ref('')
const filterCredited = ref('')

const filteredInvoices = computed(() => {
  return invoices.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      item.purchaseNo.toLowerCase().includes(q) ||
      item.fakturNo.toLowerCase().includes(q) ||
      item.supplierName.toLowerCase().includes(q)
    const matchCredited = !filterCredited.value || item.credited === filterCredited.value
    return matchSearch && matchCredited
  })
})

const totalDpp = computed(() => filteredInvoices.value.reduce((acc, c) => acc + c.dpp, 0))
const totalVat = computed(() => filteredInvoices.value.reduce((acc, c) => acc + c.vat, 0))

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

const showEditModal = ref(false)
const editingItem = ref<InputTaxItem | null>(null)
const editForm = ref({
  invoiceDate: '',
  credited: 'Yes' as 'Yes' | 'No'
})

const openEditModal = (item: InputTaxItem) => {
  editingItem.value = item
  editForm.value = {
    invoiceDate: item.invoiceDate,
    credited: item.credited
  }
  showEditModal.value = true
}

const closeModal = () => {
  showEditModal.value = false
  editingItem.value = null
}

const updateInvoice = () => {
  if (!editingItem.value) return
  const idx = invoices.value.findIndex(i => i.id === editingItem.value!.id)
  if (idx !== -1) {
    invoices.value[idx].invoiceDate = editForm.value.invoiceDate
    invoices.value[idx].credited = editForm.value.credited
  }
  closeModal()
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  searchQuery.value = ''
  filterCredited.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}
</script>

