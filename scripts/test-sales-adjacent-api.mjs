import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-sales-adjacent-api-'))
const probe = createServer()
await new Promise((done) => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise((done) => probe.close(done))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
child.stdout.on('data', (chunk) => { output += chunk })
child.stderr.on('data', (chunk) => { output += chunk })
const base = `http://127.0.0.1:${port}`

async function request(path, expectedStatus = 200) {
  const response = await fetch(base + path)
  assert.equal(response.status, expectedStatus, `GET ${path}: ${await response.clone().text()}`)
  const json = await response.json()
  if (expectedStatus === 200) assert.equal(json.success, true)
  return json.data
}

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(output)
    try { ready = (await fetch(base + '/api/sales-dashboard')).ok } catch {}
    if (ready) break
    await delay(100)
  }
  assert.ok(ready, `Nitro did not start: ${output}`)

  const dashboard = await request('/api/sales-dashboard')
  assert.equal(dashboard.bestSellers.length, 5)
  assert.equal(dashboard.recentTransactions.length, 5)
  assert.equal(dashboard.countryMarkers.length, 8)
  assert.equal(dashboard.bestSellers[0].name, 'Lenovo 3rd Generation')

  const reports = await request('/api/reports/sales')
  assert.equal(reports.length, 10)
  assert.equal(reports[0].category, 'Cetak Dokumen')
  const outdoor = await request('/api/reports/sales?search=Print%20Outdoor')
  assert.equal(outdoor.length, 1)
  assert.equal(outdoor[0].details.length, 10)
  assert.equal((await request('/api/reports/sales?startDate=2025-01-24&endDate=2025-01-26')).length, 3)

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'sales-reports.json'), '[]', 'utf8')
  assert.deepEqual(await request('/api/reports/sales'), [])
  await writeFile(join(cwd, 'data', 'sales-reports.json'), '{', 'utf8')
  await request('/api/reports/sales', 500)

  console.log('Sales-adjacent API checks passed: dashboard aggregation, report fixtures/search/date filtering, empty data, invalid JSON')
} finally {
  child.kill()
}
