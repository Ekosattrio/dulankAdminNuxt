<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="page-title">
          <h4>Income</h4>
          <h6>Manage your income</h6>
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
        <div class="d-flex flex-wrap gap-2">
          <div class="page-btn flex-fill">
            <button type="button" class="btn btn-added btn-primary w-100" @click="openAddModal">
              <i class="ti ti-circle-plus me-2"></i> Add income
            </button>
          </div>
        </div>
      </div>

      <!-- Income List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <!-- Filter -->
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by name, no income, notes..." />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterCategory" class="form-select form-select-sm" style="min-width: 180px;">
                <option value="">All Categories</option>
                <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Date</th>
                  <th>No Income</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Notes</th>
                  <th class="text-end">Amount (IDR)</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredIncomes" :key="item.id">
                  <td class="inc-date">{{ item.date }}</td>
                  <td class="inc-no fw-semibold text-primary">{{ item.no }}</td>
                  <td class="inc-name fw-medium">{{ item.name }}</td>
                  <td class="inc-category">
                    <span class="badge bg-light text-dark border">{{ item.category }}</span>
                  </td>
                  <td class="inc-notes text-muted text-truncate" style="max-width: 250px;">{{ item.notes }}</td>
                  <td class="inc-amount text-end fw-semibold">{{ formatNumber(item.amount) }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2 text-info" href="javascript:void(0);" title="View" @click="openViewModal(item)">
                        <i class="ti ti-eye"></i>
                      </a>
                      <a class="me-2 p-2" href="javascript:void(0);" title="Edit" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a class="confirm-text p-2 align-center text-danger" href="javascript:void(0);" title="Delete" @click="deleteItem(item.id)">
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredIncomes.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No income records found.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="fw-bold bg-light">
                  <td class="text-start">Total</td>
                  <td colspan="4"></td>
                  <td class="text-end text-success fs-15">{{ formatNumber(totalAmount) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Income Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add New Income</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveIncome">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Income Category <span class="text-danger">*</span></label>
                    <select v-model="formData.category" class="form-select" required>
                      <option value="">Choose</option>
                      <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Date <span class="text-danger">*</span></label>
                    <input v-model="formData.date" type="date" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Name / Payer <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" placeholder="Enter name" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Amount (IDR) <span class="text-danger">*</span></label>
                    <input v-model.number="formData.amount" type="number" class="form-control" placeholder="Enter amount" min="0" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Payment Method</label>
                    <select v-model="formData.paymentMethod" class="form-select">
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="Tunai / Cash">Tunai / Cash</option>
                      <option value="QRIS">QRIS</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Bank Account</label>
                    <input v-model="formData.bankAccount" type="text" class="form-control" placeholder="e.g. Mandiri 1320009982282" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Notes / Description</label>
                    <textarea v-model="formData.notes" class="form-control" rows="3" placeholder="Enter note here..."></textarea>
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

      <!-- Edit Income Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Income</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateIncome">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Income Category <span class="text-danger">*</span></label>
                    <select v-model="formData.category" class="form-select" required>
                      <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Date <span class="text-danger">*</span></label>
                    <input v-model="formData.date" type="text" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Name <span class="text-danger">*</span></label>
                    <input v-model="formData.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Amount (IDR) <span class="text-danger">*</span></label>
                    <input v-model.number="formData.amount" type="number" class="form-control" min="0" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea v-model="formData.notes" class="form-control" rows="3"></textarea>
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input id="cancelTxCheck" v-model="formData.isCancelled" class="form-check-input" type="checkbox" />
                      <label class="form-check-label" for="cancelTxCheck">Cancel Transaction</label>
                    </div>
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

      <!-- View Income Modal -->
      <div v-if="showViewModal && viewingItem" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>View Income - {{ viewingItem.no }}</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="row g-2">
                <div class="col-6 fw-bold">Income Category</div>
                <div class="col-6 text-end">{{ viewingItem.category }}</div>
                <div class="col-6 fw-bold">Date</div>
                <div class="col-6 text-end">{{ viewingItem.date }}</div>
                <div class="col-6 fw-bold">Amount</div>
                <div class="col-6 text-end fw-semibold text-success">Rp {{ formatNumber(viewingItem.amount) }}</div>
                <div class="col-6 fw-bold">Payment Method</div>
                <div class="col-6 text-end">{{ viewingItem.paymentMethod || 'Transfer Bank' }}</div>
                <div class="col-6 fw-bold">Bank Account</div>
                <div class="col-6 text-end">{{ viewingItem.bankAccount || 'BCA 8830129841' }}</div>
                <div class="col-12 fw-bold mt-2">Notes</div>
                <div class="col-12 p-2 bg-light rounded text-muted">{{ viewingItem.notes || '-' }}</div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Close</button>
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
  title: 'Income - Kacetak System'
})

interface IncomeRecord {
  id: number
  date: string
  no: string
  name: string
  category: string
  notes: string
  amount: number
  paymentMethod?: string
  bankAccount?: string
  isCancelled?: boolean
}

const categoryList = [
  'Penjualan Jasa Cetak',
  'Biaya Pengiriman',
  'Jasa Desain',
  'Penjualan Limbah Kertas',
  'Penjualan Plat Offset Bekas'
]

const incomes = ref<IncomeRecord[]>([
  { id: 1, date: '01/11/2025', no: 'IN000001', name: 'Budi Santoso', category: 'Penjualan Jasa Cetak', notes: 'Pembayaran lunas cetak brosur 1000 pcs.', amount: 1000000, paymentMethod: 'Transfer Bank', bankAccount: 'Mandiri 1320009982282' },
  { id: 2, date: '03/11/2025', no: 'IN000002', name: 'Siti Nurhaliza', category: 'Biaya Pengiriman', notes: 'Pemasukan biaya kirim pesanan urgent.', amount: 150000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 3, date: '05/11/2025', no: 'IN000003', name: 'Ahmad Wijaya', category: 'Jasa Desain', notes: 'Pembayaran desain kartu nama & logo.', amount: 350000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' },
  { id: 4, date: '07/11/2025', no: 'IN000004', name: 'Rina Puspita', category: 'Penjualan Limbah Kertas', notes: 'Penjualan kertas scrap bulan Oktober.', amount: 600000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 5, date: '09/11/2025', no: 'IN000005', name: 'Hendra Kusuma', category: 'Penjualan Jasa Cetak', notes: 'Pelunasan cetak banner outdoor.', amount: 880000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' },
  { id: 6, date: '30/11/2025', no: 'IN000012', name: 'Lina Wijaya', category: 'Penjualan Plat Offset Bekas', notes: 'Penjualan 20 kg plat bekas.', amount: 180000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 7, date: '03/12/2025', no: 'IN000013', name: 'Syahrul Ramadan', category: 'Biaya Pengiriman', notes: 'Biaya handling pengiriman ekspres.', amount: 220000, paymentMethod: 'Transfer Bank', bankAccount: 'Mandiri 1320009982282' },
  { id: 8, date: '06/12/2025', no: 'IN000014', name: 'Dina Melati', category: 'Penjualan Jasa Cetak', notes: 'Pelunasan cetak kartu nama.', amount: 100000, paymentMethod: 'QRIS', bankAccount: 'BCA QRIS' },
  { id: 9, date: '09/12/2025', no: 'IN000015', name: 'Tono Setiawan', category: 'Jasa Desain', notes: 'Revisi desain klien lama.', amount: 400000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' },
  { id: 10, date: '12/12/2025', no: 'IN000016', name: 'Ani Kusuma', category: 'Penjualan Limbah Kertas', notes: 'Penjualan trimming HVS.', amount: 850000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 11, date: '15/12/2025', no: 'IN000017', name: 'Arif Handoko', category: 'Penjualan Jasa Cetak', notes: 'Pelunasan invoice cetak nota NCR.', amount: 680000, paymentMethod: 'Transfer Bank', bankAccount: 'Mandiri 1320009982282' },
  { id: 12, date: '18/12/2025', no: 'IN000018', name: 'Retno Kumala', category: 'Penjualan Plat Offset Bekas', notes: '-', amount: 250000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 13, date: '21/12/2025', no: 'IN000019', name: 'Bambang Sutejo', category: 'Biaya Pengiriman', notes: 'Pemasukan biaya kirim melalui jasa ojek online.', amount: 110000, paymentMethod: 'Tunai / Cash', bankAccount: '-' },
  { id: 14, date: '24/12/2025', no: 'IN000020', name: 'Diana Sefti', category: 'Jasa Desain', notes: 'Pembayaran desain kalender 2026.', amount: 1150000, paymentMethod: 'Transfer Bank', bankAccount: 'BCA 8830129841' }
])

const searchQuery = ref('')
const filterCategory = ref('')

const filteredIncomes = computed(() => {
  return incomes.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.no.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q)
    const matchCat = !filterCategory.value || item.category === filterCategory.value
    return matchSearch && matchCat
  })
})

const totalAmount = computed(() => {
  return filteredIncomes.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<number | null>(null)
const viewingItem = ref<IncomeRecord | null>(null)

const defaultFormData = () => ({
  date: new Date().toISOString().split('T')[0],
  name: '',
  category: 'Penjualan Jasa Cetak',
  notes: '',
  amount: 0,
  paymentMethod: 'Transfer Bank',
  bankAccount: '',
  isCancelled: false
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: IncomeRecord) => {
  editingId.value = item.id
  formData.value = {
    date: item.date,
    name: item.name,
    category: item.category,
    notes: item.notes,
    amount: item.amount,
    paymentMethod: item.paymentMethod || 'Transfer Bank',
    bankAccount: item.bankAccount || '',
    isCancelled: !!item.isCancelled
  }
  showEditModal.value = true
}

const openViewModal = (item: IncomeRecord) => {
  viewingItem.value = item
  showViewModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  editingId.value = null
  viewingItem.value = null
}

const saveIncome = () => {
  const newId = Math.max(0, ...incomes.value.map(i => i.id)) + 1
  const count = incomes.value.length + 1
  const no = `IN${String(count).padStart(6, '0')}`
  incomes.value.unshift({
    id: newId,
    no,
    date: formData.value.date,
    name: formData.value.name,
    category: formData.value.category,
    notes: formData.value.notes,
    amount: formData.value.amount,
    paymentMethod: formData.value.paymentMethod,
    bankAccount: formData.value.bankAccount
  })
  closeModal()
}

const updateIncome = () => {
  if (editingId.value === null) return
  const idx = incomes.value.findIndex(i => i.id === editingId.value)
  if (idx !== -1) {
    incomes.value[idx] = {
      ...incomes.value[idx],
      date: formData.value.date,
      name: formData.value.name,
      category: formData.value.category,
      notes: formData.value.notes,
      amount: formData.value.amount,
      isCancelled: formData.value.isCancelled
    }
  }
  closeModal()
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this income record?')) {
    incomes.value = incomes.value.filter(i => i.id !== id)
  }
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  searchQuery.value = ''
  filterCategory.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}
</script>

