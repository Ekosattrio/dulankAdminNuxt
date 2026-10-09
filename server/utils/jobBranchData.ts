import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { JobBranchItem } from '#server/types/job-branch'

const runtimePath = join(process.cwd(), 'data', 'job-branches.json')
const seedPath = join(process.cwd(), 'server', 'data', 'job-branches.json')

export function readJobBranchData(): JobBranchItem[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as JobBranchItem[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime job-branch data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as JobBranchItem[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed job-branch data:', error)
  }

  return []
}

export function writeJobBranchData(data: JobBranchItem[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write job-branch data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist job-branch data',
    })
  }
}
