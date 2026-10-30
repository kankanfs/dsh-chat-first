import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const root=fileURLToPath(new URL('..',import.meta.url))
const manifest=JSON.parse(fs.readFileSync(path.join(root,'package.json')))
fs.mkdirSync(path.join(root,'dist'),{recursive:true})
// Arguments are fixed literals. Windows npm.cmd needs cmd.exe; no user text is interpolated.
const packed=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['pack','--json','--pack-destination','dist','--offline','--ignore-scripts'],{cwd:root,encoding:'utf8',shell:process.platform==='win32'})
if(packed.status!==0) throw new Error(packed.stderr || packed.error?.message || 'npm pack failed')
const info=JSON.parse(packed.stdout)[0]
const allowed=new Set(['package.json',...manifest.files])
for(const file of info.files) {
  assert.ok(allowed.has(file.path),`Unexpected release file: ${file.path}`)
  assert.doesNotMatch(file.path,/session-|validation|\.log$|\.jpg$|\.png$|\.env|credentials/)
  const text=fs.readFileSync(path.join(root,file.path),'utf8')
  assert.doesNotMatch(text,/[A-Z]:[\\/]Users[\\/]|sk-[A-Za-z0-9]{20,}|token=[A-Za-z0-9_-]{20,}|session-[0-9a-f]{8}-/i,`Private data in ${file.path}`)
}
const artifact=path.join(root,'dist',info.filename)
const result={name:manifest.name,version:manifest.version,files:info.files.map(f=>f.path),size:fs.statSync(artifact).size,sha256:createHash('sha256').update(fs.readFileSync(artifact)).digest('hex'),published:false}
fs.writeFileSync(path.join(root,'dist','release-check.json'),JSON.stringify(result,null,2))
console.log(JSON.stringify(result,null,2))
