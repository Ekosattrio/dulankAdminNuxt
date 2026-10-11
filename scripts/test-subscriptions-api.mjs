import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-subscriptions-api-'))
const probe = createServer()
await new Promise(done => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise(done => probe.close(done))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
child.stdout.on('data', value => output += value)
child.stderr.on('data', value => output += value)
const base = `http://127.0.0.1:${port}`

async function request(path, options = {}, status = 200) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: options.body ? { 'content-type': 'application/json', ...options.headers } : options.headers,
  })
  const text = await response.text()
  assert.equal(response.status, status, text)
  return JSON.parse(text)
}

try {
  let ready = false
  for (let index = 0; index < 100; index++) {
    try { ready = (await fetch(`${base}/api/subscriptions`)).ok } catch {}
    if (ready) break
    if (child.exitCode !== null) throw new Error(output)
    await delay(100)
  }
  assert.ok(ready, output)

  const initial = await request('/api/subscriptions')
  assert.equal(initial.success, true)
  assert.equal(initial.data.length, 9)
  assert.deepEqual(initial.summary, { totalTransactions: 307000, totalSubscribers: 4385, activeSubscribers: 3000, expiredSubscribers: 1385 })
  assert.ok(initial.data.every(item => typeof item.amount === 'number' && item.subscriberId))

  assert.equal((await request('/api/subscriptions?plan=Basic')).data.length, 3)
  assert.equal((await request('/api/subscriptions?paymentMethod=Debit%20Card')).data[0].subscriber, 'Quantum Nexus')
  assert.deepEqual((await request('/api/subscriptions?status=Unpaid')).data.map(item => item.subscriber), ['UrbanPulse Design'])
  assert.equal((await request('/api/subscriptions?startDate=2024-10-01&endDate=2024-10-31')).data.length, 2)
  assert.equal((await request('/api/subscriptions?search=terra')).data[0].plan, 'Enterprise (Yearly)')

  const updated = await request('/api/subscriptions/subscription-008', {
    method: 'PUT',
    body: JSON.stringify({ planTier: 'Advanced', billingCycle: '365 Days', amount: 125000, status: 'Paid' }),
  })
  assert.equal(updated.data.plan, 'Advanced (Yearly)')
  assert.equal(updated.data.amount, 125000)
  assert.equal((await request('/api/subscriptions/subscription-008')).data.status, 'Paid')
  await request('/api/subscriptions/subscription-008', { method: 'PUT', body: JSON.stringify({ amount: -1 }) }, 400)
  await request('/api/subscriptions/missing', { method: 'PUT', body: JSON.stringify({ status: 'Paid' }) }, 404)

  await request('/api/subscriptions/subscription-009', { method: 'DELETE' })
  assert.equal((await request('/api/subscriptions')).data.length, 8)
  await request('/api/subscriptions/subscription-009', { method: 'DELETE' }, 404)

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'subscriptions.json'), '{', 'utf8')
  await request('/api/subscriptions', {}, 500)
  console.log('Subscriptions API checks passed: snapshot, filters, persistence, validation, delete, and malformed-data safeguards')
} finally {
  child.kill()
}
