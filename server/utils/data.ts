import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { bundledSources } from './bundledData'

const runtimeDataDir = resolve(process.cwd(), 'data')
const sourceDataDir = resolve(process.cwd(), 'server', 'data')

export function readJSON<T>(filename: string, defaultValue?: T): T {
  const runtimeFilePath = join(runtimeDataDir, filename)
  const sourceFilePath = join(sourceDataDir, filename)
  const filePath = existsSync(runtimeFilePath) ? runtimeFilePath : (existsSync(sourceFilePath) ? sourceFilePath : null)

  if (filePath) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      return JSON.parse(raw) as T
    } catch (err) {
      console.error(`Error reading JSON ${filename} from disk:`, err)
    }
  }

  // Fallback to bundled sources (e.g. for Netlify Functions serverless environment)
  if (filename in bundledSources) {
    return structuredClone(bundledSources[filename]) as T
  }

  if (defaultValue !== undefined) return defaultValue
  return [] as unknown as T
}

export function writeJSON<T>(filename: string, data: T): void {
  const filePath = join(runtimeDataDir, filename)
  try {
    mkdirSync(runtimeDataDir, { recursive: true })
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error(`Error writing JSON ${filename}:`, err)
    // In read-only serverless environments (like Netlify Functions), writing to disk will fail silently
    // without crashing the app.
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
