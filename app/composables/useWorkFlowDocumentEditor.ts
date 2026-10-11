import type { FlowCategoryFormData } from '#server/types/flow-category'
import type { FlowNameFormData } from '#server/types/flow-name'
import type { WorkFlow, WorkFlowEditorContext, WorkFlowEditorFlow, WorkFlowEditorProduct, WorkFlowFormData, WorkFlowStepItem } from '#server/types/work-flow'

interface ApiResponse<T> { success: boolean; data: T; message?: string }

export function useWorkFlowDocumentEditor(initialData: Ref<WorkFlow | null | undefined>) {
  const { data, pending, error, refresh } = useApiFetch<ApiResponse<WorkFlowEditorContext>>('/api/work-flow-context', { key: 'work-flow-editor-context' })
  const form = ref<WorkFlowFormData>({ product: '', productId: '', category: '', workflowSteps: '', steps: [] })
  const arrangedFlows = ref<WorkFlowStepItem[]>([])

  const context = computed<WorkFlowEditorContext>(() => data.value?.data || ({ products: [], productCategories: [], flowCategories: [], flows: [], templates: [] }))

  watch([initialData, context], ([record, currentContext]) => {
    if (record) {
      const steps = record.steps?.length ? record.steps : record.workflowSteps.split(',').map((name, index) => {
        const trimmed = name.trim()
        const definition = currentContext.flows.find((item) => item.name.toLowerCase() === trimmed.toLowerCase())
        return { id: definition?.id || `step-${index + 1}`, name: trimmed, category: definition?.category || 'Cetak', template: '', selected: true }
      }).filter((item) => item.name)
      form.value = { id: record.id, no: record.no, date: record.date, product: record.product, productId: record.productId, category: record.category, workflowSteps: record.workflowSteps, steps }
      arrangedFlows.value = steps.map((step) => ({ ...step }))
      return
    }
    if (!form.value.category && currentContext.productCategories.length) form.value.category = currentContext.productCategories[0] || ''
  }, { immediate: true })

  function selectProduct(product: WorkFlowEditorProduct) {
    form.value.product = product.name
    form.value.productId = product.id
    form.value.category = product.category
  }

  function isSelected(flow: WorkFlowEditorFlow) {
    return arrangedFlows.value.some((item) => item.name.toLowerCase() === flow.name.toLowerCase())
  }

  function toggleFlow(flow: WorkFlowEditorFlow) {
    const index = arrangedFlows.value.findIndex((item) => item.name.toLowerCase() === flow.name.toLowerCase())
    if (index >= 0) arrangedFlows.value.splice(index, 1)
    else arrangedFlows.value.push({ id: flow.id, name: flow.name, category: flow.category, template: '', selected: true })
  }

  function updateTemplate(flow: WorkFlowEditorFlow, template: string) {
    const step = arrangedFlows.value.find((item) => item.name.toLowerCase() === flow.name.toLowerCase())
    if (step) step.template = template
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= arrangedFlows.value.length) return
    const current = arrangedFlows.value[index]
    const other = arrangedFlows.value[target]
    if (!current || !other) return
    arrangedFlows.value[index] = other
    arrangedFlows.value[target] = current
  }

  async function createFlowCategory(payload: FlowCategoryFormData) {
    await apiFetch('/api/flow-categories', { method: 'POST', body: payload })
    await refresh()
  }

  async function createFlowName(payload: FlowNameFormData) {
    await apiFetch('/api/flow-names', { method: 'POST', body: payload })
    await refresh()
  }

  function payload(): WorkFlowFormData {
    const steps = arrangedFlows.value.map((step) => ({ ...step, selected: true }))
    return { ...form.value, workflowSteps: steps.map((step) => step.name).join(', '), steps }
  }

  return { context, pending, error, refresh, form, arrangedFlows, selectProduct, isSelected, toggleFlow, updateTemplate, move, createFlowCategory, createFlowName, payload }
}
