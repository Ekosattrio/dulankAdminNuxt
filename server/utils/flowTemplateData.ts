import type { FlowTemplate } from '#server/types/flow-template'
import { readJSON, writeJSON } from './data'

const FLOW_TEMPLATES_FILE = 'flow-templates.json'

export function readFlowTemplateData(): FlowTemplate[] {
  return readJSON<FlowTemplate[]>(FLOW_TEMPLATES_FILE, [])
}

export function writeFlowTemplateData(data: FlowTemplate[]): void {
  writeJSON(FLOW_TEMPLATES_FILE, data)
}

