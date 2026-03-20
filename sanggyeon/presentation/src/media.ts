/** `public/images/{섹션}/` 파일 목록 — dev/build 시 vite.config에서 스캔해 주입됩니다. */

export type SectionId = 'youth' | 'future_kid' | 'nagoya' | 'days' | 'propose'

function withBase(urlPath: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  return `${base}${urlPath.replace(/^\//, '')}`
}

const manifest = __MEDIA_MANIFEST__

export function getSectionMedia(section: SectionId) {
  const m = manifest[section] ?? { images: [], videos: [] }
  return {
    images: m.images.map(withBase),
    videos: m.videos.map(withBase),
  }
}

/** 섹션 히어로: 비디오 우선, 없으면 첫 이미지 */
export function getHeroSource(section: SectionId): { type: 'video' | 'image' | 'none'; src?: string } {
  const { videos, images } = getSectionMedia(section)
  if (videos.length > 0) return { type: 'video', src: videos[0] }
  if (images.length > 0) return { type: 'image', src: images[0] }
  return { type: 'none' }
}

export function getYouthProfileImages(): { groom: string | null; bride: string | null } {
  const { images } = getSectionMedia('youth')
  let groom: string | null = null
  let bride: string | null = null
  for (const url of images) {
    const lower = url.toLowerCase()
    if (lower.includes('my_youth')) groom = url
    if (lower.includes('your_youth')) bride = url
  }
  if (!groom) groom = images[0] ?? null
  if (!bride) bride = images.find((u) => u !== groom) ?? images[0] ?? null
  return { groom, bride }
}

export function getGalleryImages(section: SectionId): string[] {
  return getSectionMedia(section).images
}
