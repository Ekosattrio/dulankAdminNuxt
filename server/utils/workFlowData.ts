import type { WorkFlow } from '#server/types/work-flow'
import { readJSON, writeJSON } from './data'

export function readWorkFlowData(): WorkFlow[] {
  return readJSON<WorkFlow[]>('work-flows.json', [])
}

export function writeWorkFlowData(data: WorkFlow[]): void {
  writeJSON('work-flows.json', data)
}
