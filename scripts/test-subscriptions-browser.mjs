import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
async function freePort() {
  const server = createServer()
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  const value = server.address().port
  await new Promise(done => server.close(done))
  return value
}
const appPort = await freePort()
const debugPort = await freePort()
const cwd = await mkdtemp(join(tmpdir(), 'dulank-subscriptions-browser-'))
const base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
app.stdout.on('data', value => output += value)
app.stderr.on('data', value => output += value)
let ready = false
for (let index = 0; index < 100; index++) {
  try { ready = (await fetch(`${base}/subscriptions`)).ok } catch {}
  if (ready) break
  await delay(100)
}
assert.ok(ready, output)

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${cwd}-chrome`, '--window-size=1440,900', `${base}/subscriptions`,
], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let socket
let id = 0
const calls = new Map()
const exceptions = []
function call(method, params = {}) {
  const requestId = ++id
  socket.send(JSON.stringify({ id: requestId, method, params }))
  return new Promise((resolvePromise, rejectPromise) => calls.set(requestId, { resolve: resolvePromise, reject: rejectPromise }))
}
async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result?.value
}
async function wait(expression, label) {
  for (let index = 0; index < 180; index++) {
    if (await evaluate(expression)) return
    await delay(100)
  }
  throw new Error(`Timeout ${label}`)
}
async function navigate(url, readyExpression, label) {
  await call('Page.navigate', { url })
  await wait(readyExpression, label)
  await wait("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`)
}

try {
  let target
  for (let index = 0; index < 100; index++) {
    try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json())).find(item => item.type === 'page') } catch {}
    if (target) break
    await delay(100)
  }
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, fail) => {
    socket.addEventListener('open', done, { once: true })
    socket.addEventListener('error', fail, { once: true })
  })
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const handler = calls.get(message.id)
      if (!handler) return
      calls.delete(message.id)
      message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result)
    } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text)
  })
  await call('Runtime.enable')
  await call('Page.enable')
  await wait("document.body.innerText.includes('BrightWave Innovations') && document.body.innerText.includes('Expired Subscribers')", 'subscription content')
  await wait("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", 'subscription hydration')
  assert.equal(await evaluate("['Subscriber','Plan','Billing Cycle','Payment Method','Amount','Created Date','Expiring On','Status','Action'].every(t=>document.body.innerText.includes(t))"), true)
  assert.equal(await evaluate("document.body.innerText.includes('307.000') && document.body.innerText.includes('4,385')"), true)

  await evaluate("document.querySelector('[title=\"View Subscription\"]')?.click()")
  await wait("document.querySelector('dialog[open]')?.innerText.includes('Subscription Detail')", 'view dialog')
  assert.equal(await evaluate("document.querySelector('dialog[open]')?.innerText.includes('BrightWave Innovations')"), true)
  await evaluate("document.querySelector('dialog[open] button[aria-label=\"Close dialog\"]')?.click()")

  await evaluate("document.querySelector('[title=\"Edit Subscription\"]')?.click()")
  await wait("document.querySelector('dialog[open]')?.innerText.includes('Edit Subscription')", 'edit dialog')
  await evaluate("(()=>{const d=document.querySelector('dialog[open]');const s=[...d.querySelectorAll('select')].at(-1);s.value='Unpaid';s.dispatchEvent(new Event('change',{bubbles:true}));d.querySelector('form').requestSubmit()})()")
  await wait("document.body.innerText.includes('Subscription updated successfully')", 'edit persistence')

  await evaluate("(()=>{const s=document.querySelector('select[aria-label=\"Plan\"]');s.value='Basic';s.dispatchEvent(new Event('change',{bubbles:true}))})()")
  await wait("!document.body.innerText.includes('BrightWave Innovations') && document.body.innerText.includes('UrbanPulse Design')", 'plan filter')
  await evaluate("(()=>{const s=document.querySelector('select[aria-label=\"Plan\"]');s.value='';s.dispatchEvent(new Event('change',{bubbles:true}))})()")
  await wait("document.body.innerText.includes('BrightWave Innovations')", 'clear filter')

  await evaluate("document.querySelector('[title=\"Export PDF (Save as PDF)\"]')?.click()")
  await wait("document.querySelector('dialog[open]')?.innerText.includes('Cetak & Ekspor Dokumen Laporan')", 'print dialog')
  await evaluate("document.querySelector('dialog[open] button[aria-label=\"Close dialog\"]')?.click()")

  await evaluate("document.querySelector('[title=\"Delete Subscription\"]')?.click()")
  await wait("document.querySelector('dialog[open]')?.innerText.includes('Delete Subscription')", 'delete confirmation')
  await evaluate("[...document.querySelector('dialog[open]').querySelectorAll('button')].find(b=>b.innerText.trim()==='Delete')?.click()")
  await wait("document.body.innerText.includes('Subscription deleted successfully') && !document.body.innerText.includes('BrightWave Innovations')", 'delete persistence')

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await navigate(`${base}/subscriptions`, "document.body.innerText.includes('Subscription List') && document.body.innerText.includes('UrbanPulse Design')", 'subscriptions mobile')
  const width = await evaluate("({page:document.documentElement.scrollWidth,view:window.innerWidth})")
  assert.ok(width.page <= width.view, JSON.stringify(width))
  assert.deepEqual(exceptions, [])
  console.log('Subscriptions browser checks passed: legacy content, view/edit/delete, filters, print, and desktop/390px without runtime exceptions')
} finally {
  socket?.close()
  chrome.kill()
  app.kill()
}
