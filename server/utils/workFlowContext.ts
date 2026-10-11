import type { Product } from '#server/types/product'
import type { WorkFlowEditorContext, WorkFlowEditorFlow } from '#server/types/work-flow'
import { readJSON } from './data'
import { readFlowCategoryData } from './flowCategoryData'
import { readFlowNameData } from './flowNameData'
import { readFlowTemplateData } from './flowTemplateData'
import { readWorkFlowData } from './workFlowData'

export function getWorkFlowEditorContext(): WorkFlowEditorContext {
  const products = readJSON<Product[]>('products.json', [])
  const workFlows = readWorkFlowData()
  const categories = readFlowCategoryData()
  const names = readFlowNameData()
  const templates = readFlowTemplateData().map((item) => item.name)
  const catalog = readJSON<WorkFlowEditorFlow[]>('work-flow-editor-catalog.json', [])

  const productMap = new Map(products.map((item) => [item.name.toLowerCase(), {
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
  }]))
  for (const item of workFlows) {
    if (!productMap.has(item.product.toLowerCase())) {
      productMap.set(item.product.toLowerCase(), { id: item.productId || `workflow-${item.id}`, code: item.no, name: item.product, category: item.category })
    }
  }

  const flowMap = new Map(catalog.map((item) => [item.name.toLowerCase(), item]))
  for (const item of names) {
    if (!flowMap.has(item.name.toLowerCase())) {
      flowMap.set(item.name.toLowerCase(), { id: item.id, name: item.name, category: item.category, templateNames: templates })
    }
  }

  return {
    products: [...productMap.values()],
    productCategories: [...new Set([...products.map((item) => item.category), ...workFlows.map((item) => item.category)])],
    flowCategories: [...new Set([...categories.map((item) => item.name), ...catalog.map((item) => item.category), ...names.map((item) => item.category)])],
    flows: [...flowMap.values()],
    templates,
  }
}
