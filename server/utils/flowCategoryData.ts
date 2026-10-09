import type { FlowCategory } from '#server/types/flow-category'
import { readJSON, writeJSON } from './data'

const FLOW_CATEGORIES_FILE = 'flow-categories.json'

export function readFlowCategoryData(): FlowCategory[] {
  return readJSON<FlowCategory[]>(FLOW_CATEGORIES_FILE, [])
}

export function writeFlowCategoryData(data: FlowCategory[]): void {
  writeJSON(FLOW_CATEGORIES_FILE, data)
}

