import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

// One atomic flag per session: different profiles do not overwrite each other's
// whole state map. Package installs and updates never own these data files.
export class Modes {
  constructor(directory, warn = () => {}) {
    this.directory = directory
    this.warn = warn
    this.warned = new Set()
  }
  file(id) {
    if (typeof id !== 'string' || !id || id.length > 200) throw new Error('Invalid session id')
    return path.join(this.directory, Buffer.from(id).toString('base64url') + '.json')
  }
  get(id) {
    const file = this.file(id)
    try {
      const value = JSON.parse(fs.readFileSync(file,'utf8'))
      return value.version === 1 && value.mode === 'execute' ? 'execute' : 'discuss'
    } catch (error) {
      if (error.code !== 'ENOENT' && !this.warned.has(file)) {
        this.warned.add(file)
        this.warn(error)
      }
      return 'discuss'
    }
  }
  set(id, mode) {
    if (!['discuss','execute'].includes(mode)) throw new Error('Invalid mode')
    const file = this.file(id), temp = file + '.' + randomUUID() + '.tmp'
    fs.mkdirSync(this.directory,{recursive:true,mode:0o700})
    try {
      fs.writeFileSync(temp,JSON.stringify({version:1,mode}),{flag:'wx',mode:0o600})
      fs.renameSync(temp,file)
    } finally {
      try { fs.unlinkSync(temp) } catch (error) { if (error.code !== 'ENOENT') this.warn(error) }
    }
    return mode
  }
}
