import type { WorkFlow } from '#server/types/work-flow'
import { readJSON, writeJSON } from './data'

const WORK_FLOWS_FILE = 'work-flows.json'

export function readWorkFlowData(): WorkFlow[] {
  return readJSON<WorkFlow[]>(WORK_FLOWS_FILE, [])
}

export function writeWorkFlowData(data: WorkFlow[]): void {
  writeJSON(WORK_FLOWS_FILE, data)
}

