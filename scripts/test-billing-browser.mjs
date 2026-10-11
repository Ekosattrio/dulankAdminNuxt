import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
async function freePort() { const server = createServer(); await new Promise(done => server.listen(0, '127.0.0.1', done)); const value = server.address().port; await new Promise(done => server.close(done)); return value }
const appPort = await freePort(), debugPort = await freePort(), cwd = await mkdtemp(join(tmpdir(), 'dulank-billing-browser-')), base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) }, stdio: ['ignore', 'pipe', 'pipe'] })
let output = ''
app.stdout.on('data', value => output += value)
app.stderr.on('data', value => output += value)
let ready = false
for (let index = 0; index < 100; index++) { try { ready = (await fetch(`${base}/billing`)).ok } catch {} if (ready) break; await delay(100) }
assert.ok(ready, output)
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${cwd}-chrome`, '--window-size=1440,900', `${base}/billing`], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let socket, id = 0
const calls = new Map(), exceptions = []
function call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolvePromise, rejectPromise) => calls.set(requestId, { resolve: resolvePromise, reject: rejectPromise })) }
async function evaluate(expression) { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result?.value }
async function wait(expression, label) { for (let index = 0; index < 180; index++) { if (await evaluate(expression)) return; await delay(100) } throw new Error(`Timeout ${label}`) }
async function navigate(url, expression, label) { await call('Page.navigate', { url }); await wait(expression, label); await wait("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`) }
try {
  let target
  for (let index = 0; index < 100; index++) { try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json())).find(item => item.type === 'page') } catch {} if (target) break; await delay(100) }
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, fail) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', fail, { once: true }) })
  socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.id) { const handler = calls.get(message.id); if (!handler) return; calls.delete(message.id); message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result) } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text) })
  await call('Runtime.enable'); await call('Page.enable')
  await wait("document.body.innerText.includes('B-001') && document.body.innerText.includes('B-010')", 'billing rows')
  await wait("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", 'billing hydration')
  assert.equal(await evaluate("['Billing List','Manage Billing','Total Transaction','307,144','Total Success','4,385','Total Failed','385,656'].every(t=>document.body.innerText.includes(t))"), true)
  assert.deepEqual(await evaluate("[...document.querySelectorAll('thead th')].map(node=>node.innerText.trim())"), ['ID Billing', 'ID Transaksi', 'ID Pengguna', 'Tanggal Billing', 'Jumlah Tagihan', 'Diskon', 'Pajak', 'Biaya Pengiriman', 'Total Pembayaran', 'Status Pembayaran', 'Metode Pembayaran'])
  assert.equal(await evaluate("document.body.innerText.includes('Action') || Boolean(document.querySelector('dialog'))"), false)
  await evaluate("(()=>{const s=document.querySelector('select[aria-label=\"Status\"]');s.value='Gagal';s.dispatchEvent(new Event('change',{bubbles:true}))})()")
  await wait("document.body.innerText.includes('B-004') && document.body.innerText.includes('B-008') && !document.body.innerText.includes('B-001')", 'status filter')
  await evaluate("(()=>{const s=document.querySelector('select[aria-label=\"Status\"]');s.value='';s.dispatchEvent(new Event('change',{bubbles:true}))})()")
  await wait("document.body.innerText.includes('B-001')", 'clear status filter')
  await evaluate("(()=>{const input=document.querySelector('input[aria-label=\"Search records\"]');input.value='sophia';input.dispatchEvent(new Event('input',{bubbles:true}))})()")
  await wait("document.body.innerText.includes('B-010') && !document.body.innerText.includes('B-001')", 'search filter')
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await navigate(`${base}/billing`, "document.body.innerText.includes('B-001') && document.body.innerText.includes('B-010')", 'billing mobile')
  const width = await evaluate("({page:document.documentElement.scrollWidth,view:window.innerWidth})")
  assert.ok(width.page <= width.view, JSON.stringify(width))
  assert.deepEqual(exceptions, [])
  console.log('Billing browser checks passed: exact legacy KPI/table content, no invented actions, search/status filters, and desktop/390px without runtime exceptions')
} finally { socket?.close(); chrome.kill(); app.kill() }
