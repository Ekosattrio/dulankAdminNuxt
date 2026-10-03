import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FlowName } from '#server/types/flow-name'

const runtimePath = join(process.cwd(), 'data', 'flow-names.json')
const seedPath = join(process.cwd(), 'server', 'data', 'flow-names.json')

export function readFlowNameData(): FlowName[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as FlowName[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime flow name data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as FlowName[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed flow name data:', error)
  }

  return []
}

export function writeFlowNameData(data: FlowName[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write flow name data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist flow name data',
    })
  }
}
