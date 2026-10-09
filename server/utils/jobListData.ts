import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { JobListItem } from '#server/types/job-list'

const runtimePath = join(process.cwd(), 'data', 'job-list.json')
const seedPath = join(process.cwd(), 'server', 'data', 'job-list.json')

export function readJobListData(): JobListItem[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as JobListItem[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime job-list data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as JobListItem[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed job-list data:', error)
  }

  return []
}

export function writeJobListData(data: JobListItem[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write job-list data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist job-list data',
    })
  }
}
