import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-billing-api-'))
const probe = createServer()
await new Promise(done => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise(done => probe.close(done))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })
let output = ''
child.stdout.on('data', value => output += value)
child.stderr.on('data', value => output += value)
const base = `http://127.0.0.1:${port}`
async function request(path, status = 200) {
  const response = await fetch(`${base}${path}`)
  const body = await response.text()
  assert.equal(response.status, status, body)
  return JSON.parse(body)
}
try {
  let ready = false
  for (let index = 0; index < 100; index++) {
    try { ready = (await fetch(`${base}/api/billings`)).ok } catch {}
    if (ready) break
    if (child.exitCode !== null) throw new Error(output)
    await delay(100)
  }
  assert.ok(ready, output)
  const initial = await request('/api/billings')
  assert.equal(initial.success, true)
  assert.deepEqual(initial.summary, { totalTransaction: 307144, totalSuccess: 4385, totalFailed: 385656 })
  assert.equal(initial.data.length, 10)
  assert.deepEqual(initial.data.map(item => item.billingId), ['B-001', 'B-002', 'B-003', 'B-004', 'B-005', 'B-006', 'B-007', 'B-008', 'B-009', 'B-010'])
  assert.ok(initial.data.every(item => item.transactionId && item.userId && item.createdAt && typeof item.total === 'number'))
  assert.deepEqual((await request('/api/billings?search=sophia')).data.map(item => item.billingId), ['B-010'])
  assert.deepEqual((await request('/api/billings?paymentMethod=Virtual%20Account')).data.map(item => item.billingId), ['B-005', 'B-009'])
  assert.deepEqual((await request('/api/billings?status=Gagal')).data.map(item => item.billingId), ['B-004', 'B-008'])
  assert.deepEqual((await request('/api/billings?startDate=2025-08-24&endDate=2025-08-25')).data.map(item => item.billingId), ['B-005', 'B-006', 'B-007'])
  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'billing.json'), JSON.stringify({ summary: initial.summary, records: [] }), 'utf8')
  assert.deepEqual((await request('/api/billings')).data, [])
  await writeFile(join(cwd, 'data', 'billing.json'), '{', 'utf8')
  await request('/api/billings', 500)
  console.log('Billing API checks passed: exact legacy snapshot, relational numeric data, search/method/status/date filters, valid empty state, and malformed-data safeguard')
} finally {
  child.kill()
}
