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
const cwd = await mkdtemp(join(tmpdir(), 'dulank-cetak-full-color-browser-'))
const base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) }, stdio: ['ignore', 'pipe', 'pipe'] })
let output = ''
app.stdout.on('data', value => { output += value })
app.stderr.on('data', value => { output += value })
let ready = false
for (let index = 0; index < 100; index += 1) { try { ready = (await fetch(`${base}/cetak-full-color`)).ok } catch {} if (ready) break; await delay(100) }
assert.ok(ready, output)

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${cwd}-chrome`, '--window-size=1440,900', `${base}/cetak-full-color`], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let socket
let id = 0
const calls = new Map()
const exceptions = []
function call(method, params = {}) { const requestId = ++id; socket.send(JSON.stringify({ id: requestId, method, params })); return new Promise((resolvePromise, rejectPromise) => calls.set(requestId, { resolve: resolvePromise, reject: rejectPromise })) }
async function evaluate(expression) { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || JSON.stringify(result.exceptionDetails)); return result.result?.value }
async function wait(expression, label) { for (let index = 0; index < 180; index += 1) { if (await evaluate(expression)) return; await delay(100) } throw new Error(`Timeout ${label}`) }
async function navigate(url, expression, label) { await call('Page.navigate', { url }); await wait(expression, label); await wait("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`) }
async function clickButton(text) { await evaluate(`([...document.querySelectorAll('button')].find(button => button.innerText.trim() === ${JSON.stringify(text)})?.click(), true)`); await delay(100) }

try {
  let target
  for (let index = 0; index < 100; index += 1) { try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json())).find(item => item.type === 'page') } catch {} if (target) break; await delay(100) }
  assert.ok(target, 'Chrome DevTools target was not available')
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, fail) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', fail, { once: true }) })
  socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.id) { const handler = calls.get(message.id); if (!handler) return; calls.delete(message.id); message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result) } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text) })
  await call('Runtime.enable')
  await call('Page.enable')

  await wait("document.body.innerText.includes('All Product Custom') && document.body.innerText.includes('Tiket Karcis')", 'product cards')
  await wait("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", 'hydration')
  assert.equal(await evaluate("['Cetak Full Color','Manage your Product','Product Custom Default','Product Size','Paper Type','Machine Type','Laminate','Fold','Print Side','Components','Work Flow','Profit Setting','Log Transaction'].every(text => document.body.innerText.includes(text))"), true)
  assert.equal(await evaluate("[...document.querySelectorAll('main img')].filter(image => image.src === 'https://percetakan-dulank.netlify.app/images/brosur.jpg').length === 5"), true)
  assert.equal(await evaluate("[...document.querySelectorAll('.product-spec-row')].filter(row => row.firstElementChild?.innerText === 'Ukuran Brosur').length === 5"), true)

  await clickButton('Paper Type')
  await wait("document.body.innerText.includes('Paper Type Option') && document.body.innerText.includes('Effective Paper Group')", 'paper tab')
  assert.equal(await evaluate("['Art Paper','Art Carton','HVS','Carton BC','100 gr','120 gr','150 gr','Pesan Kertas ke Toko','Nurdin','5.000 per Job'].every(text => document.body.innerText.includes(text))"), true)
  await evaluate("(()=>{const buttons=document.querySelector('.configuration-multi-select')?.querySelectorAll('button');buttons?.[buttons.length-1]?.click()})()")
  await wait("document.querySelectorAll('.configuration-multi-select div.absolute button').length === 4", 'target dropdown')
  assert.deepEqual(await evaluate("(()=>{const box=document.querySelector('.configuration-multi-select');return {chips:[...box.querySelectorAll('span.inline-flex > span:first-child')].map(chip=>chip.innerText.trim()),options:[...box.querySelectorAll('div.absolute button')].map(button=>button.innerText.trim())}})()"), { chips: ['Art Paper'], options: ['Art Paper', 'Art Carton', 'HVS', 'Carton BC'] })
  await evaluate("(()=>{[...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='Art Carton')?.click()})()")
  await evaluate("(()=>{[...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='HVS')?.click()})()")
  await delay(300)
  assert.equal(await evaluate("!document.body.innerText.includes('Configuration saved successfully.')"), true)
  await evaluate("(()=>{const section=document.querySelector('.configuration-multi-select')?.closest('section');[...section?.querySelectorAll('button') || []].find(button=>button.innerText.trim()==='Save')?.click()})()")
  await wait("document.body.innerText.includes('Configuration saved successfully.')", 'multiple selection save')
  await navigate(`${base}/cetak-full-color`, "document.body.innerText.includes('All Product Custom')", 'reload')
  await clickButton('Paper Type')
  await wait("document.body.innerText.includes('Effective Paper Group')", 'paper tab after reload')
  assert.deepEqual(await evaluate("[...document.querySelector('.configuration-multi-select').querySelectorAll('span.inline-flex > span:first-child')].map(chip=>chip.innerText.trim())"), ['Art Paper', 'Art Carton', 'HVS'])

  await clickButton('Machine Type')
  await wait("document.body.innerText.includes('heidlberg sm52') && document.body.innerText.includes('Effective Printing Type')", 'machine tab')
  assert.equal(await evaluate("['OffSet','heidlberg sm74','heidlberg sm104','Xerox C 60','Plat CTP','Print A3','Spk Cetak Offset'].every(text => document.body.innerText.includes(text))"), true)

  await clickButton('Profit Setting')
  await wait("document.body.innerText.includes('Profit Markup Options')", 'profit tab')
  const missingProfitText = await evaluate("(()=>{const content=document.body.innerText+' '+[...document.querySelectorAll('input')].map(input=>input.value).join(' ');return ['Profit Markup on Production Cost','Profit markup based on the total production cost range','Additional Fees','Biaya Transport','Biaya Packing','Additional TAX Charge','Ppn','Pph'].filter(text => !content.includes(text))})()")
  assert.deepEqual(missingProfitText, [], `Missing profit text: ${missingProfitText.join(', ')}`)

  await clickButton('Log Transaction')
  await wait("document.body.innerText.includes('2511000001') && document.body.innerText.includes('2511000010')", 'log tab')
  assert.equal(await evaluate("['No Sales','Customers','Date','Chanel','Product Name','Price','PT Makmur Abadi','Universitas Bintang','1.200.000','1.450.000'].every(text => document.body.innerText.includes(text))"), true)

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await navigate(`${base}/cetak-full-color`, "document.body.innerText.includes('All Product Custom')", 'mobile route')
  const width = await evaluate("({page:document.documentElement.scrollWidth,view:window.innerWidth})")
  assert.ok(width.page <= width.view, JSON.stringify(width))
  assert.deepEqual(exceptions, [])
  console.log('Cetak Full Color browser checks passed: exact cards/tabs/data, real multiple select persistence, profit/log parity, and desktop/390px without runtime exceptions')
} finally {
  socket?.close()
  chrome.kill()
  app.kill()
}
