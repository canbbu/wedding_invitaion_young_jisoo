import { motion } from 'framer-motion'

type Props = {
  variant: 'video' | 'image' | 'none'
  src?: string
  dim?: number
}

/** 섹션 타이틀 뒤 풀스크린 히어로 — 비디오 우선 */
export function HeroBackdrop({ variant, src, dim = 0.45 }: Props) {
  if (variant === 'none' || !src) {
    return (
      <div
        className="hero-backdrop hero-backdrop--fallback"
        aria-hidden
      />
    )
  }

  if (variant === 'video') {
    return (
      <div className="hero-backdrop">
        <video
          className="hero-backdrop__media"
          src={src}
          autoPlay
          muted
          playsInline
          loop
        />
        <motion.div
          className="hero-backdrop__veil"
          initial={{ opacity: 0 }}
          animate={{ opacity: dim }}
          transition={{ duration: 1.2 }}
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className="hero-backdrop">
      <motion.img
        className="hero-backdrop__media"
        src={src}
        alt=""
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: 'linear' }}
      />
      <div className="hero-backdrop__veil solid" style={{ opacity: dim }} aria-hidden />
    </div>
  )
}
