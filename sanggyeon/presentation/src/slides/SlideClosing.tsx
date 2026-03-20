import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { closingMessage } from '../content'
import { SlideChrome } from '../components/SlideChrome'

function FallingPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 53) % 100}%`,
        delay: (i % 12) * 0.25,
        duration: 9 + (i % 8),
        rot: (i % 5) - 2,
        size: 10 + (i % 8) * 2,
      })),
    [],
  )

  return (
    <div className="falling-petals" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="falling-petals__p"
          style={{
            left: p.left,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rot * 14}deg)`,
            width: p.size,
            height: p.size * 1.2,
          }}
        />
      ))}
    </div>
  )
}

export function SlideClosing() {
  return (
    <SlideChrome
      title="Closing"
      subtitleKo="감사 인사"
      hero={{ type: 'none' }}
      heroDim={0.62}
      showPetals={false}
    >
      <FallingPetals />
      <motion.div
        className="closing-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="closing-message">{closingMessage}</p>
        <p className="closing-sign">영직 · 지수</p>
      </motion.div>
    </SlideChrome>
  )
}
