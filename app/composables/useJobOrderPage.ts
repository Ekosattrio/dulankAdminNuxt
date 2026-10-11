import type { JobOrder, JobOrderFormData } from '#server/types/job-order'
import { salesErrorMessage } from '~/utils/salesDocuments'

export function useJobOrderPage() {
  const searchQuery = ref('')
  const filterCategory = ref('')
  const activeWorkflowType = ref('design')
  const activeWorkflowLabel = ref('Design')
  const activeOrderForEdit = ref<JobOrder | null>(null)
  const activeOrderForView = ref<JobOrder | null>(null)
  const deletingRecord = ref<JobOrder | null>(null)
  const isEditModalOpen = ref(false)
  const isViewModalOpen = ref(false)
  const busy = ref(false)
  const actionError = ref('')

  const filters = computed(() => ({
    search: searchQuery.value,
    workflowCategory: filterCategory.value,
    workflowType: activeWorkflowType.value,
  }))
  const domain = useJobOrders(filters)
  const printing = useTablePrint()

  function selectWorkflow(type: string, label: string) {
    activeWorkflowType.value = type
    activeWorkflowLabel.value = label
  }
  function openEdit(order: JobOrder) { activeOrderForEdit.value = order; isEditModalOpen.value = true }
  function closeEdit() { activeOrderForEdit.value = null; isEditModalOpen.value = false }
  function openView(order: JobOrder) { activeOrderForView.value = order; isViewModalOpen.value = true }
  function closeView() { activeOrderForView.value = null; isViewModalOpen.value = false }

  async function save(form: JobOrderFormData) {
    busy.value = true
    actionError.value = ''
    try { await domain.saveJobOrder(form); closeEdit() }
    catch (error) { actionError.value = salesErrorMessage(error) }
    finally { busy.value = false }
  }

  async function confirmDelete() {
    if (!deletingRecord.value) return
    busy.value = true
    actionError.value = ''
    try { await domain.deleteJobOrder(deletingRecord.value.id); deletingRecord.value = null }
    catch (error) { actionError.value = salesErrorMessage(error) }
    finally { busy.value = false }
  }

  const jobOrderPrintColumns = [
    { key: 'no', label: 'No' }, { key: 'dueDate', label: 'Due Date' },
    { key: 'customer', label: 'Customer' }, { key: 'product', label: 'Product' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'priority', label: 'Priority', align: 'center' as const },
    { key: 'status', label: 'Status', align: 'center' as const },
  ]

  return {
    searchQuery, filterCategory, activeWorkflowType, activeWorkflowLabel,
    activeOrderForEdit, activeOrderForView, deletingRecord,
    isEditModalOpen, isViewModalOpen, busy, actionError, jobOrderPrintColumns,
    ...domain, ...printing, selectWorkflow, openEdit, closeEdit, openView, closeView, save, confirmDelete,
  }
}
