import { motion } from 'framer-motion'
import { getGalleryImages, getHeroSource } from '../media'
import { SlideChrome } from '../components/SlideChrome'

export function SlideFuture() {
  const hero = getHeroSource('future_kid')
  const imgs = getGalleryImages('future_kid')

  return (
    <SlideChrome
      title="Our Future"
      subtitleKo="내일의 우리를 상상하며"
      hero={hero}
      heroDim={0.56}
      petalsDense
    >
      <p className="future-lead dream-glow">A glimpse of our future child</p>
      <div className="future-sparkle" aria-hidden />
      {imgs.length > 0 && (
        <div className="future-gallery">
          <motion.figure
            className="future-spotlight"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={imgs[0]} alt="우리가 상상한 미래의 모습" className="future-spotlight__img" />
          </motion.figure>
          {imgs.length > 1 && (
            <div className="future-gallery__extras">
              {imgs.slice(1).map((src, i) => (
                <motion.figure
                  key={src}
                  className="future-spotlight__extra"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.55 }}
                >
                  <img src={src} alt={`미래 ${i + 2}`} />
                </motion.figure>
              ))}
            </div>
          )}
        </div>
      )}
      {imgs.length === 0 && (
        <p className="empty-hint">images/future_kid 폴더에 사진을 넣어 주세요</p>
      )}
    </SlideChrome>
  )
}
