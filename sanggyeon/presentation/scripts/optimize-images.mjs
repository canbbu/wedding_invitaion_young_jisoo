/**
 * 긴 변 리사이즈 + 포맷별 압축 (폴더 구조 유지)
 *
 * 사용:
 *   npm run optimize-images              → 상견례 public/images
 *   npm run optimize-images:invite       → 청첩장(웨 루트) images/
 *   node scripts/optimize-images.mjs <절대·상대 경로>
 *
 * 환경 변수: MAX_EDGE (기본 1920), JPEG_Q (기본 85), WEBP_Q (기본 82)
 */
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { readdir, stat, writeFile, unlink } from 'node:fs/promises'
import { join, extname, resolve, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const MAX_EDGE = Number(process.env.MAX_EDGE) || 1920
const JPEG_Q = Number(process.env.JPEG_Q) || 85
const WEBP_Q = Number(process.env.WEBP_Q) || 82

const IMAGE_RE = /\.(jpe?g|png|webp|JPE?G|PNG|WEBP)$/i

/** presentation/scripts → 상견례 public/images */
function rootPresentation() {
  return join(__dirname, '..', 'public', 'images')
}

/** presentation/scripts → 웨 루트/images (청첩장) */
function rootInvite() {
  return join(__dirname, '..', '..', '..', 'images')
}

function resolveRoot() {
  const arg = process.argv[2]
  if (!arg || arg === 'presentation' || arg === 'sanggyeon') {
    return { root: rootPresentation(), label: '상견례 public/images' }
  }
  if (arg === 'invite' || arg === '청첩장') {
    return { root: rootInvite(), label: '청첩장 웨 루트/images' }
  }
  const path = isAbsolute(arg) ? arg : resolve(process.cwd(), arg)
  return { root: path, label: path }
}

async function walk(dir, acc = []) {
  const names = await readdir(dir)
  for (const name of names) {
    const p = join(dir, name)
    const s = await stat(p)
    if (s.isDirectory()) await walk(p, acc)
    else if (IMAGE_RE.test(name)) acc.push(p)
  }
  return acc
}

function pipelineFor(filepath, w, h, needsResize) {
  let p = sharp(filepath, { failOn: 'none' }).rotate()
  if (needsResize && w > 0 && h > 0) {
    p = p.resize({
      width: w >= h ? MAX_EDGE : undefined,
      height: h > w ? MAX_EDGE : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }
  return p
}

async function optimizeOne(filepath) {
  const ext = extname(filepath).toLowerCase()
  const meta = await sharp(filepath, { failOn: 'none' }).rotate().metadata()
  const w = meta.width || 0
  const h = meta.height || 0
  const needsResize = w > 0 && h > 0 && Math.max(w, h) > MAX_EDGE

  const p = pipelineFor(filepath, w, h, needsResize)

  if (ext === '.png') {
    const hasAlpha = meta.hasAlpha === true
    if (!hasAlpha) {
      const outPath = filepath.replace(/\.png$/i, '.jpg')
      const buf = await p.jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer()
      await writeFile(outPath, buf)
      if (outPath !== filepath) await unlink(filepath)
      return { path: outPath, note: 'png→jpg' }
    }
    const buf = await p
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
      .toBuffer()
    await writeFile(filepath, buf)
    return { path: filepath, note: 'png' }
  }

  if (ext === '.webp') {
    const buf = await p.webp({ quality: WEBP_Q, effort: 6 }).toBuffer()
    await writeFile(filepath, buf)
    return { path: filepath, note: 'webp' }
  }

  const buf = await p.jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer()
  await writeFile(filepath, buf)
  return { path: filepath, note: 'jpeg' }
}

async function main() {
  const { root: ROOT, label } = resolveRoot()
  if (!existsSync(ROOT)) {
    console.error(`폴더가 없습니다: ${ROOT}`)
    console.error(`대상: ${label}`)
    process.exit(1)
  }

  const files = await walk(ROOT)
  console.log(`[${label}]`)
  console.log(`대상 ${files.length}개 · 긴 변 최대 ${MAX_EDGE}px · JPEG Q${JPEG_Q} / WebP Q${WEBP_Q}`)
  console.log('(원본을 덮어씁니다. 필요하면 먼저 Git 커밋 또는 폴더 복사 백업을 하세요.)')
  console.log('(투명 없는 PNG는 .jpg로 바뀝니다. HTML/CSS에서 .png로 직접 연결했다면 경로를 .jpg로 바꿔야 합니다.)\n')

  let ok = 0
  for (const f of files) {
    try {
      const { path, note } = await optimizeOne(f)
      console.log('OK', note, path.replace(ROOT, '').replace(/^[\\/]/, ''))
      ok++
    } catch (e) {
      console.error('FAIL', f, e.message)
    }
  }
  console.log(`\n완료 ${ok}/${files.length}`)
  if (ROOT === rootPresentation()) {
    console.log('Vite 매니페스트 갱신: `npm run dev` 또는 `npm run build` 한 번 실행.')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
