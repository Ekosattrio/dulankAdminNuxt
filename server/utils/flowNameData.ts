import type { FlowName } from '#server/types/flow-name'
import { readJSON, writeJSON } from './data'

const FLOW_NAMES_FILE = 'flow-names.json'

export function readFlowNameData(): FlowName[] {
  return readJSON<FlowName[]>(FLOW_NAMES_FILE, [])
}

export function writeFlowNameData(data: FlowName[]): void {
  writeJSON(FLOW_NAMES_FILE, data)
}

