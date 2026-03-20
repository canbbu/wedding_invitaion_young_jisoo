import { motion } from 'framer-motion'
import { groom, bride } from '../content'
import { getHeroSource, getYouthProfileImages } from '../media'
import { SlideChrome } from '../components/SlideChrome'

const cardVar = {
  hidden: (side: number) => ({
    x: side < 0 ? '-120%' : '120%',
    opacity: 0,
    rotate: side < 0 ? -4 : 4,
  }),
  show: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 56, damping: 18, mass: 0.9 },
  },
}

export function SlideAbout() {
  const hero = getHeroSource('youth')
  const photos = getYouthProfileImages()

  return (
    <SlideChrome
      title="About Us"
      subtitleKo="서로를 소개합니다"
      hero={hero}
      heroDim={0.48}
    >
      <div className="about-grid">
        <motion.article
          className="profile-card profile-card--groom"
          custom={-1}
          variants={cardVar}
          initial="hidden"
          animate="show"
        >
          <div className="profile-card__ribbon">신랑</div>
          {photos.groom && (
            <div className="profile-card__photo-wrap">
              <img src={photos.groom} alt={`${groom.name} 사진`} className="profile-card__photo" />
            </div>
          )}
          <h3 className="profile-card__name">{groom.name}</h3>
          <p className="profile-card__line">{groom.parentsLabel}</p>
          <p className="profile-card__line muted">{groom.extra}</p>
          <p className="profile-card__birth">{groom.birth}</p>
          <p className="profile-card__mbti">
            <span className="profile-card__mbti-tag">{groom.mbti}</span>
            {groom.mbtiNote}
          </p>
          <p className="profile-card__blood">{groom.blood}</p>
        </motion.article>

        <motion.div
          className="about-meet-heart"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.85, type: 'spring' as const, stiffness: 220, damping: 14 }}
          aria-hidden
        >
          ♥
        </motion.div>

        <motion.article
          className="profile-card profile-card--bride"
          custom={1}
          variants={cardVar}
          initial="hidden"
          animate="show"
        >
          <div className="profile-card__ribbon">신부</div>
          {photos.bride && (
            <div className="profile-card__photo-wrap">
              <img src={photos.bride} alt={`${bride.name} 사진`} className="profile-card__photo" />
            </div>
          )}
          <h3 className="profile-card__name">{bride.name}</h3>
          <p className="profile-card__line">{bride.parentsLabel}</p>
          <p className="profile-card__line muted">{bride.extra}</p>
          <p className="profile-card__birth">{bride.birth}</p>
          <p className="profile-card__mbti">
            <span className="profile-card__mbti-tag">{bride.mbti}</span>
            {bride.mbtiNote}
          </p>
          <p className="profile-card__blood">{bride.blood}</p>
        </motion.article>
      </div>
    </SlideChrome>
  )
}
