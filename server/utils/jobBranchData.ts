import type { JobBranchItem } from '#server/types/job-branch'
import { readJSON, writeJSON } from './data'

const JOB_BRANCHES_FILE = 'job-branches.json'

export function readJobBranchData(): JobBranchItem[] {
  return readJSON<JobBranchItem[]>(JOB_BRANCHES_FILE, [])
}

export function writeJobBranchData(data: JobBranchItem[]): void {
  writeJSON(JOB_BRANCHES_FILE, data)
}

