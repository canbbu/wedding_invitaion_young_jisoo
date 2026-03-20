import { motion } from 'framer-motion'
import { proposeStory } from '../content'
import { getGalleryImages, getHeroSource } from '../media'
import { SlideChrome } from '../components/SlideChrome'

export function SlidePropose() {
  const hero = getHeroSource('propose')
  const imgs = getGalleryImages('propose')

  return (
    <SlideChrome title="The Proposal" subtitleKo="평생을 약속하며" hero={hero} heroDim={0.54}>
      <div className="propose-copy">
        {proposeStory.map((line, i) => (
          <motion.p
            key={i}
            className="propose-copy__line"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.55 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
      <div className="propose-kenburns">
        {imgs.map((src, i) => (
          <motion.div
            key={src}
            className="kenburns-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }}
          >
            <div className="kenburns-inner">
              <img src={src} alt="" className="kenburns-img" style={{ animationDelay: `${i * 0.8}s` }} />
            </div>
          </motion.div>
        ))}
      </div>
      {imgs.length === 0 && (
        <p className="empty-hint">images/propose 폴더에 사진을 넣어 주세요</p>
      )}
    </SlideChrome>
  )
}
