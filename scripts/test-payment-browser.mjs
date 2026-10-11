import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const root = fileURLToPath(new URL('..', import.meta.url))
const profile = await mkdtemp(join(tmpdir(), 'dulank-payment-browser-'))
async function availablePort() {
  const server = createServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const selected = server.address().port
  await new Promise((done) => server.close(done))
  return selected
}
const appPort = await availablePort()
const base = `http://127.0.0.1:${appPort}`
const appChild = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd: profile,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let appOutput = ''
appChild.stdout.on('data', (chunk) => { appOutput += chunk })
appChild.stderr.on('data', (chunk) => { appOutput += chunk })
let appReady = false
for (let attempt = 0; attempt < 100; attempt += 1) {
  if (appChild.exitCode !== null) throw new Error(appOutput)
  try { appReady = (await fetch(`${base}/payment-inflow`)).ok } catch {}
  if (appReady) break
  await delay(100)
}
assert.equal(appReady, true, `Built application did not start: ${appOutput}`)
const probe = createServer()
await new Promise((done) => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise((done) => probe.close(done))
const child = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--disable-extensions',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--window-size=1440,900',
  `${base}/payment-inflow`,
], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })

let browserOutput = ''
child.stdout.on('data', (chunk) => { browserOutput += chunk })
child.stderr.on('data', (chunk) => { browserOutput += chunk })

let socket
const pending = new Map()
const exceptions = []
let commandId = 0

function call(method, params = {}) {
  const id = ++commandId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

async function evaluate(expression) {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Browser evaluation failed')
  return response.result?.value
}

async function waitFor(expression, label) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(expression)) return
    await delay(100)
  }
  throw new Error(`Timed out waiting for ${label}`)
}

async function clickByText(selector, text) {
  const clicked = await evaluate(`(() => {
    const element = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((node) => node.textContent.trim().includes(${JSON.stringify(text)}));
    if (!element) return false;
    element.click();
    return true;
  })()`)
  assert.equal(clicked, true, `Missing ${selector} containing ${text}`)
}

async function setInputAfterLabel(label, value) {
  const updated = await evaluate(`(() => {
    const label = [...document.querySelectorAll('dialog[open] label')]
      .find((node) => node.textContent.trim().startsWith(${JSON.stringify(label)}));
    const row = label?.closest('.grid.grid-cols-12');
    const input = row?.querySelector('input');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`)
  assert.equal(updated, true, `Unable to set input for ${label}`)
}

try {
  let target
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(browserOutput)
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
      target = targets.find((item) => item.type === 'page')
    } catch {}
    if (target) break
    await delay(100)
  }
  assert.ok(target?.webSocketDebuggerUrl, `Chrome target unavailable: ${browserOutput}`)
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const handler = pending.get(message.id)
      if (!handler) return
      pending.delete(message.id)
      if (message.error) handler.reject(new Error(message.error.message))
      else handler.resolve(message.result)
      return
    }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text)
  })
  await call('Runtime.enable')
  await call('Page.enable')
  await waitFor("document.querySelectorAll('tbody tr').length >= 10", 'Payment Inflow rows')
  await waitFor("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", 'Nuxt hydration')
  await delay(1000)

  assert.equal(await evaluate("document.querySelector('h1,h2,h3,h4')?.textContent.includes('Payment Inflow')"), true)
  assert.equal(await evaluate("[...document.querySelectorAll('button')].find((el) => el.textContent.trim() === 'Balance Summary')?.getAttribute('aria-expanded')"), 'false')
  assert.equal(await evaluate("document.body.innerText.includes('All Sources') || document.body.innerText.includes('All Statuses') || document.body.innerText.includes('/ page')"), false)

  assert.equal(await evaluate("(() => { const button = [...document.querySelectorAll('button')].find((el) => el.textContent.trim() === 'Balance Summary'); button?.click(); return Boolean(button); })()"), true)
  await waitFor("[...document.querySelectorAll('button')].find((el) => el.textContent.trim() === 'Balance Summary')?.getAttribute('aria-expanded') === 'true'", 'expanded balance summary')
  assert.equal(await evaluate("[...document.querySelectorAll('table')].some((table) => table.innerText.includes('Qris Mandiri'))"), true)

  await clickByText('button', 'Add Payment Inflow')
  await waitFor("Boolean(document.querySelector('dialog[open]'))", 'Add Payment Inflow dialog')
  assert.equal(await evaluate("document.querySelector('dialog[open]')?.innerText.includes('Payment Amount')"), true)
  assert.equal(await evaluate("document.querySelector('dialog[open] input[type=radio][value=Balance]')?.checked"), true)

  await clickByText('dialog[open] button', 'Add Split Payment')
  await waitFor("[...document.querySelectorAll('dialog[open] h4')].filter((node) => /^Payment \\d+$/.test(node.textContent.trim())).length === 2", 'two split payment rows')
  await clickByText('dialog[open] button', 'Add Payment')
  assert.equal(await evaluate("[...document.querySelectorAll('dialog[open] h4')].filter((node) => /^Payment \\d+$/.test(node.textContent.trim())).length"), 3)
  await setInputAfterLabel('Amount', '500000')
  const splitInputsUpdated = await evaluate(`(() => {
    const amountLabels = [...document.querySelectorAll('dialog[open] label')].filter((node) => node.textContent.trim() === 'Amount');
    const input = amountLabels[1]?.closest('.grid.grid-cols-12')?.querySelector('input');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, '250000'); input.dispatchEvent(new Event('input', { bubbles: true })); return true;
  })()`)
  assert.equal(splitInputsUpdated, true)
  assert.equal(await evaluate("[...document.querySelectorAll('dialog[open] input')].some((input) => input.disabled && input.value === '750.000')"), true)
  await clickByText('dialog[open] button', 'Cancel')
  assert.equal(await evaluate("[...document.querySelectorAll('dialog[open] button')].some((node) => node.textContent.trim() === 'Add Split Payment')"), true)

  await setInputAfterLabel('Payment Amount', '2250000')
  assert.equal(await evaluate("[...document.querySelectorAll('dialog[open] tbody tr')].filter((row) => row.innerText.includes('Paid')).length"), 3)
  assert.equal(await evaluate("document.querySelector('dialog[open]')?.scrollWidth <= document.querySelector('dialog[open]')?.clientWidth"), true)
  await evaluate("document.querySelector('dialog[open] button[aria-label=\"Close dialog\"]')?.click()")
  await waitFor("!document.querySelector('dialog[open]')", 'closed inflow dialog')

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await call('Page.navigate', { url: `${base}/payment-outflow` })
  await waitFor("document.body.innerText.includes('Payment Outflow') && document.querySelectorAll('tbody tr').length >= 10", 'mobile Payment Outflow')
  await waitFor("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", 'mobile Nuxt hydration')
  await delay(1000)
  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true)
  assert.equal(await evaluate("[...document.querySelectorAll('button')].find((el) => el.textContent.trim() === 'Balance Summary')?.getAttribute('aria-expanded')"), 'false')
  await clickByText('button', 'Add Payment Outflow')
  await waitFor("Boolean(document.querySelector('dialog[open]'))", 'mobile Add Payment Outflow dialog')
  assert.equal(await evaluate("(() => { const rect = document.querySelector('dialog[open]').getBoundingClientRect(); return rect.left >= 0 && rect.right <= window.innerWidth && rect.width <= window.innerWidth - 16; })()"), true)
  assert.equal(await evaluate("document.querySelector('dialog[open]').scrollWidth <= document.querySelector('dialog[open]').clientWidth"), true)
  assert.deepEqual(exceptions, [])

  console.log('Payment browser checks passed: initial parity, balance collapse, Add modal, split rows, reactive amount/status, desktop and 390px overflow, no runtime exceptions')
} finally {
  for (const { reject } of pending.values()) reject(new Error('Browser closed'))
  socket?.close()
  child.kill()
  appChild.kill()
}
