import { motion } from 'framer-motion'
import { nagoyaSteps } from '../content'
import { getGalleryImages, getHeroSource } from '../media'
import { SlideChrome } from '../components/SlideChrome'

const lineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 0.15 + i * 0.2, type: 'spring' as const, stiffness: 260, damping: 18 },
  }),
}

const textVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.18, duration: 0.55 },
  }),
}

export function SlideMet() {
  const hero = getHeroSource('nagoya')
  const photos = getGalleryImages('nagoya')

  return (
    <SlideChrome title="How We Met" subtitleKo="나고야에서 시작된 인연" hero={hero} heroDim={0.52}>
      <div className="met-layout">
        <div className="timeline">
          <motion.div className="timeline__line" variants={lineVariants} initial="hidden" animate="show" />
          <ul className="timeline__list">
            {nagoyaSteps.map((text, i) => (
              <li key={i} className="timeline__item">
                <motion.span
                  className="timeline__dot"
                  custom={i}
                  variants={dotVariants}
                  initial="hidden"
                  animate="show"
                />
                <motion.p
                  className="timeline__text"
                  custom={i}
                  variants={textVariants}
                  initial="hidden"
                  animate="show"
                >
                  {text}
                </motion.p>
              </li>
            ))}
          </ul>
        </div>
        <div className="met-photos">
          {photos.slice(0, 6).map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              className="met-photos__img"
              initial={{ opacity: 0, y: 24, rotate: i % 2 ? 2 : -2 }}
              animate={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
            />
          ))}
        </div>
      </div>
    </SlideChrome>
  )
}
