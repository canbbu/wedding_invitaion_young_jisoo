import { motion } from 'framer-motion'
import { daysStory } from '../content'
import { getGalleryImages, getHeroSource } from '../media'
import { SlideChrome } from '../components/SlideChrome'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const cell = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
}

export function SlideDays() {
  const hero = getHeroSource('days')
  const imgs = getGalleryImages('days')

  return (
    <SlideChrome title="Our Days Together" subtitleKo="함께한 시간들" hero={hero} heroDim={0.55}>
      <div className="days-copy">
        {daysStory.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
      <motion.div
        className="memory-wall"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {imgs.map((src) => (
          <motion.figure key={src} className="memory-wall__cell" variants={cell} whileHover={{ scale: 1.03 }}>
            <motion.img
              src={src}
              alt=""
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </motion.figure>
        ))}
      </motion.div>
      {imgs.length === 0 && (
        <p className="empty-hint">images/days 폴더에 사진을 넣어 주세요</p>
      )}
    </SlideChrome>
  )
}
