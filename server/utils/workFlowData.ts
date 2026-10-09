import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { WorkFlow } from '#server/types/work-flow'

const runtimePath = join(process.cwd(), 'data', 'work-flows.json')
const seedPath = join(process.cwd(), 'server', 'data', 'work-flows.json')

export function readWorkFlowData(): WorkFlow[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as WorkFlow[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime workflow data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as WorkFlow[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed workflow data:', error)
  }

  return []
}

export function writeWorkFlowData(data: WorkFlow[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write workflow data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist workflow data',
    })
  }
}
