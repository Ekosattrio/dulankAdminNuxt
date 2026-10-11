import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root=fileURLToPath(new URL('..',import.meta.url)),cwd=await mkdtemp(join(tmpdir(),'dulank-voucher-api-'));const probe=createServer();await new Promise(done=>probe.listen(0,'127.0.0.1',done));const port=probe.address().port;await new Promise(done=>probe.close(done));const child=spawn(process.execPath,[resolve(root,'.output/server/index.mjs')],{cwd,windowsHide:true,env:{...process.env,HOST:'127.0.0.1',PORT:String(port)},stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',value=>output+=value);child.stderr.on('data',value=>output+=value);const base=`http://127.0.0.1:${port}`
async function request(path,options={},status=200){const response=await fetch(`${base}${path}`,{...options,headers:options.body?{'content-type':'application/json'}:undefined});const body=await response.text();assert.equal(response.status,status,body);return JSON.parse(body)}
try{
  let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(`${base}/api/vouchers`)).ok}catch{}if(ready)break;if(child.exitCode!==null)throw new Error(output);await delay(100)}assert.ok(ready,output)
  const initial=await request('/api/vouchers');assert.equal(initial.data.length,4);assert.deepEqual(initial.data.map(item=>item.name),['Coupons 21','First Offer','Offer 40','Subscription']);assert.deepEqual(initial.data.map(item=>item.discount),[20000,10,20000,20000]);assert.ok(initial.data.every(item=>item.storeId&&item.createdByEmployeeId&&Array.isArray(item.productIds)&&item.createdAt));assert.deepEqual(initial.meta.products.map(item=>item.name),['Nike Jordan','Amazon Echo Dot']);assert.deepEqual(initial.meta.filterProducts.map(item=>item.name),['Laptop','Lemari'])
  assert.deepEqual((await request('/api/vouchers?type=Percentage')).data.map(item=>item.name),['First Offer']);assert.deepEqual((await request('/api/vouchers?storeId=store-ekos-mart')).data.map(item=>item.name),['Offer 40','Subscription']);assert.deepEqual((await request('/api/vouchers?productId=product-amazon-echo-dot')).data.map(item=>item.name),['Coupons 21','First Offer','Subscription']);assert.deepEqual((await request('/api/vouchers?startDate=2023-04-01&endDate=2023-04-30')).data.map(item=>item.name),['Offer 40'])
  const command={name:'October Deal',code:'OCT25',type:'Percentage',discount:25,limit:5,startDate:'2026-10-01',endDate:'2026-10-31',allProducts:false,oncePerCustomer:true,productIds:['product-nike-jordan'],status:'Active'};const created=await request('/api/vouchers',{method:'POST',body:JSON.stringify(command)});assert.equal(created.data.used,0);assert.equal((await request('/api/vouchers?search=OCT25')).data.length,1)
  const updated=await request(`/api/vouchers/${created.data.id}`,{method:'PUT',body:JSON.stringify({...command,discount:30,status:'Inactive'})});assert.equal(updated.data.discount,30);assert.equal(updated.data.status,'Inactive');assert.equal((await request('/api/vouchers?search=OCT25')).data[0].discount,30)
  await request('/api/vouchers',{method:'POST',body:JSON.stringify({...command,code:'BAD',discount:101})},400);await request('/api/vouchers',{method:'POST',body:JSON.stringify({...command,code:'BAD2',allProducts:false,productIds:[]})},400);await request('/api/vouchers/missing',{method:'DELETE'},404)
  await request(`/api/vouchers/${created.data.id}`,{method:'DELETE'});assert.equal((await request('/api/vouchers?search=OCT25')).data.length,0)
  await mkdir(join(cwd,'data'),{recursive:true});await writeFile(join(cwd,'data','vouchers.json'),'{','utf8');await request('/api/vouchers',{},500)
  console.log('Voucher API checks passed: exact legacy rows, relational numeric data, filters, create/update/delete reload, validation, 404, and malformed-data safeguard')
}finally{child.kill()}
