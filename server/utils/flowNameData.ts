import type { FlowName } from '#server/types/flow-name'
import { readJSON, writeJSON } from './data'

export function readFlowNameData(): FlowName[] {
  return readJSON<FlowName[]>('flow-names.json', [])
}

export function writeFlowNameData(data: FlowName[]): void {
  writeJSON('flow-names.json', data)
}
