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
const appPort = await freePort()
const debugPort = await freePort()
const cwd = await mkdtemp(join(tmpdir(), 'dulank-webstore-browser-'))
const base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) }, stdio: ['ignore', 'pipe', 'pipe'] })
let appOutput = ''
app.stdout.on('data', value => { appOutput += value })
app.stderr.on('data', value => { appOutput += value })
let ready = false
for (let attempt = 0; attempt < 100; attempt += 1) { try { ready = (await fetch(`${base}/cart`)).ok } catch {}; if (ready) break; if (app.exitCode !== null) throw new Error(appOutput); await delay(100) }
assert.ok(ready, appOutput)

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${cwd}-chrome`, '--window-size=1440,900', `${base}/cart`], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let browserOutput = ''
chrome.stderr.on('data', value => { browserOutput += value })
let socket
let id = 0
const pending = new Map()
const exceptions = []
function call(method, params = {}) { const commandId = ++id; socket.send(JSON.stringify({ id: commandId, method, params })); return new Promise((resolvePromise, reject) => pending.set(commandId, { resolve: resolvePromise, reject })) }
async function evaluate(expression) { const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result?.value }
async function waitFor(expression, label) { for (let attempt = 0; attempt < 120; attempt += 1) { if (await evaluate(expression)) return; await delay(100) } throw new Error(`Timed out waiting for ${label}`) }
async function hydrated(label) { await waitFor("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`); await delay(500) }
async function navigate(path, text) { await call('Page.navigate', { url: base + path }); await waitFor(`document.body.innerText.includes(${JSON.stringify(text)})`, path); await hydrated(path) }

try {
  let target
  for (let attempt = 0; attempt < 100; attempt += 1) { try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json())).find(item => item.type === 'page') } catch {}; if (target) break; await delay(100) }
  assert.ok(target?.webSocketDebuggerUrl, browserOutput)
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, reject) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.id) { const handler = pending.get(message.id); if (!handler) return; pending.delete(message.id); message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result) } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text) })
  await call('Runtime.enable')
  await call('Page.enable')
  await hydrated('cart')

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  const pages = [
    ['/cart', 'Cart List', 'Product'],
    ['/checkout', 'Checkout List', 'Date Checkout'],
    ['/wishlist', 'Wishlist List', 'Total Price'],
    ['/reviews', 'Reviews List', 'Rating (1-5)'],
    ['/contact-form', 'Contact Form List', 'Message'],
  ]
  for (const [path, title, header] of pages) {
    await navigate(path, title)
    assert.equal(await evaluate(`document.querySelector('thead')?.innerText.includes(${JSON.stringify(header)})`), true, `${path} header`)
    assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true, `${path} overflow`)
    assert.equal(await evaluate("!document.querySelector('thead')?.innerText.includes('Action')"), true, `${path} action column`)
  }

  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await navigate('/support-ticket', 'Support Ticket List')
  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Action')"), true)
  await evaluate("[...document.querySelectorAll('button')].find(button => button.innerText.trim() === 'Add Ticket')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Add Support Ticket')", 'add support ticket dialog')
  assert.equal(await evaluate(`(() => { const dialog=document.querySelector('dialog[open]'); const texts=[...dialog.querySelectorAll('input[type=text]')]; const set=(el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))}; set(texts[0],'Webstore Browser Test'); set(dialog.querySelector('input[type=email]'),'browser@example.com'); set(texts[1],'08123456789'); set(texts[2],'Test address'); set(texts[3],'Jakarta'); const select=dialog.querySelector('select'); select.value='United Kingdom'; select.dispatchEvent(new Event('change',{bubbles:true})); set(dialog.querySelector('textarea'),'Upload file gagal'); dialog.querySelector('button[type=submit]').click(); return true })()`), true)
  await waitFor("!document.querySelector('dialog[open]') && document.body.innerText.includes('Webstore Browser Test')", 'ticket create and reload')

  assert.equal(await evaluate("(() => { const row=[...document.querySelectorAll('tbody tr')].find(row=>row.innerText.includes('Webstore Browser Test')); row?.querySelector('button')?.click(); return Boolean(row) })()"), true)
  await waitFor("location.pathname === '/support-ticket-detail' && document.body.innerText.includes('Upload file gagal')", 'selected ticket detail navigation')
  await hydrated('support ticket detail')
  assert.equal(await evaluate("document.body.innerText.includes('Webstore Browser Test') && document.body.innerText.includes('Chat')"), true)

  await evaluate("[...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='Edit Ticket')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Edit Support Ticket')", 'edit support ticket dialog')
  await evaluate("(() => { const input=document.querySelector('dialog[open] input[type=text]'); input.value='Webstore Browser Edited'; input.dispatchEvent(new Event('input',{bubbles:true})); document.querySelector('dialog[open] button[type=submit]').click() })()")
  await waitFor("!document.querySelector('dialog[open]') && document.body.innerText.includes('Webstore Browser Edited')", 'ticket edit persistence')

  await evaluate("(() => { const input=document.querySelector('input[placeholder=\"Enter message...\"]'); input.value='Browser reply persisted'; input.dispatchEvent(new Event('input',{bubbles:true})) })()")
  await waitFor("!document.querySelector('input[placeholder=\"Enter message...\"]')?.closest('form').querySelector('button[type=submit]').disabled", 'chat submit enabled')
  await evaluate("document.querySelector('input[placeholder=\"Enter message...\"]')?.closest('form').requestSubmit()")
  await waitFor("document.body.innerText.includes('Browser reply persisted')", 'chat persistence')
  await evaluate("[...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='Close Ticket')?.click()")
  await waitFor("document.body.innerText.includes('Status Changed to') && document.body.innerText.includes('Closed')", 'status persistence')
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true)

  await navigate('/support-ticket', 'Webstore Browser Edited')
  await evaluate("(() => { const row=[...document.querySelectorAll('tbody tr')].find(row=>row.innerText.includes('Webstore Browser Edited')); row?.querySelector('button[aria-label=\"Delete\"]')?.click() })()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Delete record')", 'delete confirmation')
  await evaluate("[...document.querySelectorAll('dialog[open] button')].find(button=>button.innerText.trim()==='Delete')?.click()")
  await waitFor("!document.body.innerText.includes('Webstore Browser Edited')", 'ticket deletion reload')
  assert.deepEqual(exceptions, [])
  console.log('Webstore browser checks passed: five read-only lists, mobile overflow/no Action, support Add/detail navigation/edit/chat/status/delete/reload, no runtime exceptions')
} finally {
  socket?.close()
  chrome.kill()
  app.kill()
}
