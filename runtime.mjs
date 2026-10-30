import { pathToFileURL } from 'node:url'
import path from 'node:path'

// Share the host's Cordis/protocol instance. The fallback is relative to the
// Electron resource directory on all platforms, never a machine-specific path.
export async function loadHostPackage(name) {
  try { return await import(name) }
  catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND' || !process.resourcesPath) throw error
    return import(pathToFileURL(path.join(process.resourcesPath, 'app.asar', 'dsh', 'node_modules', name, 'lib', 'index.js')).href)
  }
}
