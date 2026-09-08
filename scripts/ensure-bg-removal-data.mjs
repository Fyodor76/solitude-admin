/**
 * Кладёт WASM/ONNX для @imgly/background-removal в public/background-removal-data.
 * Браузер потом берёт их с нашего хоста, не с staticimgly.com.
 *
 * node scripts/ensure-bg-removal-data.mjs
 * (также из prebuild)
 */
import { createWriteStream, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'background-removal-data')
const marker = path.join(outDir, 'resources.json')
const VERSION = '1.7.0'
const DATA_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/package.tgz`

if (existsSync(marker)) {
  console.log('[bg-removal-data] already present, skip')
  process.exit(0)
}

console.log('[bg-removal-data] downloading…', DATA_URL)

const tmpDir = path.join(root, '.bg-removal-tmp')
rmSync(tmpDir, { recursive: true, force: true })
mkdirSync(tmpDir, { recursive: true })
mkdirSync(path.dirname(outDir), { recursive: true })
rmSync(outDir, { recursive: true, force: true })

const response = await fetch(DATA_URL)
if (!response.ok || !response.body) {
  console.error('[bg-removal-data] download failed', response.status)
  process.exit(1)
}

const tgzPath = path.join(tmpDir, 'package.tgz')
await pipeline(Readable.fromWeb(response.body), createWriteStream(tgzPath))

execFileSync('tar', ['-xzf', tgzPath, '-C', tmpDir], { stdio: 'inherit' })

const dist = path.join(tmpDir, 'package', 'dist')
if (!existsSync(path.join(dist, 'resources.json'))) {
  console.error('[bg-removal-data] unexpected archive layout')
  process.exit(1)
}

renameSync(dist, outDir)
rmSync(tmpDir, { recursive: true, force: true })
console.log('[bg-removal-data] ready at public/background-removal-data')
