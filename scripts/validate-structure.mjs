import { createHash } from 'node:crypto'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const checkHashes = process.argv.includes('--check-hashes')
const manifest = JSON.parse(await readFile(path.join(root, 'MIGRATION_MANIFEST.json'), 'utf8'))
const failures = []

function workspacePath(relative) {
  const resolved = path.resolve(root, relative)
  const withinRoot = path.relative(root, resolved)
  if (withinRoot.startsWith('..') || path.isAbsolute(withinRoot)) {
    throw new Error(`Path outside project: ${relative}`)
  }
  return resolved
}

async function verifyFile(entry) {
  try {
    const filename = workspacePath(entry.to)
    const info = await stat(filename)
    if (!info.isFile()) throw new Error('Not a file')
    if (checkHashes) {
      const hash = createHash('sha256').update(await readFile(filename)).digest('hex')
      if (hash !== entry.sha256After) failures.push(`Content changed: ${entry.to}`)
    }
  } catch (error) {
    failures.push(`${entry.to}: ${error.message}`)
  }
}

// Limit file I/O concurrency for large asset archives on Windows.
const entries = [...manifest.files, ...manifest.copies]
let next = 0
await Promise.all(Array.from({ length: 8 }, async () => {
  while (next < entries.length) await verifyFile(entries[next++])
}))

const pages = (await readdir(path.join(root, 'app/pages'))).filter(name => name.endsWith('.vue'))
for (const page of pages) {
  const reference = `legacy/static-source/${page.slice(0, -4)}.html`
  try {
    if (!(await stat(workspacePath(reference))).isFile()) throw new Error('Not a file')
  } catch {
    failures.push(`Missing HTML reference for ${page}: ${reference}`)
  }
}

for (const directory of ['app', 'docs', 'legacy/static-source', 'public', 'scripts', 'server/api', 'server/data', 'server/types', 'server/utils', 'data']) {
  try {
    if (!(await stat(workspacePath(directory))).isDirectory()) throw new Error('Not a directory')
  } catch {
    failures.push(`Missing directory: ${directory}`)
  }
}

console.log(JSON.stringify({
  originalFiles: manifest.files.length,
  preservedCopies: manifest.copies.length,
  pages: pages.length,
  hashesChecked: checkHashes,
  failures,
}, null, 2))
if (failures.length) process.exitCode = 1
