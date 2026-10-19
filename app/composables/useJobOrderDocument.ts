import type { JobOrder, JobOrderContext, JobOrderFormData, JobOrderInfoItem, JobOrderStep } from '#server/types/job-order'
import { salesErrorMessage } from '~/utils/salesDocuments'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const jobOrderFlowOptions = [
  'Design', 'SPK PLAT CTP', 'SPK Heidelberg SM52 4 Warna', 'Potong Sisir',
  'Design Layout', 'Pre-press Setting', 'Digital Printing', 'Paper Cutting',
  'Custom Design', 'Plate Making', 'Offset Printing', 'Laminating', 'File Proofing',
  'Digital Proofing', 'Large Format Printing', 'Binding', 'Redesign', 'Color Separation',
  'UV Printing', 'Packing', 'Final Artwork', 'Film Checking', 'Screen Printing', 'Folding',
]

function emptyForm(): JobOrderFormData {
  return {
    dueDate: '', customer: '', product: '', jobTitle: '', qty: '', priority: 'Normal',
    status: 'Waiting', workflowType: 'design', workflowCategory: 'Design', steps: [],
  }
}

function cloneSteps(steps: JobOrderStep[] = []): JobOrderStep[] {
  return steps.map((step, index) => ({
    ...step,
    id: step.id || `flow-${index + 1}`,
    flowType: step.flowType || 'In-House',
    assignees: step.assignees || '',
    incentive: Number(step.incentive ?? 0),
    incentiveUnit: step.incentiveUnit || 'Job',
    infoList: (step.infoList ?? []).map((item) => ({ ...item })),
    afterInfoList: (step.afterInfoList ?? []).map((item) => ({ ...item })),
  }))
}

export function useJobOrderDocument() {
  const route = useRoute()
  const router = useRouter()
  const query = computed(() => ({
    id: String(route.query.id ?? '').trim(),
    orderId: String(route.query.orderId ?? '').trim(),
  }))
  const { data, pending, error, refresh } = useApiFetch<ApiResponse<JobOrderContext>>('/api/v1/admin/job-order-context', {
    key: `job-order-context-${query.value.id}-${query.value.orderId}`,
    query,
  })
  const context = computed(() => data.value?.data ?? null)
  const jobOrder = computed(() => context.value?.jobOrder ?? null)
  const sourceOrder = computed(() => context.value?.order ?? null)
  const form = ref<JobOrderFormData>(emptyForm())
  const activeStepIndex = ref(0)
  const initializedKey = ref('')
  const busy = ref(false)
  const feedback = ref('')
  const feedbackType = ref<'success' | 'error'>('success')

  watch(context, (value) => {
    if (!value) return
    const key = `${value.jobOrder?.id ?? 'new'}:${value.order?.id ?? ''}`
    if (initializedKey.value === key) return
    initializedKey.value = key
    const record = value.jobOrder
    const firstItem = value.order?.items?.[0]
    form.value = record ? {
      id: record.id,
      no: record.no,
      orderId: record.orderId,
      customerId: record.customerId,
      productId: record.productId,
      branchId: record.branchId,
      dueDate: record.dueDate,
      customer: record.customer,
      product: record.product,
      jobTitle: record.jobTitle,
      description: record.description,
      qty: record.qty,
      priority: record.priority,
      status: record.status,
      workflowType: record.workflowType,
      workflowCategory: record.workflowCategory,
      salesNo: record.salesNo,
      shipping: record.shipping,
      orderSummary: record.orderSummary,
      assignedTo: record.assignedTo,
      inputSpecs: record.inputSpecs,
      outputSpecs: record.outputSpecs,
      steps: cloneSteps(record.steps),
    } : {
      ...emptyForm(),
      orderId: value.order?.no,
      customerId: value.order?.customerId,
      branchId: value.order?.branchId,
      productId: firstItem?.productId,
      customer: value.order?.customer ?? '',
      product: firstItem?.productName ?? '',
      qty: firstItem?.qty,
      salesNo: value.order?.no,
      shipping: value.order?.shipping ?? '',
      orderSummary: value.order ? `${value.order.items?.length ?? 0} Products` : '',
    }
    activeStepIndex.value = 0
  }, { immediate: true })

  const activeStep = computed(() => form.value.steps?.[activeStepIndex.value] ?? null)

  function addStep() {
    const steps = form.value.steps ?? (form.value.steps = [])
    steps.push({
      id: crypto.randomUUID(), name: '', status: steps.length ? 'pending' : 'active',
      flowType: 'In-House', assignees: '', incentive: 0, incentiveUnit: 'Job',
      infoList: [], afterInfoList: [],
    })
    activeStepIndex.value = steps.length - 1
  }

  function removeStep(index: number) {
    form.value.steps?.splice(index, 1)
    activeStepIndex.value = Math.max(0, Math.min(activeStepIndex.value, (form.value.steps?.length ?? 1) - 1))
  }

  function moveStep(index: number, delta: number) {
    const steps = form.value.steps ?? []
    const target = index + delta
    if (!steps[index] || !steps[target]) return
    ;[steps[index], steps[target]] = [steps[target], steps[index]]
    activeStepIndex.value = target
  }

  function addInfo(target: 'infoList' | 'afterInfoList', label: string) {
    if (!activeStep.value || !label.trim()) return
    const list = activeStep.value[target] ?? (activeStep.value[target] = [])
    const item: JobOrderInfoItem = { id: crypto.randomUUID(), label: label.trim(), value: '', inputType: 'Input Type' }
    list.push(item)
  }

  async function save() {
    busy.value = true
    feedback.value = ''
    try {
      if (!(form.value.steps?.length)) throw new Error('Add at least one workflow step.')
      const response = await apiFetch<ApiResponse<JobOrder>>('/api/v1/admin/job-orders', { method: 'POST', body: form.value })
      feedbackType.value = 'success'
      feedback.value = response.message || 'Job order saved.'
      await router.push({ path: '/job-order-detail', query: { id: response.data.id } })
    } catch (err) {
      feedbackType.value = 'error'
      feedback.value = salesErrorMessage(err)
    } finally {
      busy.value = false
    }
  }

  return {
    context, jobOrder, sourceOrder, form, activeStepIndex, activeStep, pending, error,
    busy, feedback, feedbackType, refresh, addStep, removeStep, moveStep, addInfo, save,
  }
}
