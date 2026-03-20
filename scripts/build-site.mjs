/**
 * Netlify / 로컬 통합 배포: 메인 정적 사이트 + /sanggyeon (Vite 빌드) → dist-site/
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'dist-site')
const presentation = join(root, 'sanggyeon', 'presentation')

rmSync(out, { recursive: true, force: true })
mkdirSync(join(out, 'sanggyeon'), { recursive: true })

for (const f of ['index.html', 'main.js', 'styles.css']) {
  const src = join(root, f)
  if (existsSync(src)) cpSync(src, join(out, f))
}

for (const d of ['images', 'music']) {
  const src = join(root, d)
  if (existsSync(src)) cpSync(src, join(out, d), { recursive: true })
}

execSync('npm ci && npm run build', { cwd: presentation, stdio: 'inherit', env: process.env, shell: true })

const viteOut = join(presentation, 'dist')
for (const name of readdirSync(viteOut)) {
  const from = join(viteOut, name)
  const to = join(out, 'sanggyeon', name)
  cpSync(from, to, { recursive: true })
}

console.log('dist-site ready: main at /, presentation at /sanggyeon/')
