import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SECTIONS = ['youth', 'future_kid', 'nagoya', 'days', 'propose'] as const

function buildMediaManifest() {
  const baseDir = path.join(__dirname, 'public', 'images')
  const manifest: Record<string, { images: string[]; videos: string[] }> = {}
  for (const section of SECTIONS) {
    const dir = path.join(baseDir, section)
    const images: string[] = []
    const videos: string[] = []
    if (fs.existsSync(dir)) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name)
        if (!fs.statSync(full).isFile()) continue
        const urlPath = `images/${section}/${encodeURIComponent(name)}`
        if (/\.(mp4|webm)$/i.test(name)) videos.push(urlPath)
        else if (/\.(jpg|jpeg|png|webp|JPG)$/i.test(name)) images.push(urlPath)
      }
    }
    images.sort()
    videos.sort()
    manifest[section] = { images, videos }
  }
  return manifest
}

// https://vite.dev/config/
export default defineConfig({
  base: '/sanggyeon/',
  plugins: [react()],
  define: {
    __MEDIA_MANIFEST__: JSON.stringify(buildMediaManifest()),
  },
})
