import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { HeroBackdrop } from './HeroBackdrop'
import { FloatingPetals } from './FloatingPetals'

type Props = {
  title: string
  subtitleKo?: string
  hero: { type: 'video' | 'image' | 'none'; src?: string }
  heroDim?: number
  children: ReactNode
  showPetals?: boolean
  petalsDense?: boolean
}

export function SlideChrome({
  title,
  subtitleKo,
  hero,
  heroDim = 0.5,
  children,
  showPetals = true,
  petalsDense = false,
}: Props) {
  return (
    <div className="slide slide-chrome">
      <HeroBackdrop variant={hero.type} src={hero.src} dim={heroDim} />
      {showPetals && <FloatingPetals dense={petalsDense} />}
      <header className="slide-chrome__header">
        <motion.p
          className="slide-chrome__eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Journey & Our Future
        </motion.p>
        <motion.h2
          className="slide-chrome__title"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
        >
          {title}
        </motion.h2>
        {subtitleKo && (
          <motion.p
            className="slide-chrome__sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {subtitleKo}
          </motion.p>
        )}
      </header>
      <div className="slide-chrome__body">{children}</div>
    </div>
  )
}
