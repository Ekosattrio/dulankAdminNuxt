import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-webstore-api-'))
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
child.stdout.on('data', chunk => { output += chunk })
child.stderr.on('data', chunk => { output += chunk })
const base = `http://127.0.0.1:${port}`

async function request(path, method = 'GET', body, expectedStatus = 200) {
  const response = await fetch(base + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  assert.equal(response.status, expectedStatus, `${method} ${path}: ${await response.clone().text()}`)
  const json = await response.json()
  if (expectedStatus === 200) assert.equal(json.success, true)
  return json
}

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(output)
    try { ready = (await fetch(base + '/api/webstore/cart')).ok } catch {}
    if (ready) break
    await delay(100)
  }
  assert.ok(ready, `Nitro did not start: ${output}`)

  const cart = await request('/api/webstore/cart')
  assert.equal(cart.data.length, 10)
  assert.equal((await request('/api/webstore/cart?category=Brochure')).data.length, 2)
  assert.equal((await request('/api/webstore/cart?startDate=2025-04-24&endDate=2025-04-24')).data.length, 2)
  assert.equal(typeof cart.data[0].price, 'number')
  assert.equal(typeof cart.data[0].totalPrice, 'number')

  const checkout = await request('/api/webstore/checkout')
  assert.equal(checkout.data.length, 10)
  assert.equal((await request('/api/webstore/checkout?method=Kartu%20Kredit')).data.length, 2)
  assert.equal(typeof checkout.stats.totalRevenue, 'number')
  assert.equal((await request('/api/webstore/wishlist?status=Active')).data.length, 4)
  assert.equal((await request('/api/webstore/reviews?rating=5')).data.length, 3)
  assert.equal((await request('/api/webstore/contact-forms?startDate=2024-01-20&endDate=2024-01-20')).data.length, 1)

  const originalTickets = await request('/api/webstore/support-tickets')
  assert.equal(originalTickets.data.length, 5)
  assert.equal((await request('/api/webstore/support-tickets?priority=High')).data.length, 2)
  assert.equal((await request('/api/webstore/support-tickets/1501')).data.id, '1501')
  const created = (await request('/api/webstore/support-tickets', 'POST', {
    customerName: 'Webstore API Test',
    email: 'webstore@example.com',
    phone: '08123456789',
    address: 'Test address',
    city: 'Jakarta',
    country: 'Indonesia',
    descriptions: 'Upload file gagal',
  })).data
  assert.equal(created.requestedBy, 'Webstore API Test')
  assert.equal(created.subject, 'Upload file gagal')
  assert.ok(created.createdAt)
  const updated = (await request(`/api/webstore/support-tickets/${created.id}`, 'PUT', {
    status: 'Closed',
    newMessage: 'Sudah ditangani',
    senderName: 'Admin Test',
  })).data
  assert.equal(updated.status, 'Closed')
  assert.equal(updated.chat.at(-1).message, 'Sudah ditangani')
  assert.match(updated.activities.at(-1).title, /Closed/)
  assert.equal((await request(`/api/webstore/support-tickets/${created.id}`)).data.chat.at(-1).message, 'Sudah ditangani')
  await request('/api/webstore/support-tickets', 'POST', { customerName: '', email: 'bad', descriptions: '' }, 400)
  await request(`/api/webstore/support-tickets/${created.id}`, 'PUT', { status: 'Invalid' }, 400)
  await request('/api/webstore/support-tickets/not-found', 'GET', undefined, 404)
  await request(`/api/webstore/support-tickets/${created.id}`, 'DELETE')
  assert.equal((await request('/api/webstore/support-tickets')).data.length, originalTickets.data.length)

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'carts.json'), '[]', 'utf8')
  assert.deepEqual((await request('/api/webstore/cart')).data, [])
  await writeFile(join(cwd, 'data', 'carts.json'), '{', 'utf8')
  await request('/api/webstore/cart', 'GET', undefined, 500)
  await writeFile(join(cwd, 'data', 'support-tickets.json'), '[]', 'utf8')
  assert.deepEqual((await request('/api/webstore/support-tickets')).data, [])
  await writeFile(join(cwd, 'data', 'support-tickets.json'), '{', 'utf8')
  await request('/api/webstore/support-tickets', 'GET', undefined, 500)

  console.log('Webstore API checks passed: six list datasets, filters/stats, numeric money, ticket CRUD/detail/chat/status/reload, validation, empty data, invalid JSON')
} finally {
  child.kill()
}
