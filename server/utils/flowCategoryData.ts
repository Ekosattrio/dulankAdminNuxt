import type { FlowCategory } from '#server/types/flow-category'
import { readJSON, writeJSON } from './data'

export function readFlowCategoryData(): FlowCategory[] {
  return readJSON<FlowCategory[]>('flow-categories.json', [])
}

export function writeFlowCategoryData(data: FlowCategory[]): void {
  writeJSON('flow-categories.json', data)
}
