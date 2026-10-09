import type { JobListItem } from '#server/types/job-list'
import { readJSON, writeJSON } from './data'

const JOB_LIST_FILE = 'job-list.json'

export function readJobListData(): JobListItem[] {
  return readJSON<JobListItem[]>(JOB_LIST_FILE, [])
}

export function writeJobListData(data: JobListItem[]): void {
  writeJSON(JOB_LIST_FILE, data)
}

