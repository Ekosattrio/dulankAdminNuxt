import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FlowCategory } from '#server/types/flow-category'

const runtimePath = join(process.cwd(), 'data', 'flow-categories.json')
const seedPath = join(process.cwd(), 'server', 'data', 'flow-categories.json')

export function readFlowCategoryData(): FlowCategory[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as FlowCategory[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime flow category data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as FlowCategory[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed flow category data:', error)
  }

  return []
}

export function writeFlowCategoryData(data: FlowCategory[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write flow category data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist flow category data',
    })
  }
}
