import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dataDir = resolve(process.cwd(), 'data')

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

export function readJSON<T>(filename: string, defaultValue?: T): T {
  const filePath = join(dataDir, filename)
  if (!existsSync(filePath)) {
    if (defaultValue !== undefined) return defaultValue
    return [] as unknown as T
  }
  try {
    const raw = readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch (err) {
    console.error(`Error reading JSON ${filename}:`, err)
    if (defaultValue !== undefined) return defaultValue
    return [] as unknown as T
  }
}

export function writeJSON<T>(filename: string, data: T): void {
  const filePath = join(dataDir, filename)
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error(`Error writing JSON ${filename}:`, err)
    throw err
  }
}

export const readData = <T>(filename: string, defaultValue?: T[]): T[] => {
  return readJSON<T[]>(filename, defaultValue || [])
}

export const writeData = <T>(filename: string, data: T): void => {
  writeJSON<T>(filename, data)
}

export function createResponse<T>(data: T, messageOrMeta?: string | Record<string, unknown>) {
  if (typeof messageOrMeta === 'string') {
    return { success: true, data, message: messageOrMeta }
  }
  return { success: true, data, ...(messageOrMeta ? { meta: messageOrMeta } : {}) }
}

