import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FlowTemplate } from '#server/types/flow-template'

const runtimePath = join(process.cwd(), 'data', 'flow-templates.json')
const seedPath = join(process.cwd(), 'server', 'data', 'flow-templates.json')

export function readFlowTemplateData(): FlowTemplate[] {
  try {
    if (existsSync(runtimePath)) {
      const content = readFileSync(runtimePath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as FlowTemplate[]
      }
    }
  } catch (error) {
    console.error('Failed to read runtime flow template data:', error)
  }

  try {
    if (existsSync(seedPath)) {
      const content = readFileSync(seedPath, 'utf-8').trim()
      if (content) {
        return JSON.parse(content) as FlowTemplate[]
      }
    }
  } catch (error) {
    console.error('Failed to read seed flow template data:', error)
  }

  return []
}

export function writeFlowTemplateData(data: FlowTemplate[]): void {
  try {
    writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write flow template data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to persist flow template data',
    })
  }
}
