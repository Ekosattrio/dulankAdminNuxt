import type { FlowTemplate } from '#server/types/flow-template'
import { readJSON, writeJSON } from './data'

export function readFlowTemplateData(): FlowTemplate[] {
  return readJSON<FlowTemplate[]>('flow-templates.json', [])
}

export function writeFlowTemplateData(data: FlowTemplate[]): void {
  writeJSON('flow-templates.json', data)
}
