import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
async function port() { const server = createServer(); await new Promise(done => server.listen(0, '127.0.0.1', done)); const value = server.address().port; await new Promise(done => server.close(done)); return value }
const appPort = await port()
const debugPort = await port()
const profile = await mkdtemp(join(tmpdir(), 'dulank-sales-adjacent-'))
const base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd: profile, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) }, stdio: ['ignore', 'pipe', 'pipe'] })
let appOutput = ''
app.stdout.on('data', value => { appOutput += value })
app.stderr.on('data', value => { appOutput += value })
for (let attempt = 0; attempt < 100; attempt += 1) { try { if ((await fetch(`${base}/sales-dashboard`)).ok) break } catch {}; if (app.exitCode !== null) throw new Error(appOutput); await delay(100) }

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}-chrome`, '--window-size=1440,900', `${base}/sales-dashboard`], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let browserOutput = ''
chrome.stderr.on('data', value => { browserOutput += value })
let socket
let id = 0
const pending = new Map()
const exceptions = []
function call(method, params = {}) { const commandId = ++id; socket.send(JSON.stringify({ id: commandId, method, params })); return new Promise((resolvePromise, reject) => pending.set(commandId, { resolve: resolvePromise, reject })) }
async function evaluate(expression) { const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result?.value }
async function waitFor(expression, label) { for (let attempt = 0; attempt < 100; attempt += 1) { if (await evaluate(expression)) return; await delay(100) } throw new Error(`Timed out waiting for ${label}`) }
async function hydrated(label) { await waitFor("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`); await delay(700) }
async function navigate(path, readyExpression) { await call('Page.navigate', { url: base + path }); await waitFor(readyExpression, path); await hydrated(path) }

try {
  let target
  for (let attempt = 0; attempt < 100; attempt += 1) { try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(r => r.json())).find(item => item.type === 'page') } catch {}; if (target) break; await delay(100) }
  assert.ok(target?.webSocketDebuggerUrl, browserOutput)
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, reject) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.id) { const handler = pending.get(message.id); if (!handler) return; pending.delete(message.id); message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result) } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text) })
  await call('Runtime.enable')
  await call('Page.enable')
  await waitFor("document.body.innerText.includes('Recent Transactions')", 'dashboard content')
  await hydrated('dashboard')
  assert.equal(await evaluate("document.body.innerText.includes('Weekly Earning') && document.body.innerText.includes('Sales by Countries')"), true)
  assert.equal(await evaluate("[...document.querySelectorAll('button')].filter(button => button.innerText.includes('Lenovo 3rd Generation')).length"), 1)
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true)
  assert.equal(await evaluate("(() => { const button=[...document.querySelectorAll('button')].find(node=>node.innerText.includes('Lenovo 3rd Generation')); button?.click(); return Boolean(button) })()"), true)
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Product Details')", 'product detail dialog')
  await evaluate("document.querySelector('dialog[open] button[aria-label=\"Close dialog\"]')?.click()")

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await navigate('/sales-report', "document.body.innerText.includes('Total Sales Amount')")
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true)
  assert.equal(await evaluate("!document.body.innerText.includes('All Categories') && !document.body.innerText.includes('All Channels')"), true)
  assert.equal(await evaluate("[...document.querySelectorAll('tbody tr')].some(row => row.innerText.includes('Cetak Dokumen'))"), true)
  assert.equal(await evaluate("(() => { const row=[...document.querySelectorAll('tbody tr')].find(node=>node.innerText.includes('Print Outdoor')); row?.querySelector('button')?.click(); return Boolean(row) })()"), true)
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Detail Report Product')", 'sales report detail dialog')
  assert.equal(await evaluate("document.querySelectorAll('dialog[open] tbody tr').length"), 10)
  assert.equal(await evaluate("document.querySelector('dialog[open]').scrollWidth <= document.querySelector('dialog[open]').clientWidth"), true)

  await navigate('/sales-note?id=1', "document.body.innerText.includes('PT001')")
  assert.equal(await evaluate("document.body.innerText.includes('PT. Exabytes Network Indonesia') && document.body.innerText.includes('Print Note')"), true)
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true)
  await navigate('/sales-receipt?id=2', "document.body.innerText.includes('PT002')")
  assert.equal(await evaluate("document.body.innerText.includes('Siti Aminah') && document.body.innerText.includes('Print Struk')"), true)
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true)
  assert.deepEqual(exceptions, [])
  console.log('Sales-adjacent browser checks passed: dashboard API UI/dialog, report legacy controls/detail, selected-record note/receipt, 390px overflow, no runtime exceptions')
} finally {
  socket?.close()
  chrome.kill()
  app.kill()
}
